let removalObserver = null;

function createButton() {
  const geminiButton = document.createElement('div');
  geminiButton.className = 'gemini-summary-button-external';
  geminiButton.title = 'Gemini로 이 영상 설명 요청하기';
  geminiButton.textContent = 'Gemini';
  geminiButton.addEventListener('click', (e) => {
    e.stopPropagation();
    try {
      chrome.runtime.sendMessage({ action: 'openGemini', url: window.location.href });
    } catch (error) {
      alert("확장 프로그램이 업데이트되었습니다. 페이지를 새로고침한 후 아이콘을 다시 클릭해 주세요.");
    }
  });
  return geminiButton;
}

function insertButton(actionsContainer, likeDislikeGroup) {
  if (actionsContainer.querySelector('.gemini-summary-button-external')) return;
  actionsContainer.insertBefore(createButton(), likeDislikeGroup);

  // 버튼이 YouTube 리렌더링으로 제거될 경우 재삽입
  if (removalObserver) removalObserver.disconnect();
  removalObserver = new MutationObserver(() => {
    const container = document.querySelector('ytd-menu-renderer #top-level-buttons-computed');
    if (!container) return;
    if (!container.querySelector('.gemini-summary-button-external')) {
      const likeGroup = container.querySelector('segmented-like-dislike-button-view-model');
      if (likeGroup) insertButton(container, likeGroup);
    }
  });
  removalObserver.observe(actionsContainer, { childList: true });
}

/**
 * Gemini 버튼을 추가하는 메인 함수
 */
function addGeminiButton() {
  // watch 페이지가 아니면 종료
  if (!window.location.pathname.startsWith('/watch')) return;
  if (document.querySelector('.gemini-summary-button-external')) return;

  let attempts = 0;
  const maxAttempts = 40; // 최대 20초까지 기다립니다.

  const checkInterval = setInterval(() => {
    const actionsContainer = document.querySelector('ytd-menu-renderer #top-level-buttons-computed');
    if (actionsContainer) {
      const likeDislikeGroup = actionsContainer.querySelector('segmented-like-dislike-button-view-model');
      if (likeDislikeGroup) {
        clearInterval(checkInterval);
        insertButton(actionsContainer, likeDislikeGroup);
        return;
      }
    }
    if (++attempts >= maxAttempts) clearInterval(checkInterval);
  }, 500);
}

/**
 * 확장 프로그램을 초기화하는 함수
 */
function init() {
  // SPA 페이지 이동 시 버튼 재추가 (홈→영상 이동 포함)
  document.addEventListener('yt-navigate-finish', addGeminiButton);
  // 직접 URL 진입 시 초기 실행
  setTimeout(addGeminiButton, 1000);
}

init();
