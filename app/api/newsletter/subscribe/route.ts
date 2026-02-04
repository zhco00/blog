import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSubscriber, getSubscriberByEmail } from '@/lib/db/queries'
import { sendWelcomeEmail } from '@/lib/email/send'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const subscribeSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
})

const SUBSCRIBE_RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
}

export async function POST(request: Request) {
  // Rate limiting
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`subscribe:${clientIp}`, SUBSCRIBE_RATE_LIMIT)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: '잠시 후 다시 시도해주세요.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    const { email } = subscribeSchema.parse(body)

    // Check if already subscribed
    const existing = await getSubscriberByEmail(email)
    if (existing) {
      if (existing.active) {
        return NextResponse.json(
          { success: false, error: '이미 구독 중인 이메일입니다.' },
          { status: 400 }
        )
      }
      // Reactivate subscription would require an update function
      // For now, treat as already subscribed
      return NextResponse.json(
        { success: false, error: '이미 구독 중인 이메일입니다.' },
        { status: 400 }
      )
    }

    // Create new subscriber
    const subscriber = await createSubscriber(email)
    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: '구독 처리 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // Send welcome email (non-blocking)
    sendWelcomeEmail({ to: email }).catch((err) => {
      console.error('[Subscribe] Failed to send welcome email:', err)
    })

    return NextResponse.json({
      success: true,
      message: '구독이 완료되었습니다! 환영 이메일을 확인해주세요.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || '잘못된 요청입니다.' },
        { status: 400 }
      )
    }

    console.error('[Subscribe] Error:', error)
    return NextResponse.json(
      { success: false, error: '구독 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
