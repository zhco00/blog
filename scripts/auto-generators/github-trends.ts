#!/usr/bin/env tsx

import { generateContent, isClaudeAvailable } from '../../lib/ai/claude'
import {
  extractGithubMetadata,
  generateGithubAnalysisPrompt,
  getMockGithubRepos,
} from '../../lib/ai/prompts/github-analysis'
import { createFileViaGitHub, generateMDXContent, generateSlug } from '../../lib/github'
import { notifyAIPublish } from '../../lib/utils/notify'

/**
 * Generates and publishes weekly GitHub trending analysis
 */
async function generateGithubTrends(): Promise<void> {
  console.log('[GitHub Trends] Starting generation...')

  if (!isClaudeAvailable()) {
    console.warn('[GitHub Trends] Claude API not available. Using mock data.')
  }

  // In a real implementation, you would fetch actual trending repos from GitHub API
  // For now, we'll use mock data
  const repos = getMockGithubRepos()
  const prompt = generateGithubAnalysisPrompt(repos)
  const today = new Date()

  try {
    // Generate content using Claude
    const { content, tokensUsed } = await generateContent(prompt, {
      model: 'claude-sonnet-4-20250514',
      maxTokens: 2500,
      system:
        'You are a technical analyst providing insights on trending GitHub repositories for developers.',
    })

    // Extract metadata
    const { title, summary } = extractGithubMetadata(content)
    const slug = generateSlug(title)

    console.log(`[GitHub Trends] Generated: "${title}" (${tokensUsed} tokens)`)

    // Generate MDX file
    const mdxContent = generateMDXContent({
      title,
      date: today,
      category: 'ai-github',
      tags: ['github', 'trending', 'open-source', 'weekly'],
      summary: summary || 'Weekly analysis of trending GitHub repositories',
      aiGenerated: true,
      content,
    })

    // Create file via GitHub API
    const weekNumber = getWeekNumber(today)
    const filePath = `content/posts/ai-generated/github-trends-${today.getFullYear()}-w${weekNumber}-${slug}.mdx`

    await createFileViaGitHub({
      path: filePath,
      content: mdxContent,
      message: `chore: add GitHub trends week ${weekNumber}`,
    })

    console.log(`[GitHub Trends] Published to: ${filePath}`)

    // Send notification
    await notifyAIPublish({
      title,
      slug,
      type: 'GitHub Trends',
      tokensUsed,
    })

    console.log('[GitHub Trends] ✅ Generation completed successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[GitHub Trends] Failed - date: ${today.toISOString()}, error: ${errorMessage}`)
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
  generateGithubTrends()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('[GitHub Trends] Fatal error:', error)
      process.exit(1)
    })
}

export { generateGithubTrends }
