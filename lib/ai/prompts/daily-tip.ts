/**
 * Generates a structured prompt for daily development tips
 */
export function generateDailyTipPrompt(date: Date): string {
  const formattedDate = date.toISOString().split('T')[0]

  return `You are a senior software engineer writing a daily development tip for a technical blog.

Today's date: ${formattedDate}

Write a concise, actionable development tip that:
1. Focuses on a single, practical concept
2. Includes a brief code example (if applicable)
3. Explains why it matters
4. Is between 300-500 words
5. Uses clear, beginner-friendly language

Categories to rotate through:
- JavaScript/TypeScript best practices
- React/Next.js patterns
- Performance optimization
- Security tips
- Testing strategies
- DevOps/CI-CD
- Code quality and maintainability
- Git workflows
- Developer productivity

Format the output as Markdown with the following structure:

# [Catchy Title]

## Overview
[Brief introduction - 1-2 sentences]

## The Tip
[Main explanation with code example if applicable]

## Why It Matters
[Practical benefits and use cases]

## Quick Example
\`\`\`typescript
// Concise, runnable example
\`\`\`

## Key Takeaways
- Bullet point 1
- Bullet point 2
- Bullet point 3

Generate a fresh, unique tip that hasn't been overused. Avoid generic advice.`
}

/**
 * Extracts metadata from generated tip content
 */
export function extractTipMetadata(content: string): {
  title: string
  summary: string
} {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Daily Development Tip'

  const overviewMatch = content.match(/##\s+Overview\s+([\s\S]+?)(?=\n##|\n\n)/)
  const summary = overviewMatch ? overviewMatch[1].trim().slice(0, 200) : ''

  return { title, summary }
}
