const DEFAULT_PROMPT =
`당신은 YouTube 동영상과 그 자막(Transcript)을 텍스트 문서로 변환하는 데 특화된 전문 어시스턴트입니다.
제공된 YouTube URL, 동영상, 자막을 바탕으로 콘텐츠의 완전한 텍스트 표현을 작성하세요.

**핵심 지시사항:**
정보를 요약, 축약, 또는 생략하지 마세요.
당신의 목표는 사용자가 동영상을 시청하지 않고도 언급된 모든 구체적인 세부사항, 논거, 예시, 수치를 이해할 수 있도록 최대한 상세한 설명을 제공하는 것입니다.

출력은 반드시 다음 구조를 따라야 합니다:

1. 메타데이터
  - 제목: 동영상 제목
  - 업로더: 동영상을 업로드한 채널 또는 개인의 이름
  - 길이: 동영상의 총 재생 시간(분과 초 단위)
  - URL: 동영상의 원본 YouTube URL

2. 포괄적 내용 분석:
  - 타임스탬프: 주요 주제가 전환되거나 새로운 논점이 도입될 때마다 시작 타임스탬프(예: [01:23])를 반드시 포함하세요.
  - 동영상의 모든 내용을 기술하되, 핵심 내용을 간결한 표현으로 Bullet Point List 형식으로 작성하세요. 각 Bullet Point는 하나의 주요 아이디어, 논거, 예시 또는 수치 데이터를 다루어야 합니다.

  - 전문적 정확성: 전문 용어, 고유명사, 수치 데이터에 대해 100% 정확성을 유지하세요. 모호함을 피하기 위해 핵심 용어는 "번역된 용어 (원어)" 형식을 사용하세요.

3. 핵심 메시지 및 결론
   - 화자가 언급한 최종 논거, 교훈, 또는 향후 전망을 상세히 기술하세요.
   - 화자의 최종 어조와 구체적인 마무리 발언을 포착하세요.

[제약 조건]
- 요약 금지: "간단히 말해", "요약하면" 등의 표현을 사용하지 마세요. 모든 내용을 다루세요.
- 엄격한 준수: 제공된 자막에만 엄격히 기반하세요. 외부 지식을 추가하지 말되, 자막의 정보를 누락하지도 마세요.
- 어조: 객관적이고, 서술적이며, 철저하게.
- 언어: 영어로 사고하되, 최종 출력은 반드시 한국어로만 제공하세요.

\${url} 동영상 보기
`;

const textarea = document.getElementById('promptTextarea');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const status = document.getElementById('status');

// 저장된 프롬프트 불러오기
chrome.storage.local.get(['customPrompt'], (result) => {
  textarea.value = result.customPrompt !== undefined ? result.customPrompt : DEFAULT_PROMPT;
});

// 저장
saveBtn.addEventListener('click', () => {
  chrome.storage.local.set({ customPrompt: textarea.value }, () => {
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 2000);
  });
});

// 기본값 초기화
resetBtn.addEventListener('click', () => {
  if (confirm('프롬프트를 기본값으로 초기화하시겠습니까?')) {
    textarea.value = DEFAULT_PROMPT;
    chrome.storage.local.set({ customPrompt: DEFAULT_PROMPT }, () => {
      status.classList.add('show');
      setTimeout(() => status.classList.remove('show'), 2000);
    });
  }
});
