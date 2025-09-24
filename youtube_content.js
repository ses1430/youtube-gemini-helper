/**
 * Gemini 버튼을 추가하는 메인 함수
 */
function addGeminiButton() {
  // 중복 추가를 막기 위한 가장 기본적인 확인
  if (document.querySelector('.gemini-summary-button-external')) {
    return;
  }

  let checkInterval;
  let attempts = 0;
  const maxAttempts = 40; // 최대 20초까지 기다립니다.

  const findAndAddButton = () => {
    const actionsContainer = document.querySelector('ytd-menu-renderer #top-level-buttons-computed');

    if (actionsContainer) {
      const likeDislikeGroup = actionsContainer.querySelector('segmented-like-dislike-button-view-model');

      if (likeDislikeGroup) {
        clearInterval(checkInterval);

        if (actionsContainer.querySelector('.gemini-summary-button-external')) {
          return;
        }

        const geminiButton = document.createElement('div');
        geminiButton.className = 'gemini-summary-button-external';
        geminiButton.title = 'Gemini로 이 영상 설명 요청하기';

        // ▼▼▼▼▼ 아이콘 대신 텍스트를 넣도록 이 부분을 수정합니다 ▼▼▼▼▼
        geminiButton.textContent = 'Gemini';
        // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

        geminiButton.addEventListener('click', (e) => {
          e.stopPropagation();
          try {
            chrome.runtime.sendMessage({ action: 'openGemini', url: window.location.href });
          } catch (error) {
            alert("확장 프로그램이 업데이트되었습니다. 페이지를 새로고침한 후 아이콘을 다시 클릭해 주세요.");
          }
        });
        
        actionsContainer.insertBefore(geminiButton, likeDislikeGroup);
        return; 
      }
    }

    attempts++;
    if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
    }
  };

  checkInterval = setInterval(findAndAddButton, 500);
}

/**
 * 확장 프로그램을 초기화하는 함수
 */
function init() {
  document.addEventListener('yt-navigate-finish', addGeminiButton);
  setTimeout(addGeminiButton, 1000);
}

init();