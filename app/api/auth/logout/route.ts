import { NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth'

/**
 * POST /api/auth/logout - Logout admin
 */
export async function POST() {
  try {
    await destroySession()

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 })
  }
}
