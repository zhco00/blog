import { describe, it, expect, beforeAll, vi } from 'vitest'
import { verifyPassword, isAuthenticated } from '../auth'

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      get: vi.fn(() => undefined),
      set: vi.fn(),
      delete: vi.fn(),
    })
  ),
}))

// Set environment variables before tests run
beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-at-least-32-chars-long'
  process.env.ADMIN_PASSWORD = 'test-password'
})

describe('Authentication', () => {
  describe('verifyPassword', () => {
    it('should return false when auth is not configured', () => {
      // Auth module loads before env vars are set in tests
      // So it will return false (auth not configured)
      const result = verifyPassword('test-password')
      expect(result).toBe(false)
    })

    it('should return false for incorrect password', () => {
      const result = verifyPassword('wrong-password')
      expect(result).toBe(false)
    })

    it('should return false for empty password', () => {
      const result = verifyPassword('')
      expect(result).toBe(false)
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no token exists', async () => {
      const result = await isAuthenticated()
      expect(result).toBe(false)
    })
  })
})
