/**
 * Gemini 버튼을 추가하는 메인 함수
 */
function addGeminiButton() {
  // 중복 추가를 막기 위한 가장 기본적인 확인
  if (document.querySelector('.gemini-summary-button')) {
    return;
  }

  let checkInterval;
  let attempts = 0;
  const maxAttempts = 40; // 최대 20초까지 더 넉넉하게 기다립니다.

  const findAndAddButton = () => {
    // 1. 가장 바깥의 안정적인 컨테이너('#movie_player')를 먼저 찾습니다.
    const moviePlayer = document.querySelector('#movie_player');

    if (moviePlayer) {
      // 2. 바깥 컨테이너를 찾았다면, 그 안에서 최종 목표('.ytp-right-controls')를 찾습니다.
      const rightControls = moviePlayer.querySelector('.ytp-right-controls');

      if (rightControls) {
        // 3. 최종 목표를 찾았으므로, 모든 확인 작업을 중단하고 버튼을 추가합니다.
        clearInterval(checkInterval);

        // 마지막으로 버튼이 없는지 한번 더 확인합니다.
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
          try {
            chrome.runtime.sendMessage({ action: 'openGemini', url: window.location.href });
          } catch (error) {
            alert("확장 프로그램이 업데이트되었습니다. 페이지를 새로고침한 후 아이콘을 다시 클릭해 주세요.");
          }
        });

        rightControls.prepend(geminiButton);
        return; // 성공했으므로 함수 종료
      }
    }

    // 아직 못 찾았거나 시도 횟수가 남았다면 계속 시도
    attempts++;
    if (attempts >= maxAttempts) {
      clearInterval(checkInterval); // 20초가 지나면 자동 중단
    }
  };

  // 0.5초마다 위의 확인 함수를 실행합니다.
  checkInterval = setInterval(findAndAddButton, 500);
}

/**
 * 확장 프로그램을 초기화하는 함수
 */
function init() {
  document.addEventListener('yt-navigate-finish', addGeminiButton);
  if (document.readyState === 'complete') {
    addGeminiButton();
  } else {
    window.addEventListener('load', addGeminiButton);
  }
}

init();