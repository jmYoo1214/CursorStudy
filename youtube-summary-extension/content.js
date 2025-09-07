// YouTube 페이지에서 실행되는 content script
console.log("YouTube 요약기 content script가 로드되었습니다.");

// YouTube 페이지의 영상 정보 추출 함수들
function getVideoTitle() {
  const titleElement = document.querySelector(
    "h1.title yt-formatted-string, h1.title"
  );
  return titleElement ? titleElement.textContent.trim() : null;
}

function getVideoDescription() {
  const descriptionElement = document.querySelector("#description-text");
  return descriptionElement ? descriptionElement.textContent.trim() : null;
}

function getVideoChannel() {
  const channelElement = document.querySelector(
    "#owner-name a, #channel-name a"
  );
  return channelElement ? channelElement.textContent.trim() : null;
}

function getVideoDuration() {
  const durationElement = document.querySelector(".ytp-time-duration");
  return durationElement ? durationElement.textContent.trim() : null;
}

function getVideoViews() {
  const viewsElement = document.querySelector("#count .view-count");
  return viewsElement ? viewsElement.textContent.trim() : null;
}

// 페이지 로드 완료 후 영상 정보 추출
function extractVideoInfo() {
  const videoInfo = {
    title: getVideoTitle(),
    channel: getVideoChannel(),
    description: getVideoDescription(),
    duration: getVideoDuration(),
    views: getVideoViews(),
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  console.log("추출된 영상 정보:", videoInfo);
  return videoInfo;
}

// YouTube 페이지 변경 감지 (SPA 특성상 필요)
let currentUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    console.log("YouTube 페이지 변경 감지:", currentUrl);

    // 새 페이지 로드 후 잠시 대기하여 DOM이 완전히 로드되도록 함
    setTimeout(() => {
      extractVideoInfo();
    }, 2000);
  }
});

// 페이지 변경 감지 시작
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// 초기 영상 정보 추출
setTimeout(() => {
  extractVideoInfo();
}, 1000);

// 백그라운드 스크립트와의 메시지 통신
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoInfo") {
    const videoInfo = extractVideoInfo();
    sendResponse(videoInfo);
  }
});
