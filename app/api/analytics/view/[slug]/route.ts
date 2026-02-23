import { NextResponse } from 'next/server'
import { isDbAvailable } from '@/lib/db/client'
import { getPostAnalytics, incrementViews } from '@/lib/db/queries'
import { ANALYTICS_WRITE_RATE_LIMIT, checkRateLimit, getClientIp } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{ slug: string }>
}

/**
 * GET /api/analytics/view/[slug] - Get view count for a post
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params

    if (!isDbAvailable) {
      return NextResponse.json(
        { views: 0, likes: 0, message: 'Database not available' },
        { status: 200 },
      )
    }

    const analytics = await getPostAnalytics(slug)

    return NextResponse.json({
      views: analytics?.views || 0,
      likes: analytics?.likes || 0,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 })
  }
}

/**
 * POST /api/analytics/view/[slug] - Increment view count for a post
 */
export async function POST(request: Request, context: RouteContext) {
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`analytics:view:${clientIp}`, ANALYTICS_WRITE_RATE_LIMIT)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    const { slug } = await context.params

    if (!isDbAvailable) {
      return NextResponse.json(
        { success: false, message: 'Database not available' },
        { status: 200 },
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
  } catch {
    return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
  }
}
