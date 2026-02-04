/**
 * Generates a prompt for Stack Overflow Q&A analysis
 */
export function generateStackOverflowPrompt(questions: StackOverflowQuestion[]): string {
  const questionList = questions
    .map(
      (q, index) =>
        `${index + 1}. **${q.title}**
   - Tags: ${q.tags.join(', ')}
   - Votes: ${q.votes}
   - Answers: ${q.answerCount}
   - URL: ${q.url}`
    )
    .join('\n\n')

  return `You are a technical writer curating the most interesting Stack Overflow questions and answers from this week.

Analyze these trending questions:

${questionList}

Write a comprehensive Q&A digest that:
1. Selects 3-5 most valuable questions
2. Summarizes the problem and solution
3. Explains the underlying concepts
4. Provides practical takeaways
5. Is between 800-1200 words

Format the output as Markdown with the following structure:

# Stack Overflow Digest: [Week/Theme]

## Introduction
[Brief overview of this week's trends]

## Featured Questions

### Q: [Question Title 1]
**Tags:** [Tags]

**The Problem:**
[Explanation of what the developer was trying to solve]

**The Solution:**
[Concise explanation of the accepted answer]

**Why It Matters:**
[Broader context and learning opportunity]

**Key Takeaway:**
[One-liner summary]

---

### Q: [Question Title 2]
[Repeat structure for 3-5 questions]

## Common Themes
[Analysis of patterns in this week's questions]

## Pro Tips
1. [Tip 1 based on the Q&As]
2. [Tip 2]
3. [Tip 3]

## Resources
- [Link to question 1]
- [Link to question 2]
- [Link to question 3]

Focus on questions that teach valuable concepts, not just specific bug fixes.`
}

export interface StackOverflowQuestion {
  title: string
  tags: string[]
  votes: number
  answerCount: number
  url: string
}

/**
 * Extracts metadata from generated Stack Overflow digest
 */
export function extractStackOverflowMetadata(content: string): {
  title: string
  summary: string
} {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'Stack Overflow Digest'

  const introMatch = content.match(/##\s+Introduction\s+([\s\S]+?)(?=\n##|\n\n)/)
  const summary = introMatch ? introMatch[1].trim().slice(0, 200) : ''

  return { title, summary }
}

/**
 * Mock Stack Overflow data for testing
 */
export function getMockStackOverflowQuestions(): StackOverflowQuestion[] {
  return [
    {
      title: 'How to properly type React Server Components in TypeScript?',
      tags: ['typescript', 'react', 'nextjs'],
      votes: 245,
      answerCount: 8,
      url: 'https://stackoverflow.com/questions/mock-1',
    },
    {
      title: 'Understanding Promise.all vs Promise.allSettled in error handling',
      tags: ['javascript', 'async-await', 'promises'],
      votes: 189,
      answerCount: 12,
      url: 'https://stackoverflow.com/questions/mock-2',
    },
    {
      title: 'Why does Drizzle ORM outperform Prisma in serverless environments?',
      tags: ['orm', 'database', 'performance'],
      votes: 156,
      answerCount: 6,
      url: 'https://stackoverflow.com/questions/mock-3',
    },
  ]
}
