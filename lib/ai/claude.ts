import Anthropic from '@anthropic-ai/sdk'

export type ClaudeModel = 'claude-sonnet-4-20250514' | 'claude-haiku-4-5-20251101'

export interface GenerateOptions {
  model?: ClaudeModel
  maxTokens?: number
  system?: string
  webSearch?: boolean
}

export interface GenerateResult {
  content: string
  tokensUsed: number
}

/**
 * Generate content using Claude API
 * Supports web search for real-time data verification
 */
export async function generateContent(
  prompt: string,
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }

  const {
    model = 'claude-sonnet-4-20250514',
    maxTokens = 1500,
    system,
    webSearch = false,
  } = options

  try {
    const client = new Anthropic({ apiKey })

    const tools: Anthropic.Messages.Tool[] = webSearch
      ? [
          {
            type: 'web_search_20250305' as const,
            name: 'web_search',
            max_uses: 3,
          } as unknown as Anthropic.Messages.Tool,
        ]
      : []

    const message = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: prompt }],
      ...(tools.length > 0 && { tools }),
    })

    // Log stop reason for debugging truncation issues
    if (message.stop_reason !== 'end_turn') {
      console.warn(`[Claude] stop_reason=${message.stop_reason}, output_tokens=${message.usage.output_tokens}/${maxTokens}`)
    }

    // Extract text content from response (web search responses have multiple content blocks)
    const textParts = message.content
      .filter((block): block is Anthropic.Messages.TextBlock => block.type === 'text')
      .map((block) => block.text)

    const content = textParts.join('')
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens

    return { content, tokensUsed }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to generate content: ${errorMessage}`)
  }
}

/**
 * Check if Claude API is available
 */
export function isClaudeAvailable(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}
