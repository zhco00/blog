import { NextResponse } from 'next/server'
import { deleteComment } from '@/lib/db/queries'
import { isDbAvailable } from '@/lib/db/client'
import { isAuthenticated } from '@/lib/auth'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * DELETE /api/comments/[id] - Delete a comment (admin only)
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isDbAvailable) {
      return NextResponse.json(
        { success: false, message: 'Database not available' },
        { status: 503 }
      )
    }

    const success = await deleteComment(id)

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] DELETE /api/comments/[id] failed:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
