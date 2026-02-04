import { NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/auth'
import { z } from 'zod'

const loginSchema = z.object({
  password: z.string().min(1),
})

/**
 * POST /api/auth/login - Admin login
 */
export async function POST(request: Request) {
  try {
    // Validate request body
    const body = await request.json()
    const result = loginSchema.safeParse(body)

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

    // Create session
    await createSession()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] POST /api/auth/login failed:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
