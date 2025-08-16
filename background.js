chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openGemini') {
    // 1. 나중에 Gemini 탭에서 사용할 수 있도록 영상 URL을 chrome storage에 저장
    chrome.storage.local.set({ youtubeURL: request.url }, () => {
      
      // 2. Gemini 탭을 연다.
      chrome.tabs.create({ url: 'https://gemini.google.com/' });
      
    });
    return true; // 비동기 응답을 위해 true 반환
  }
});