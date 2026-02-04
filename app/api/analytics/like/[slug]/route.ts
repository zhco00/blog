import { NextResponse } from 'next/server'
import { toggleLike } from '@/lib/db/queries'
import { isDbAvailable } from '@/lib/db/client'
import { z } from 'zod'

interface RouteContext {
  params: Promise<{ slug: string }>
}

const requestSchema = z.object({
  increment: z.boolean(),
})

/**
 * POST /api/analytics/like/[slug] - Toggle like for a post
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

    // Validate request body
    const body = await request.json()
    const result = requestSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { increment } = result.data
    const analytics = await toggleLike(slug, increment)

    if (!analytics) {
      return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      likes: analytics.likes,
      views: analytics.views,
    })
  } catch (error) {
    console.error('[API] POST /api/analytics/like/[slug] failed:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
