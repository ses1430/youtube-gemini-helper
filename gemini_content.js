// 페이지가 완전히 로드된 후에 스크립트를 실행합니다.
window.onload = () => {
  // background.js가 저장해 둔 유튜브 URL을 가져옵니다.
  chrome.storage.local.get(['youtubeURL'], (result) => {
    // 저장된 URL이 있을 경우에만 아래 로직을 실행합니다.
    if (result.youtubeURL) {
      const url = result.youtubeURL;
      const promptText = 
      `당신은 유튜브 영상 스크립트를 요약하는 유용한 어시스턴트입니다. 
      제공된 유튜브 URL 영상을 바탕으로, 영상의 핵심 내용과 주요 시사점을 포함된 정리 자료를 작성해 주세요. 자세하면 자세할 수록 좋습니다.
      명확한 제목을 붙이고, 논의된 주요 주장이나 주제는 글머리 기호(bullet points)를 사용하여 구조화해주세요. 스크립트에 없는 내용은 추가하지 마세요. 
      어조는 정보 전달에 충실하며 중립적인 톤을 유지해야 합니다. : ${url}`;
      console.log(promptText);

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