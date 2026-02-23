#!/usr/bin/env tsx

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Load .env file for local execution
try {
  const envPath = resolve(process.cwd(), '.env')
  const envContent = readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex)
    const value = trimmed.slice(eqIndex + 1)
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
} catch {
  // .env file not found, rely on environment variables (CI/CD)
}

import { generateContent, isClaudeAvailable } from '../../lib/ai/claude'
import { DAILY_POST_SYSTEM_PROMPT, extractTipMetadata, generateDailyTipPrompt } from '../../lib/ai/prompts/daily-tip'
import { createFileViaGitHub, generateMDXContent, generateSlug } from '../../lib/github'
import { notifyAIPublish } from '../../lib/utils/notify'

/**
 * Validates that AI-generated content is complete and not truncated
 */
function validateContentCompleteness(content: string): boolean {
  const hasFootnotes = /\[\^(\d+)\]:/.test(content)
  const hasTable = content.includes('|---')
  const hasMinLength = content.length > 1000
  const hasSummary = content.includes('## 핵심 요약')
  const hasInsight = content.includes('## 시사점')

  const passed = hasFootnotes && hasTable && hasMinLength && hasSummary && hasInsight
  if (!passed) {
    console.warn(`[Validation] footnotes=${hasFootnotes} table=${hasTable} summary=${hasSummary} insight=${hasInsight} length=${content.length}`)
  }
  return passed
}

/**
 * Generates and publishes a daily development tip
 */
async function generateDailyTip(): Promise<void> {
  console.log('[Daily Tip] Starting generation...')

  const useFallback = !isClaudeAvailable()
  if (useFallback) {
    console.warn('[Daily Tip] Claude API not available. Using fallback content.')
  }

  const today = new Date()
  const prompt = generateDailyTipPrompt(today)

  try {
    // Generate content using Claude (or fallback when API key is missing)
    const fallbackContent = `# Daily Development Tip: Small Functions, Big Wins

## Overview
Keep functions small and focused on one responsibility. It improves readability, testing, and refactoring speed.

## The Tip
When a function starts doing validation, transformation, and side effects together, split it.

## Why It Matters
Small functions reduce cognitive load and make bug isolation faster.

## Quick Example
\`\`\`typescript
function parseUser(input: string) {
  return JSON.parse(input)
}
\`\`\`

## Key Takeaways
- One function, one clear purpose
- Smaller units are easier to test
- Refactors become safer over time`

    const maxTokens = Number.parseInt(process.env.AI_DAILY_TIP_MAX_TOKENS || '12000')
    const maxAttempts = 3
    let content = ''
    let tokensUsed = 0

    if (useFallback) {
      content = fallbackContent
    } else {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const result = await generateContent(prompt, {
            model: 'claude-sonnet-4-20250514',
            maxTokens,
            system: DAILY_POST_SYSTEM_PROMPT,
            webSearch: true,
          })
          content = result.content
          tokensUsed = result.tokensUsed

          if (validateContentCompleteness(content)) {
            break
          }

          console.warn(`[Daily Tip] Attempt ${attempt}: content incomplete, ${attempt < maxAttempts ? 'retrying after 60s...' : 'using best result'}`)
          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 60_000))
          }
        } catch (retryError) {
          const msg = retryError instanceof Error ? retryError.message : String(retryError)
          if (msg.includes('rate_limit') && attempt < maxAttempts) {
            console.warn(`[Daily Tip] Rate limited, waiting 60s before retry...`)
            await new Promise((resolve) => setTimeout(resolve, 60_000))
          } else if (content) {
            console.warn(`[Daily Tip] Error on attempt ${attempt}, using previous result: ${msg}`)
            break
          } else {
            throw retryError
          }
        }
      }
    }

    // Extract metadata
    const { title, summary } = extractTipMetadata(content)
    const slug = generateSlug(title)

    console.log(`[Daily Tip] Generated: "${title}" (${tokensUsed} tokens)`)

    // Generate MDX file
    const mdxContent = generateMDXContent({
      title,
      date: today,
      category: 'ai',
      tags: ['daily-post', 'ai-generated'],
      summary: summary || 'AI가 작성한 일일 포스트',
      aiGenerated: true,
      content,
    })

    // Create file via GitHub API
    const filePath = `content/posts/ai-generated/daily-tip-${today.toISOString().split('T')[0]}-${slug}.mdx`

    await createFileViaGitHub({
      path: filePath,
      content: mdxContent,
      message: `chore: add daily tip "${title}"`,
    })

    console.log(`[Daily Tip] Published to: ${filePath}`)

    // Send notification
    await notifyAIPublish({
      title,
      slug,
      type: 'Daily Tip',
      tokensUsed,
    })

    console.log('[Daily Tip] ✅ Generation completed successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[Daily Tip] Failed - date: ${today.toISOString()}, error: ${errorMessage}`)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDailyTip()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('[Daily Tip] Fatal error:', error)
      process.exit(1)
    })
}

export { generateDailyTip }
