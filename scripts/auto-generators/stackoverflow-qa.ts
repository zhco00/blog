#!/usr/bin/env tsx

import { generateContent, isClaudeAvailable } from '../../lib/ai/claude'
import {
  extractStackOverflowMetadata,
  generateStackOverflowPrompt,
  getMockStackOverflowQuestions,
} from '../../lib/ai/prompts/stackoverflow-qa'
import { createFileViaGitHub, generateMDXContent, generateSlug } from '../../lib/github'
import { notifyAIPublish } from '../../lib/utils/notify'

/**
 * Generates and publishes weekly Stack Overflow Q&A digest
 */
async function generateStackOverflowQA(): Promise<void> {
  console.log('[Stack Overflow Q&A] Starting generation...')

  if (!isClaudeAvailable()) {
    console.warn('[Stack Overflow Q&A] Claude API not available. Using mock data.')
  }

  // In a real implementation, you would fetch actual trending questions from Stack Overflow API
  // For now, we'll use mock data
  const questions = getMockStackOverflowQuestions()
  const prompt = generateStackOverflowPrompt(questions)
  const today = new Date()

  try {
    // Generate content using Claude
    const { content, tokensUsed } = await generateContent(prompt, {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 2500,
      system:
        'You are a technical writer curating valuable Stack Overflow questions and answers for developers.',
    })

    // Extract metadata
    const { title, summary } = extractStackOverflowMetadata(content)
    const slug = generateSlug(title)

    console.log(`[Stack Overflow Q&A] Generated: "${title}" (${tokensUsed} tokens)`)

    // Generate MDX file
    const mdxContent = generateMDXContent({
      title,
      date: today,
      category: 'ai-news',
      tags: ['stackoverflow', 'qa', 'weekly', 'learning'],
      summary: summary || 'Weekly digest of interesting Stack Overflow questions and answers',
      aiGenerated: true,
      content,
    })

    // Create file via GitHub API
    const weekNumber = getWeekNumber(today)
    const filePath = `content/posts/ai-generated/stackoverflow-qa-${today.getFullYear()}-w${weekNumber}-${slug}.mdx`

    await createFileViaGitHub({
      path: filePath,
      content: mdxContent,
      message: `chore: add Stack Overflow Q&A week ${weekNumber}`,
    })

    console.log(`[Stack Overflow Q&A] Published to: ${filePath}`)

    // Send notification
    await notifyAIPublish({
      title,
      slug,
      type: 'Stack Overflow Q&A',
      tokensUsed,
    })

    console.log('[Stack Overflow Q&A] ✅ Generation completed successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[Stack Overflow Q&A] Failed - date: ${today.toISOString()}, error: ${errorMessage}`)
    throw error
  }
}

/**
 * Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStackOverflowQA()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('[Stack Overflow Q&A] Fatal error:', error)
      process.exit(1)
    })
}

export { generateStackOverflowQA }
