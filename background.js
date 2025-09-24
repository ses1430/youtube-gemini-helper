// 확장 프로그램이 설치되거나 업데이트될 때 한 번만 실행됩니다.
chrome.runtime.onInstalled.addListener(() => {
  // 컨텍스트 메뉴 항목을 생성합니다.
  chrome.contextMenus.create({
    id: "summarizeWithGemini", // 메뉴 항목의 고유 ID
    title: "Gemini로 이 영상 설명하기", // 메뉴에 표시될 텍스트
    contexts: ["video"], // 메뉴가 표시될 조건: <video> 태그 위에서 우클릭했을 때
    documentUrlPatterns: ["*://*.youtube.com/watch*"] // 유튜브 영상 페이지에서만 메뉴가 나타나도록 제한
  });
});

// 컨텍스트 메뉴 항목이 클릭되었을 때 실행될 리스너를 추가합니다.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  // 우리가 만든 메뉴 항목이 클릭된 것인지 확인합니다.
  if (info.menuItemId === "summarizeWithGemini") {
    // 클릭된 탭의 URL(영상 페이지 주소)을 가져옵니다.
    const videoURL = tab.url;
    console.log("Clicked video URL:", videoURL);

    if (videoURL) {
      // 1. Gemini 탭에서 사용할 수 있도록 영상 URL을 chrome storage에 저장합니다.
      chrome.storage.local.set({ youtubeURL: videoURL }, () => {
        // 2. Gemini 탭을 엽니다.
        chrome.tabs.create({ url: 'https://gemini.google.com/' });
      });
    }
  }
});