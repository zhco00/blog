import { NextResponse } from 'next/server'
import { incrementViews, getPostAnalytics } from '@/lib/db/queries'
import { isDbAvailable } from '@/lib/db/client'

interface RouteContext {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/analytics/view/[slug] - Get view count for a post
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params

    if (!isDbAvailable) {
      return NextResponse.json(
        { views: 0, likes: 0, message: 'Database not available' },
        { status: 200 }
      )
    }

    const analytics = await getPostAnalytics(slug)

    return NextResponse.json({
      views: analytics?.views || 0,
      likes: analytics?.likes || 0,
    })
  } catch (error) {
    console.error('[API] GET /api/analytics/view/[slug] failed:', error)
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 })
  }
}

/**
 * POST /api/analytics/view/[slug] - Increment view count for a post
 */
export async function POST(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params

    if (!isDbAvailable) {
      return NextResponse.json(
        { success: false, message: 'Database not available' },
        { status: 200 }
      )
    }

    const analytics = await incrementViews(slug)

    if (!analytics) {
      return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      views: analytics.views,
      likes: analytics.likes,
    })
  } catch (error) {
    console.error('[API] POST /api/analytics/view/[slug] failed:', error)
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}
