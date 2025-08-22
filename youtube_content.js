/**
 * 특정 요소가 DOM에 나타날 때까지 기다리는 함수
 * @param {string} selector - 기다릴 요소의 CSS 선택자
 * @param {function} callback - 요소가 찾아지면 실행될 콜백 함수
 */
function waitForElement(selector, callback) {
  let attempts = 0;
  const maxAttempts = 20; // 최대 10초 동안 시도 (20 * 500ms)
  
  const interval = setInterval(() => {
    const element = document.querySelector(selector);
    
    if (element) {
      // 요소를 찾았으면 인터벌을 멈추고 콜백 함수를 실행
      clearInterval(interval);
      callback(element);
    }
    
    attempts++;
    if (attempts >= maxAttempts) {
      // 너무 오래 기다렸으면 인터벌을 멈추고 오류를 기록
      clearInterval(interval);
      console.error(`[YouTube to Gemini Helper] Error: '${selector}' 요소를 찾을 수 없습니다.`);
    }
  }, 500); // 0.5초마다 확인
}

/**
 * Gemini 버튼을 추가하는 메인 함수
 */
function addGeminiButton() {
  // 버튼이 이미 존재하면 아무것도 하지 않음 (중복 실행 방지)
  if (document.querySelector('.gemini-summary-button')) {
    return;
  }
  
  // '.ytp-right-controls' 요소가 나타날 때까지 기다림
  waitForElement('.ytp-right-controls', (rightControls) => {
    // 기다린 후에도 버튼이 없는지 다시 한번 확인
    if (rightControls.querySelector('.gemini-summary-button')) {
      return;
    }

    const geminiButton = document.createElement('button');
    geminiButton.className = 'ytp-button gemini-summary-button';
    geminiButton.title = 'Gemini로 이 영상 설명 요청하기';

    const iconURL = chrome.runtime.getURL('gemini_logo.png');
    geminiButton.innerHTML = `<img src="${iconURL}" class="gemini-logo-img">`;

    geminiButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const videoURL = window.location.href;
      chrome.runtime.sendMessage({ action: 'openGemini', url: videoURL });
    });

    rightControls.prepend(geminiButton);
  });
}

// 유튜브의 페이지 이동(내비게이션)이 완료될 때마다 버튼 추가 함수를 실행
document.addEventListener('yt-navigate-finish', addGeminiButton);

// 스크립트가 처음 로드되었을 때도(새로고침 등) 함수를 한 번 실행
addGeminiButton();