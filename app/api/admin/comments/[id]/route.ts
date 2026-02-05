import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { isDbAvailable } from '@/lib/db/client'
import { deleteComment } from '@/lib/db/queries'

/**
 * DELETE /api/admin/comments/[id] - Delete a comment
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isDbAvailable) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const { id } = await params
    const success = await deleteComment(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete comment' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
