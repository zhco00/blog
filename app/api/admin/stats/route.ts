import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { isAuthenticated } from '@/lib/auth'
import { isDbAvailable, db } from '@/lib/db/client'
import { getAllPostAnalytics, getAllComments } from '@/lib/db/queries'
import { allPosts, type Post } from '@/.content-collections/generated'
import { subscribers } from '@/lib/db/schema'

/**
 * GET /api/admin/stats - Get admin dashboard statistics
 */
export async function GET() {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // If DB not available, return basic stats from content only
    if (!isDbAvailable || !db) {
      return NextResponse.json({
        totalViews: 0,
        totalPosts: allPosts.length,
        totalComments: 0,
        totalSubscribers: 0,
        topPosts: [],
        recentComments: [],
      })
    }

    // Get all analytics
    const analytics = await getAllPostAnalytics()
    const totalViews = analytics.reduce((sum, a) => sum + a.views, 0)

    // Get top 5 posts by views
    const topPosts = analytics
      .slice(0, 5)
      .map((a) => {
        const post = allPosts.find((p: Post) => p._meta.path === a.slug)
        return {
          slug: a.slug,
          title: post?.title || a.slug,
          views: a.views,
          likes: a.likes,
        }
      })

    // Get recent comments
    const allComments = await getAllComments()
    const recentComments = allComments.slice(0, 5).map((c) => {
      const post = allPosts.find((p: Post) => p._meta.path === c.postSlug)
      return {
        id: c.id,
        postSlug: c.postSlug,
        postTitle: post?.title || c.postSlug,
        authorName: c.authorName,
        content: c.content,
        createdAt: c.createdAt,
      }
    })

    // Get subscriber count
    const subscriberResult = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.active, true))
    const totalSubscribers = subscriberResult?.length || 0

    return NextResponse.json({
      totalViews,
      totalPosts: allPosts.length,
      totalComments: allComments.length,
      totalSubscribers,
      topPosts,
      recentComments,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to get statistics' },
      { status: 500 }
    )
  }
}
