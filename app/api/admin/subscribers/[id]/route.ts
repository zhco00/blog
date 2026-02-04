import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { isAuthenticated } from '@/lib/auth'
import { isDbAvailable, db } from '@/lib/db/client'
import { subscribers } from '@/lib/db/schema'

/**
 * DELETE /api/admin/subscribers/[id] - Delete a subscriber
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

    if (!isDbAvailable || !db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const { id } = await params

    await db
      .delete(subscribers)
      .where(eq(subscribers.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] DELETE /api/admin/subscribers/[id] failed:', error)
    return NextResponse.json(
      { error: 'Failed to delete subscriber' },
      { status: 500 }
    )
  }
}
