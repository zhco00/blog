import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSession, verifyPassword } from '@/lib/auth'
import { AUTH_RATE_LIMIT, checkRateLimit, getClientIp } from '@/lib/rate-limit'

const loginSchema = z.object({
  password: z.string().min(1),
})

/**
 * POST /api/auth/login - Admin login
 */
export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`auth:login:${clientIp}`, AUTH_RATE_LIMIT)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    // Validate request body
    const body = await request.json()
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: result.error.issues },
        { status: 400 },
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
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
