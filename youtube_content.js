// 버튼이 이미 추가되었는지 확인하는 플래그
let isButtonAdded = false;

// YouTube 컨트롤 바가 로드될 때까지 주기적으로 확인
const observer = new MutationObserver(() => {
  // 컨트롤 바 우측 영역을 찾음
  const rightControls = document.querySelector('.ytp-right-controls');
  
  if (rightControls && !isButtonAdded) {
    isButtonAdded = true; // 버튼 추가 플래그 설정
    
    // 1. 버튼 엘리먼트 생성
    const geminiButton = document.createElement('button');
    geminiButton.className = 'ytp-button gemini-summary-button';
    geminiButton.title = 'Gemini로 설명 요청';

    // 버튼에 들어갈 아이콘
    const iconURL = chrome.runtime.getURL('gemini_logo.png');
    geminiButton.innerHTML = `<img src="${iconURL}" class="gemini-logo-img">`;

    // 2. 버튼 클릭 이벤트 리스너 추가
    geminiButton.addEventListener('click', () => {
      const videoURL = window.location.href;
      // background.js로 메시지 전송
      chrome.runtime.sendMessage({ action: 'openGemini', url: videoURL });
    });

    // 3. 컨트롤 바에 버튼 삽입
    rightControls.prepend(geminiButton); // prepend를 사용해 가장 왼쪽에 추가
    
    observer.disconnect(); // 버튼을 추가했으므로 관찰 중지
  }
});

// 페이지 DOM 변경 감지 시작
observer.observe(document.body, { childList: true, subtree: true });