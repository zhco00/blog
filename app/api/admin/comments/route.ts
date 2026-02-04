import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { isDbAvailable } from '@/lib/db/client'
import { getAllComments } from '@/lib/db/queries'
import { allPosts, type Post } from '@/.content-collections/generated'

/**
 * GET /api/admin/comments - Get all comments
 */
export async function GET() {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isDbAvailable) {
      return NextResponse.json({ comments: [], total: 0 })
    }

    const comments = await getAllComments()

    // Enrich with post titles
    const enrichedComments = comments.map((comment) => {
      const post = allPosts.find((p: Post) => p._meta.path === comment.postSlug)
      return {
        ...comment,
        postTitle: post?.title || comment.postSlug,
      }
    })

    return NextResponse.json({
      comments: enrichedComments,
      total: enrichedComments.length,
    })
  } catch (error) {
    console.error('[API] GET /api/admin/comments failed:', error)
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    )
  }
}
