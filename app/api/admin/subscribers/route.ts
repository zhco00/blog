import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { isAuthenticated } from '@/lib/auth'
import { isDbAvailable, db } from '@/lib/db/client'
import { subscribers } from '@/lib/db/schema'

/**
 * GET /api/admin/subscribers - Get all subscribers
 */
export async function GET() {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isDbAvailable || !db) {
      return NextResponse.json({ subscribers: [], total: 0 })
    }

    const allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(subscribers.subscribedAt)

    return NextResponse.json({
      subscribers: allSubscribers,
      total: allSubscribers.length,
      active: allSubscribers.filter((s) => s.active).length,
    })
  } catch (error) {
    console.error('[API] GET /api/admin/subscribers failed:', error)
    return NextResponse.json(
      { error: 'Failed to get subscribers' },
      { status: 500 }
    )
  }
}
