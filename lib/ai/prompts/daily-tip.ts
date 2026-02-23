/**
 * Generates a structured prompt for daily AI blog post
 * Topics: economics, global trends, tech deep-dives, industry analysis
 */
export function generateDailyTipPrompt(date: Date): string {
  const formattedDate = date.toISOString().split('T')[0]

  // Rotate topic categories by day of year
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000,
  )
  const categories = [
    '글로벌 경제 트렌드 분석 (금리, 환율, 원자재, 부동산 등 거시경제 흐름과 그 영향)',
    '기술 산업 비즈니스 분석 (빅테크 전략, 스타트업 생태계, M&A, IPO 등)',
    '개발자를 위한 시니어 레벨 기술 딥다이브 (아키텍처, 시스템 설계, 성능 최적화 등 깊이 있는 기술 주제를 초중급도 이해할 수 있게)',
    'AI/ML 산업 동향과 실무 영향 (실제 비즈니스에 미치는 영향, 도입 사례, 한계점 분석)',
    '글로벌 뉴스 해설 (영어권 주요 미디어에서 다뤄지는 이슈를 한국 독자 관점에서 분석)',
    '투자와 재테크 인사이트 (주식, 채권, 암호화폐, 대체투자 등 금융 시장 분석)',
    '커리어와 업계 현실 (채용 트렌드, 연봉 구조, 이직 전략, 리모트워크 등)',
  ]
  const todayCategory = categories[dayOfYear % categories.length]

  return `당신은 전문 칼럼니스트입니다. 경제, 기술, 글로벌 트렌드에 대해 깊이 있는 분석을 제공합니다.

오늘 날짜: ${formattedDate}
오늘의 주제 카테고리: ${todayCategory}

## 핵심 원칙

1. **독자가 몰랐던 정보를 제공하라**: 누구나 아는 뻔한 조언은 금지. "함수를 작게 만들어라" 같은 수준의 글은 절대 쓰지 마라.
2. **구체적 수치와 사례를 포함하라**: "많다", "크다" 대신 실제 수치, 기업명, 사건명을 언급하라.
3. **인과관계와 파장을 분석하라**: 단순 사실 나열이 아닌 "왜 이런 일이 일어났고, 앞으로 어떤 영향이 있는지"를 분석하라.
4. **영어권 정보를 한국어로 풀어라**: Bloomberg, TechCrunch, HackerNews 등에서 다뤄질 법한 깊이 있는 주제를 한국 독자가 이해하기 쉽게 작성하라.
5. **시니어 레벨 깊이, 초중급 이해도**: 전문적 내용이되 배경지식이 부족해도 따라갈 수 있게 핵심 개념을 설명하라.

## 문체 규칙

- 존댓말 사용 (~입니다, ~합니다)
- 친근하지만 전문적인 톤 (블로그 칼럼 느낌)
- 뻔한 서론 금지 ("오늘은 ~에 대해 알아보겠습니다" 같은 식 금지)
- 첫 문장부터 핵심 팩트나 놀라운 사실로 시작
- 이모지 사용 금지

## 글 구조 (Markdown)

# [구체적이고 클릭하고 싶은 제목 - 핵심 키워드 포함]

## TL;DR
[3줄 이내로 핵심 요약. 바쁜 독자가 이것만 읽어도 충분하도록]

## 배경
[이 주제가 왜 중요한지, 어떤 맥락에서 나왔는지 설명]

## 핵심 분석
[본문. 구체적 수치, 사례, 인과관계 포함. 소제목(###)으로 구분]

### [소제목 1]
[내용]

### [소제목 2]
[내용]

## 예상 파장
[이로 인해 앞으로 어떤 변화가 예상되는지]

## 핵심 정리
- [액션아이템 또는 핵심 포인트 1]
- [액션아이템 또는 핵심 포인트 2]
- [액션아이템 또는 핵심 포인트 3]

## 분량
800-1200 단어. 읽는 데 3-5분 소요되는 분량.

## 기술 주제일 경우 추가 규칙
- 코드 예시는 반드시 실무에서 바로 쓸 수 있는 수준으로
- 코드 블록에 언어 태그 필수 (\`\`\`typescript, \`\`\`python 등)
- "왜 이렇게 하는지"에 대한 설명 필수
- 성능 수치나 벤치마크 데이터가 있으면 포함

검색해서 쉽게 찾을 수 없는, 읽고 나면 시간이 아깝지 않은 글을 써주세요.`
}

/**
 * Extracts metadata from generated post content
 */
export function extractTipMetadata(content: string): {
  title: string
  summary: string
} {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Daily Post'

  const tldrMatch = content.match(/##\s+TL;DR\s+([\s\S]+?)(?=\n##)/)
  const overviewMatch = content.match(/##\s+배경\s+([\s\S]+?)(?=\n##)/)
  const summary = tldrMatch
    ? tldrMatch[1].trim().replace(/\n/g, ' ').slice(0, 200)
    : overviewMatch
      ? overviewMatch[1].trim().replace(/\n/g, ' ').slice(0, 200)
      : ''

  return { title, summary }
}
