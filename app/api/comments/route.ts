import { NextResponse } from 'next/server'
import { getCommentsBySlug, createComment } from '@/lib/db/queries'
import { isDbAvailable } from '@/lib/db/client'
import { z } from 'zod'

const createCommentSchema = z.object({
  postSlug: z.string().min(1).max(255),
  authorName: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
})

/**
 * GET /api/comments?slug=[postSlug] - Get comments for a post
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
    }

    if (!isDbAvailable) {
      return NextResponse.json({ comments: [] }, { status: 200 })
    }

    const comments = await getCommentsBySlug(slug)

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('[API] GET /api/comments failed:', error)
    return NextResponse.json({ error: 'Failed to get comments' }, { status: 500 })
  }
}

/**
 * POST /api/comments - Create a new comment
 */
export async function POST(request: Request) {
  try {
    if (!isDbAvailable) {
      return NextResponse.json(
        { success: false, message: 'Database not available' },
        { status: 503 }
      )
    }

    // Validate request body
    const body = await request.json()
    const result = createCommentSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const comment = await createComment(result.data)

    if (!comment) {
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      comment,
    })
  } catch (error) {
    console.error('[API] POST /api/comments failed:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}
