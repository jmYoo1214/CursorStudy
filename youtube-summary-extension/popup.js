// 별도 팝업 창으로 요약 결과를 표시하는 함수
function openSummaryPopup(summary) {
  const popupContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>YouTube 요약 결과</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background: #f8f9fa;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e9ecef;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0 0 8px 0;
        }
        .subtitle {
          color: #666;
          font-size: 14px;
        }
        .notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 20px;
          color: #856404;
          font-size: 13px;
        }
        .summary-content {
          background: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.7;
          color: #333;
          border: 1px solid #e9ecef;
        }
        .actions {
          margin-top: 20px;
          text-align: center;
        }
        .btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          margin: 0 8px;
        }
        .btn:hover {
          background: #3730a3;
        }
        .btn-secondary {
          background: #6b7280;
        }
        .btn-secondary:hover {
          background: #4b5563;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">🎥 YouTube 요약 결과</h1>
          <p class="subtitle">요약이 완료되었습니다</p>
        </div>
        <div class="summary-content">${summary}</div>
        <div class="actions">
          <button class="btn" onclick="copyToClipboard()">📋 복사</button>
          <button class="btn btn-secondary" onclick="window.close()">❌ 닫기</button>
        </div>
      </div>
      <script>
        function copyToClipboard() {
          const summaryText = document.querySelector('.summary-content').textContent;
          navigator.clipboard.writeText(summaryText).then(() => {
            alert('요약이 클립보드에 복사되었습니다!');
          }).catch(() => {
            // 폴백: 텍스트 선택
            const range = document.createRange();
            range.selectNode(document.querySelector('.summary-content'));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            alert('텍스트가 선택되었습니다. Ctrl+C로 복사하세요.');
          });
        }
      </script>
    </body>
    </html>
  `;

  // 새 팝업 창 열기
  const popup = window.open(
    "",
    "youtube-summary",
    "width=700,height=600,scrollbars=yes,resizable=yes"
  );
  if (popup) {
    popup.document.write(popupContent);
    popup.document.close();
    popup.focus();
  } else {
    alert("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const summarizeBtn = document.getElementById("summarizeBtn");
  const summaryDiv = document.getElementById("summary");
  const urlInfoDiv = document.getElementById("urlInfo");

  // 현재 탭의 URL 확인
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;

    if (currentUrl.includes("youtube.com/watch")) {
      urlInfoDiv.textContent = `현재 영상: ${currentUrl}`;
      urlInfoDiv.style.display = "block";
    } else {
      urlInfoDiv.textContent = "YouTube 영상 페이지가 아닙니다.";
      urlInfoDiv.style.display = "block";
      urlInfoDiv.style.background = "#fff3cd";
      urlInfoDiv.style.color = "#856404";
      summarizeBtn.disabled = true;
    }
  });

  summarizeBtn.addEventListener("click", function () {
    // 버튼 비활성화 및 로딩 상태 표시
    summarizeBtn.disabled = true;
    summarizeBtn.textContent = "요약 중...";
    summaryDiv.textContent = "";
    summaryDiv.className = "loading";
    summaryDiv.textContent =
      "YouTube 영상을 분석하고 요약을 생성하고 있습니다...";

    // 백그라운드 스크립트에 요약 요청 전송
    chrome.runtime.sendMessage({ action: "summarize" }, function (response) {
      // 버튼 상태 복원
      summarizeBtn.disabled = false;
      summarizeBtn.textContent = "요약하기";

      // 오류 확인
      if (chrome.runtime.lastError) {
        console.error("Chrome runtime error:", chrome.runtime.lastError);
        summaryDiv.className = "error";
        summaryDiv.textContent = `확장 프로그램 오류: ${chrome.runtime.lastError.message}`;
        return;
      }

      console.log("응답 받음:", response);

      if (response && response.summary) {
        // 별도 팝업 창으로 요약 결과 표시
        openSummaryPopup(response.summary);
        summaryDiv.textContent = "요약이 새 창에서 열렸습니다.";
        summaryDiv.className = "";
      } else if (response && response.error) {
        summaryDiv.className = "error";
        summaryDiv.textContent = `오류: ${response.error}`;
      } else {
        summaryDiv.className = "error";
        summaryDiv.textContent =
          "요약을 불러오지 못했습니다. 서버를 확인해주세요.";
      }
    });
  });
});
