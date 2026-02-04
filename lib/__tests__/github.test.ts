import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createFileViaGitHub, isGithubConfigured, generateSlug, generateMDXContent } from '../github'

// Mock Octokit
vi.mock('@octokit/rest', () => {
  return {
    Octokit: vi.fn().mockImplementation(() => {
      return {
        repos: {
          getContent: vi.fn().mockRejectedValue({ status: 404 }), // File doesn't exist
          createOrUpdateFileContents: vi.fn().mockResolvedValue({ data: { commit: { sha: 'abc123' } } }),
        },
      }
    }),
  }
})

describe('github', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
  })

  describe('createFileViaGitHub', () => {
    it('should throw error when GitHub config is missing', async () => {
      delete process.env.GITHUB_PAT
      delete process.env.GITHUB_OWNER
      delete process.env.GITHUB_REPO

      await expect(
        createFileViaGitHub({
          path: 'test.mdx',
          content: 'test content',
          message: 'test commit',
        })
      ).rejects.toThrow('Missing GitHub configuration')
    })

    it('should create file when config is present', async () => {
      process.env.GITHUB_PAT = 'ghp_test_token'
      process.env.GITHUB_OWNER = 'test-owner'
      process.env.GITHUB_REPO = 'test-repo'

      await expect(
        createFileViaGitHub({
          path: 'test.mdx',
          content: 'test content',
          message: 'test commit',
        })
      ).resolves.not.toThrow()
    })
  })

  describe('isGithubConfigured', () => {
    it('should return true when all config is present', () => {
      process.env.GITHUB_PAT = 'ghp_test_token'
      process.env.GITHUB_OWNER = 'test-owner'
      process.env.GITHUB_REPO = 'test-repo'

      expect(isGithubConfigured()).toBe(true)
    })

    it('should return false when config is missing', () => {
      delete process.env.GITHUB_PAT

      expect(isGithubConfigured()).toBe(false)
    })
  })

  describe('generateSlug', () => {
    it('should convert title to slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world')
    })

    it('should handle special characters', () => {
      expect(generateSlug('Hello! World? Test...')).toBe('hello-world-test')
    })

    it('should handle Korean characters', () => {
      expect(generateSlug('안녕하세요 TypeScript')).toBe('안녕하세요-typescript')
    })

    it('should limit slug length', () => {
      const longTitle = 'a'.repeat(150)
      const slug = generateSlug(longTitle)
      expect(slug.length).toBeLessThanOrEqual(100)
    })

    it('should remove leading/trailing dashes', () => {
      expect(generateSlug('---hello-world---')).toBe('hello-world')
    })
  })

  describe('generateMDXContent', () => {
    it('should generate valid MDX with frontmatter', () => {
      const result = generateMDXContent({
        title: 'Test Title',
        date: new Date('2026-02-03'),
        category: 'tech',
        tags: ['typescript', 'nextjs'],
        summary: 'Test summary',
        aiGenerated: false,
        content: '# Hello World',
      })

      expect(result).toContain('title: "Test Title"')
      expect(result).toContain('category: tech')
      expect(result).toContain('tags: ["typescript", "nextjs"]')
      expect(result).toContain('summary: "Test summary"')
      expect(result).toContain('aiGenerated: false')
      expect(result).toContain('# Hello World')
    })

    it('should handle AI-generated posts', () => {
      const result = generateMDXContent({
        title: 'AI Generated Post',
        date: new Date('2026-02-03'),
        category: 'ai-daily-tip',
        tags: ['ai'],
        summary: 'AI summary',
        aiGenerated: true,
        content: 'AI content',
      })

      expect(result).toContain('aiGenerated: true')
    })
  })
})
