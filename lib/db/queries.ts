import { eq, desc, sql } from 'drizzle-orm'
import { db, isDbAvailable } from './client'
import {
  subscribers,
  postAnalytics,
  comments,
  aiGenerations,
  type NewSubscriber,
  type NewComment,
  type NewAIGeneration,
  type Subscriber,
  type PostAnalytics,
  type Comment,
  type AIGeneration,
} from './schema'

// ==================== Subscribers ====================

export async function createSubscriber(email: string): Promise<Subscriber | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [subscriber] = await db
      .insert(subscribers)
      .values({ email })
      .returning()
    return subscriber
  } catch (error) {
    console.error('[DB] createSubscriber failed:', { email, error })
    return null
  }
}

export async function getSubscriberByEmail(email: string): Promise<Subscriber | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1)
    return subscriber || null
  } catch (error) {
    console.error('[DB] getSubscriberByEmail failed:', { email, error })
    return null
  }
}

export async function getActiveSubscribers(): Promise<Subscriber[]> {
  if (!isDbAvailable || !db) return []

  try {
    return await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.active, true))
  } catch (error) {
    console.error('[DB] getActiveSubscribers failed:', error)
    return []
  }
}

export async function unsubscribe(email: string): Promise<boolean> {
  if (!isDbAvailable || !db) return false

  try {
    await db
      .update(subscribers)
      .set({ active: false })
      .where(eq(subscribers.email, email))
    return true
  } catch (error) {
    console.error('[DB] unsubscribe failed:', { email, error })
    return false
  }
}

// ==================== Post Analytics ====================

export async function incrementViews(slug: string): Promise<PostAnalytics | null> {
  if (!isDbAvailable || !db) return null

  try {
    // Try to increment existing record
    const [existing] = await db
      .select()
      .from(postAnalytics)
      .where(eq(postAnalytics.slug, slug))
      .limit(1)

    if (existing) {
      const [updated] = await db
        .update(postAnalytics)
        .set({
          views: sql`${postAnalytics.views} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(postAnalytics.slug, slug))
        .returning()
      return updated
    }

    // Create new record if not exists
    const [created] = await db
      .insert(postAnalytics)
      .values({ slug, views: 1, likes: 0 })
      .returning()
    return created
  } catch (error) {
    console.error('[DB] incrementViews failed:', { slug, error })
    return null
  }
}

export async function toggleLike(slug: string, increment: boolean): Promise<PostAnalytics | null> {
  if (!isDbAvailable || !db) return null

  try {
    // Try to update existing record
    const [existing] = await db
      .select()
      .from(postAnalytics)
      .where(eq(postAnalytics.slug, slug))
      .limit(1)

    if (existing) {
      const [updated] = await db
        .update(postAnalytics)
        .set({
          likes: increment
            ? sql`${postAnalytics.likes} + 1`
            : sql`GREATEST(${postAnalytics.likes} - 1, 0)`,
          updatedAt: new Date(),
        })
        .where(eq(postAnalytics.slug, slug))
        .returning()
      return updated
    }

    // Create new record if not exists
    const [created] = await db
      .insert(postAnalytics)
      .values({ slug, views: 0, likes: increment ? 1 : 0 })
      .returning()
    return created
  } catch (error) {
    console.error('[DB] toggleLike failed:', { slug, increment, error })
    return null
  }
}

export async function getPostAnalytics(slug: string): Promise<PostAnalytics | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [analytics] = await db
      .select()
      .from(postAnalytics)
      .where(eq(postAnalytics.slug, slug))
      .limit(1)
    return analytics || null
  } catch (error) {
    console.error('[DB] getPostAnalytics failed:', { slug, error })
    return null
  }
}

export async function getAllPostAnalytics(): Promise<PostAnalytics[]> {
  if (!isDbAvailable || !db) return []

  try {
    return await db
      .select()
      .from(postAnalytics)
      .orderBy(desc(postAnalytics.views))
  } catch (error) {
    console.error('[DB] getAllPostAnalytics failed:', error)
    return []
  }
}

// ==================== Comments ====================

export async function createComment(data: NewComment): Promise<Comment | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [comment] = await db
      .insert(comments)
      .values(data)
      .returning()
    return comment
  } catch (error) {
    console.error('[DB] createComment failed:', { data, error })
    return null
  }
}

export async function getCommentsBySlug(slug: string): Promise<Comment[]> {
  if (!isDbAvailable || !db) return []

  try {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postSlug, slug))
      .orderBy(desc(comments.createdAt))
  } catch (error) {
    console.error('[DB] getCommentsBySlug failed:', { slug, error })
    return []
  }
}

export async function deleteComment(id: string): Promise<boolean> {
  if (!isDbAvailable || !db) return false

  try {
    await db
      .delete(comments)
      .where(eq(comments.id, id))
    return true
  } catch (error) {
    console.error('[DB] deleteComment failed:', { id, error })
    return false
  }
}

export async function getAllComments(): Promise<Comment[]> {
  if (!isDbAvailable || !db) return []

  try {
    return await db
      .select()
      .from(comments)
      .orderBy(desc(comments.createdAt))
  } catch (error) {
    console.error('[DB] getAllComments failed:', error)
    return []
  }
}

// ==================== AI Generations ====================

export async function createAIGeneration(data: NewAIGeneration): Promise<AIGeneration | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [generation] = await db
      .insert(aiGenerations)
      .values(data)
      .returning()
    return generation
  } catch (error) {
    console.error('[DB] createAIGeneration failed:', { data, error })
    return null
  }
}

export async function getAIGenerations(limit = 50): Promise<AIGeneration[]> {
  if (!isDbAvailable || !db) return []

  try {
    return await db
      .select()
      .from(aiGenerations)
      .orderBy(desc(aiGenerations.createdAt))
      .limit(limit)
  } catch (error) {
    console.error('[DB] getAIGenerations failed:', error)
    return []
  }
}

export async function markAIGenerationPublished(
  id: string,
  postSlug: string
): Promise<AIGeneration | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [updated] = await db
      .update(aiGenerations)
      .set({ published: true, postSlug })
      .where(eq(aiGenerations.id, id))
      .returning()
    return updated
  } catch (error) {
    console.error('[DB] markAIGenerationPublished failed:', { id, postSlug, error })
    return null
  }
}

export async function getAIGenerationStats(): Promise<{
  totalGenerated: number
  totalPublished: number
  totalTokensUsed: number
} | null> {
  if (!isDbAvailable || !db) return null

  try {
    const [result] = await db
      .select({
        totalGenerated: sql<number>`COUNT(*)::int`,
        totalPublished: sql<number>`SUM(CASE WHEN ${aiGenerations.published} THEN 1 ELSE 0 END)::int`,
        totalTokensUsed: sql<number>`COALESCE(SUM(${aiGenerations.tokensUsed}), 0)::int`,
      })
      .from(aiGenerations)

    return result || { totalGenerated: 0, totalPublished: 0, totalTokensUsed: 0 }
  } catch (error) {
    console.error('[DB] getAIGenerationStats failed:', error)
    return null
  }
}
