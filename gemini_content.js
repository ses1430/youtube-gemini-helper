// 페이지가 완전히 로드된 후에 스크립트를 실행합니다.
window.onload = () => {
  // background.js가 저장해 둔 유튜브 URL을 가져옵니다.
  chrome.storage.local.get(['youtubeURL'], (result) => {
    // 저장된 URL이 있을 경우에만 아래 로직을 실행합니다.
    if (result.youtubeURL) {
      const url = result.youtubeURL;
      const promptText = 
`You are an expert assistant specialized in converting YouTube videos and their transcripts into comprehensive, detailed text documents.Based on the provided YouTube URL, video, and transcript, create a full textual representation of the content.

**CRITICAL INSTRUCTION:**
Do NOT summarize, condense, or abbreviate the information.
Your goal is to provide a maximally detailed account of the video so the user can understand every specific detail, argument, example, and number mentioned without watching the video.

The output must follow this structure:

1. Metadata
  - Title: The exact or most appropriate title of the video.
  - Uploader: The name of the channel or individual who uploaded the video.
  - Length: The total duration of the video in minutes and seconds.

2. Comprehensive Content Breakdown:
   - Reconstruct the video's content chronologically or logically.
   - Include all details: Specific numbers, dates, proper nouns, quotes, and examples must be preserved.
   - Explain fully: Instead of short bullet points, use full sentences or detailed paragraphs to explain the speaker's logic and context.
   - If the video compares A and B, detail every aspect of the comparison.
   - If the video tells a story, include the beginning, middle, and end in detail.
   - Timestamping: Mandatory inclusion of start timestamps (e.g., [01:23]) whenever there is a shift in the main topic or a new point of discussion is introduced.
   - Professional Accuracy: Maintain 100% accuracy for technical jargon, proper nouns, and numerical data. To avoid ambiguity, use the format "Translated Term (Original Term)" for key terminology.

3. Core Message & Conclusion
   - Detail the final arguments, lessons, or future outlooks mentioned by the speaker.
   - Capture the speaker's final tone and specific closing remarks.

[Constraints]
- NO SUMMARIZATION: Do not use phrases like "In short" or "Briefly." Cover everything.
- Strict Adherence: Stick strictly to the provided transcript. Do not add outside knowledge, but do not omit information from the transcript.
- Tone: Objective, descriptive, and thorough.
- Language: Think in English, but provide the final output ONLY in Korean.

${url} 동영상 보기
`;

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