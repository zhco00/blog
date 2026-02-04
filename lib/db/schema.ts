import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

// Newsletter subscribers table
export const subscribers = pgTable('subscribers', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull(),
  active: boolean('active').default(true).notNull(),
  dailyNewsletter: boolean('daily_newsletter').default(true).notNull(),
  weeklyNewsletter: boolean('weekly_newsletter').default(true).notNull(),
})

// Post analytics table
export const postAnalytics = pgTable('post_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  postSlug: varchar('post_slug', { length: 255 }).notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// AI generations log table
export const aiGenerations = pgTable('ai_generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 50 }).notNull(),
  prompt: text('prompt'),
  content: text('content'),
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  published: boolean('published').default(false).notNull(),
  postSlug: varchar('post_slug', { length: 255 }),
})

// Type exports for TypeScript
export type Subscriber = typeof subscribers.$inferSelect
export type NewSubscriber = typeof subscribers.$inferInsert

export type PostAnalytics = typeof postAnalytics.$inferSelect
export type NewPostAnalytics = typeof postAnalytics.$inferInsert

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export type AIGeneration = typeof aiGenerations.$inferSelect
export type NewAIGeneration = typeof aiGenerations.$inferInsert
