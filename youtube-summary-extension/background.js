// 실제 webhook URL
const WEBHOOK_URL =
  "https://hook.us2.make.com/lo8hufnkcbfpbmhqyuwcgtmd4h7uyyat";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    console.log("요약 요청 받음:", request);

    // 현재 활성 탭의 URL 가져오기
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: "활성 탭을 찾을 수 없습니다." });
        return;
      }

      const url = tabs[0].url;
      console.log("현재 URL:", url);

      // YouTube URL 검증
      if (!url.includes("youtube.com/watch")) {
        sendResponse({ error: "YouTube 영상 페이지가 아닙니다." });
        return;
      }

      // 실제 webhook으로 요약 요청 전송
      console.log("webhook으로 요약 요청 전송 중...", url);

      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtube_url: url,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          // 응답이 JSON인지 확인
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            return response.json();
          } else {
            // JSON이 아닌 경우 텍스트로 처리
            return response.text().then((text) => {
              console.log("서버 응답 (텍스트):", text);
              // "Accepted" 같은 단순 응답인 경우 목업 요약 반환
              if (text.trim() === "Accepted" || text.trim() === "OK") {
                return {
                  summary:
                    "요청이 서버에서 수락되었습니다. 실제 요약 서비스가 구현되면 정확한 요약을 제공할 예정입니다.\n\n현재는 테스트 모드로, 서버 연결이 정상적으로 작동하고 있음을 확인했습니다.",
                };
              }
              return { summary: text };
            });
          }
        })
        .then((data) => {
          console.log("webhook 응답 처리 완료:", data);
          if (data && data.summary) {
            sendResponse({ summary: data.summary });
          } else {
            sendResponse({
              error: "서버에서 유효한 요약을 반환하지 않았습니다.",
            });
          }
        })
        .catch((error) => {
          console.error("webhook 요청 실패:", error);
          sendResponse({
            error: `서버 연결 실패: ${error.message}`,
          });
        });
    });

    // 비동기 응답을 위해 true 반환
    return true;
  }
});

// 확장 프로그램 설치 시 알림
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("YouTube 요약기 확장 프로그램이 설치되었습니다.");
    console.log("Webhook URL:", WEBHOOK_URL);
  }
});
