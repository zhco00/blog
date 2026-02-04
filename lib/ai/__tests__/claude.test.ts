import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateContent, isClaudeAvailable } from '../claude'

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        messages: {
          create: vi.fn().mockResolvedValue({
            content: [{ type: 'text', text: 'Mock generated content' }],
            usage: { input_tokens: 100, output_tokens: 50 },
          }),
        },
      }
    }),
  }
})

describe('claude', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  describe('generateContent', () => {
    it('should return mock data when API key is not set', async () => {
      delete process.env.ANTHROPIC_API_KEY

      const result = await generateContent('Test prompt')

      expect(result.content).toContain('Mock Generated Content')
      expect(result.tokensUsed).toBe(0)
    })

    it('should generate content when API key is set', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key'

      const result = await generateContent('Test prompt', {
        model: 'claude-sonnet-4-20250514',
        maxTokens: 1000,
      })

      expect(result.content).toBe('Mock generated content')
      expect(result.tokensUsed).toBe(150) // 100 input + 50 output
    })

    it('should use default options when not provided', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key'

      const result = await generateContent('Test prompt')

      expect(result.content).toBe('Mock generated content')
      expect(result.tokensUsed).toBeGreaterThan(0)
    })

    it('should handle errors gracefully', async () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key'

      // Mock error
      const Anthropic = await import('@anthropic-ai/sdk')
      vi.mocked(Anthropic.default).mockImplementationOnce(() => {
        return {
          messages: {
            create: vi.fn().mockRejectedValue(new Error('API Error')),
          },
        } as never
      })

      await expect(generateContent('Test prompt')).rejects.toThrow('Failed to generate content')
    })
  })

  describe('isClaudeAvailable', () => {
    it('should return true when API key is set', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test-key'

      expect(isClaudeAvailable()).toBe(true)
    })

    it('should return false when API key is not set', () => {
      delete process.env.ANTHROPIC_API_KEY

      expect(isClaudeAvailable()).toBe(false)
    })
  })
})
