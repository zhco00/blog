import { NextResponse } from 'next/server'
import { z } from 'zod'
import { unsubscribe, getSubscriberByEmail } from '@/lib/db/queries'

const unsubscribeSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요.'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = unsubscribeSchema.parse(body)

    // Check if subscriber exists
    const existing = await getSubscriberByEmail(email)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: '구독 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (!existing.active) {
      return NextResponse.json({
        success: true,
        message: '이미 구독이 취소된 이메일입니다.',
      })
    }

    // Unsubscribe
    const result = await unsubscribe(email)
    if (!result) {
      return NextResponse.json(
        { success: false, error: '구독 취소 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '구독이 취소되었습니다.',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || '잘못된 요청입니다.' },
        { status: 400 }
      )
    }

    console.error('[Unsubscribe] Error:', error)
    return NextResponse.json(
      { success: false, error: '구독 취소 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
