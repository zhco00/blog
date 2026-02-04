import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as queries from '../queries'
import { db, isDbAvailable } from '../client'

// Mock the database client
vi.mock('../client', () => ({
  db: null,
  isDbAvailable: false,
}))

describe('Database Queries', () => {
  describe('when database is not available', () => {
    it('createSubscriber should return null', async () => {
      const result = await queries.createSubscriber('test@example.com')
      expect(result).toBeNull()
    })

    it('getSubscriberByEmail should return null', async () => {
      const result = await queries.getSubscriberByEmail('test@example.com')
      expect(result).toBeNull()
    })

    it('getActiveSubscribers should return empty array', async () => {
      const result = await queries.getActiveSubscribers()
      expect(result).toEqual([])
    })

    it('incrementViews should return null', async () => {
      const result = await queries.incrementViews('test-slug')
      expect(result).toBeNull()
    })

    it('toggleLike should return null', async () => {
      const result = await queries.toggleLike('test-slug', true)
      expect(result).toBeNull()
    })

    it('getPostAnalytics should return null', async () => {
      const result = await queries.getPostAnalytics('test-slug')
      expect(result).toBeNull()
    })

    it('getAllPostAnalytics should return empty array', async () => {
      const result = await queries.getAllPostAnalytics()
      expect(result).toEqual([])
    })

    it('createComment should return null', async () => {
      const result = await queries.createComment({
        postSlug: 'test-slug',
        authorName: 'Test User',
        content: 'Test comment',
      })
      expect(result).toBeNull()
    })

    it('getCommentsBySlug should return empty array', async () => {
      const result = await queries.getCommentsBySlug('test-slug')
      expect(result).toEqual([])
    })

    it('deleteComment should return false', async () => {
      const result = await queries.deleteComment('test-id')
      expect(result).toBe(false)
    })

    it('createAIGeneration should return null', async () => {
      const result = await queries.createAIGeneration({
        type: 'daily-tip',
        prompt: 'Test prompt',
        content: 'Test content',
        tokensUsed: 100,
      })
      expect(result).toBeNull()
    })

    it('getAIGenerations should return empty array', async () => {
      const result = await queries.getAIGenerations()
      expect(result).toEqual([])
    })

    it('getAIGenerationStats should return null', async () => {
      const result = await queries.getAIGenerationStats()
      expect(result).toBeNull()
    })
  })
})
