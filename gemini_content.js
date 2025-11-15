// 페이지가 완전히 로드된 후에 스크립트를 실행합니다.
window.onload = () => {
  // background.js가 저장해 둔 유튜브 URL을 가져옵니다.
  chrome.storage.local.get(['youtubeURL'], (result) => {
    // 저장된 URL이 있을 경우에만 아래 로직을 실행합니다.
    if (result.youtubeURL) {
      const url = result.youtubeURL;
      const promptText = `You are an expert assistant specialized in analyzing YouTube videos and their transcripts to generate structured summaries. 
Based on the provided YouTube URL, video, and transcript, create a detailed summary that allows for a quick understanding of the video's overall flow and core information.

The output must follow this structure:
1. Title: A clear title that reflects the video's main topic.
2. Overall Summary: A concise summary (2-3 sentences) of the video's core theme and conclusion.
3. Key Content:
  - Detail the main arguments, information, and topics discussed in the video in logical order (or order of importance). (Use bullet points)
  - Each point must faithfully reflect the content of the transcript.
4. Key Takeaways and Conclusion:
  - Separately summarize the conclusion, lessons, or implications that the speaker explicitly states, whether in the main body or at the end of the video.

[Constraints]
If the video is divided into sections, the 'Key Content' should also be organized by these sections.
Absolutely do not include inferences or external information not based on the transcript.
The tone must remain objective, neutral, and strictly informational.
Think in English, but provide the final summary output only in Korean. ${url}`;

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