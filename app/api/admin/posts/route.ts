import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getAllPostAnalytics } from '@/lib/db/queries'
import { allPosts, type Post } from '@/.content-collections/generated'

/**
 * GET /api/admin/posts - Get all posts with analytics
 * Query params:
 *  - filter: 'all' | 'manual' | 'ai'
 *  - search: search query
 */
export async function GET(request: Request) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search')?.toLowerCase() || ''

    // Get all posts
    let posts = allPosts.map((post: Post) => ({
      slug: post._meta.path,
      title: post.title,
      date: post.date,
      category: post.category,
      aiGenerated: post.aiGenerated || false,
      summary: post.summary,
    }))

    // Apply filter
    if (filter === 'manual') {
      posts = posts.filter((p: { aiGenerated: boolean }) => !p.aiGenerated)
    } else if (filter === 'ai') {
      posts = posts.filter((p: { aiGenerated: boolean }) => p.aiGenerated)
    }

    // Apply search
    if (search) {
      posts = posts.filter(
        (p: { title: string; summary?: string; category: string }) =>
          p.title.toLowerCase().includes(search) ||
          p.summary?.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search)
      )
    }

    // Get analytics for posts
    const analytics = await getAllPostAnalytics()
    const postsWithAnalytics = posts.map((post: typeof posts[0]) => {
      const postAnalytics = analytics.find((a) => a.slug === post.slug)
      return {
        ...post,
        views: postAnalytics?.views || 0,
        likes: postAnalytics?.likes || 0,
      }
    })

    // Sort by date (newest first)
    postsWithAnalytics.sort((a: { date: Date | string }, b: { date: Date | string }) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return NextResponse.json({
      posts: postsWithAnalytics,
      total: postsWithAnalytics.length,
    })
  } catch (error) {
    console.error('[API] GET /api/admin/posts failed:', error)
    return NextResponse.json(
      { error: 'Failed to get posts' },
      { status: 500 }
    )
  }
}
