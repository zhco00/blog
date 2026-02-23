import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyPassword } from '@/lib/auth'
import { checkRateLimit, getClientIp, VERIFY_RATE_LIMIT } from '@/lib/rate-limit'

const verifySchema = z.object({
  password: z.string().min(1),
})

/**
 * POST /api/auth/verify - Verify password (for editor modal)
 */
export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`auth:verify:${clientIp}`, VERIFY_RATE_LIMIT)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many verification attempts. Please try again later.' },
      { status: 429 },
    )
  }

  try {
    // Validate request body
    const body = await request.json()
    const result = verifySchema.safeParse(body)

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

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
