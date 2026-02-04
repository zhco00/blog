import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { z } from 'zod'

const verifySchema = z.object({
  password: z.string().min(1),
})

/**
 * POST /api/auth/verify - Verify password (for editor modal)
 */
export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json()
    const result = verifySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 }
      )
    }

    const { password } = result.data
    const isValid = verifyPassword(password)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] POST /api/auth/verify failed:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
