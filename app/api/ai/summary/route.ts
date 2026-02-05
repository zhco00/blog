import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateContent, isClaudeAvailable } from '@/lib/ai/claude'
import { checkRateLimit, getClientIp, SUMMARY_RATE_LIMIT } from '@/lib/rate-limit'

const requestSchema = z.object({
  content: z.string().min(100).max(50000),
  title: z.string().min(1).max(200),
})

export async function POST(request: Request) {
  // Rate limiting
  const clientIp = getClientIp(request)
  const rateLimitResult = checkRateLimit(`summary:${clientIp}`, SUMMARY_RATE_LIMIT)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: '요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.',
        resetTime: rateLimitResult.resetTime,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
        },
      }
    )
  }

  // Check Claude availability
  if (!isClaudeAvailable()) {
    return NextResponse.json(
      {
        success: false,
        error: 'AI 기능을 사용할 수 없습니다.',
      },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { content, title } = requestSchema.parse(body)

    const prompt = `다음 블로그 포스트를 정확히 3줄로 요약해주세요. 각 줄은 핵심 내용을 담고 있어야 합니다.

제목: ${title}

내용:
${content.slice(0, 10000)}

요약 형식:
1. [첫 번째 핵심 포인트]
2. [두 번째 핵심 포인트]
3. [세 번째 핵심 포인트]`

    const result = await generateContent(prompt, {
      model: 'claude-haiku-4-5-20251101',
      maxTokens: 300,
      system: '당신은 블로그 콘텐츠를 명확하고 간결하게 요약하는 전문가입니다. 반드시 한국어로 답변하세요.',
    })

    return NextResponse.json(
      {
        success: true,
        summary: result.content,
        tokensUsed: result.tokensUsed,
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.resetTime),
        },
      }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: '잘못된 요청입니다.',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: '요약을 생성하는 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
