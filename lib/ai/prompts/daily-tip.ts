/**
 * Generates a structured prompt for daily AI blog post
 */
export function generateDailyTipPrompt(date: Date): string {
  const formattedDate = date.toISOString().split('T')[0]

  return `You are a thoughtful writer for a personal tech blog. Write a daily post in Korean.

Today's date: ${formattedDate}

You have full freedom to choose ANY topic. Rotate between different areas each day:
- Software development tips & best practices
- Technology trends & news analysis
- Developer productivity & tools
- Career advice for developers
- Tech industry insights
- Interesting open source projects
- Life & work balance for developers
- Learning strategies & resources

Requirements:
1. Write in Korean (한국어)
2. Choose a fresh, interesting topic
3. Be practical and actionable
4. 300-600 words
5. Include code examples when relevant
6. Use a conversational, friendly tone

Format the output as Markdown:

# [제목]

## 개요
[1-2문장 소개]

## 본문
[핵심 내용]

## 마무리
- 핵심 포인트 1
- 핵심 포인트 2
- 핵심 포인트 3

Generate a unique and engaging post. Avoid generic or overused topics.`
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

  const overviewMatch = content.match(/##\s+개요\s+([\s\S]+?)(?=\n##|\n\n)/)
  const summary = overviewMatch ? overviewMatch[1].trim().slice(0, 200) : ''

  return { title, summary }
}
