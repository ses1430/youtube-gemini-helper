// 페이지가 완전히 로드된 후에 스크립트를 실행합니다.
window.onload = () => {
  // background.js가 저장해 둔 유튜브 URL을 가져옵니다.
  chrome.storage.local.get(['youtubeURL'], (result) => {
    // 저장된 URL이 있을 경우에만 아래 로직을 실행합니다.
    if (result.youtubeURL) {
      const url = result.youtubeURL;
      const promptText = `당신은 유튜브 링크의 영상과 스크립트를 분석하여 구조화된 요약본을 생성하는 전문 어시스턴트입니다.
제공된 유튜브 URL의 영상과 스크립트를 기반으로, 영상의 전체적인 흐름과 핵심 정보를 빠르게 파악할 수 있도록 상세한 정리 자료를 작성해 주세요.

결과물은 다음 구조를 따라야 합니다:

1.  **제목:** 영상의 주제를 명확히 나타내는 제목
2.  **전체 요약:** 영상의 핵심 주제와 결론을 2-3문장으로 간결하게 요약
3.  **주요 내용:**
    * 영상에서 논의된 주요 주장, 정보, 주제들을 논리적 순서(또는 중요도 순)에 따라 상세하게 기술합니다. (글머리 기호 사용)
    * 각 항목은 스크립트의 내용을 충실히 반영해야 합니다.
4.  **핵심 시사점 및 결론:**
    * 영상의 마지막 부분이나 본문에서 화자가 '명시적으로' 제시하는 결론, 교훈, 또는 시사점을 별도로 정리합니다.

[제약 조건]
* 영상이 섹션으로 구분되어 있다면 주요 내용 역시 섹션별로 나누어 작성합니다.
* 스크립트에 근거하지 않은 추론이나 외부 정보는 절대 포함하지 마세요.
* 어조는 객관적이고 정보 전달에 충실한 중립적인 톤을 유지해야 합니다. ${url}`;

      const interval = setInterval(() => {
        const promptInput = document.querySelector('rich-textarea > div[contenteditable="true"]');

        if (promptInput) {
          clearInterval(interval);

          // 1. 프롬프트 입력
          promptInput.textContent = promptText;

          // ▼▼▼▼▼ 1초 대기 로직 추가 ▼▼▼▼▼
          // setTimeout을 사용해 1000밀리초(1초) 후에 내부 코드를 실행합니다.
          setTimeout(() => {
            // 2. (1초 후) 전송 버튼 찾기 (한국어와 영어 UI 모두 대응)
            const submitButton = document.querySelector('button[aria-label="메시지 보내기"], button[aria-label="Send message"]');
            
            console.log("1초 후 찾은 전송 버튼:", submitButton); // 디버깅용 로그

            // 3. (1초 후) 전송 버튼 클릭
            if (submitButton) {
              submitButton.click();
            } else {
              console.error("1초 후에도 전송 버튼을 찾을 수 없습니다! 선택자를 다시 확인하세요.");
            }

            // 4. (1초 후) 작업 완료 후, 저장된 URL 삭제
            chrome.storage.local.remove('youtubeURL');
            
          }, 1000); // 1000밀리초 = 1초
          // ▲▲▲▲▲ 여기까지 수정 ▲▲▲▲▲
        }
      }, 500);
    }
  });
};