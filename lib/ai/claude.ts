import Anthropic from '@anthropic-ai/sdk'

export type ClaudeModel = 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251101'

export interface GenerateOptions {
  model?: ClaudeModel
  maxTokens?: number
  system?: string
}

export interface GenerateResult {
  content: string
  tokensUsed: number
}

/**
 * Generate content using Claude API
 * Gracefully falls back to mock data if API key is missing
 */
export async function generateContent(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  // Graceful fallback when API key is missing
  if (!apiKey) {
    console.warn('ANTHROPIC_API_KEY is not set. Returning mock data.')
    return {
      content: `# Mock Generated Content\n\nThis is mock content because ANTHROPIC_API_KEY is not configured.\n\nPrompt was: ${prompt.slice(0, 100)}...`,
      tokensUsed: 0,
    }
  }

  const { model = 'claude-sonnet-4-20250514', maxTokens = 1500, system } = options

  try {
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = message.content[0]
    const content = textBlock.type === 'text' ? textBlock.text : ''
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens

    return { content, tokensUsed }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('[generateContent] Failed - prompt:', prompt.slice(0, 100), 'error:', errorMessage)
    throw new Error(`Failed to generate content: ${errorMessage}`)
  }
}

/**
 * Check if Claude API is available
 */
export function isClaudeAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}
