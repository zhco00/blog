import { resend, isEmailAvailable } from './client'
import NewsletterEmail from './templates/newsletter'
import WelcomeEmail from './templates/welcome'
import { render } from '@react-email/components'

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@example.com'
const BLOG_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'

interface Post {
  title: string
  summary: string
  url: string
  category: string
  aiGenerated: boolean
}

interface SendNewsletterOptions {
  to: string[]
  posts: Post[]
  type: 'daily' | 'weekly'
}

export async function sendNewsletter({
  to,
  posts,
  type,
}: SendNewsletterOptions): Promise<{ success: boolean; error?: string }> {
  if (!isEmailAvailable() || !resend) {
    return { success: false, error: 'Email service not configured' }
  }

  if (to.length === 0) {
    return { success: true }
  }

  if (posts.length === 0) {
    return { success: true }
  }

  const emailClient = resend

  try {
    const subject =
      type === 'daily'
        ? `[AI 블로그] 오늘의 포스트 (${posts.length}개)`
        : `[AI 블로그] 이번 주 포스트 (${posts.length}개)`

    // Send to each recipient individually for unsubscribe link personalization
    const results = await Promise.allSettled(
      to.map(async (email) => {
        const unsubscribeUrl = `${BLOG_URL}/unsubscribe?email=${encodeURIComponent(email)}`

        const html = await render(
          NewsletterEmail({ posts, type, unsubscribeUrl })
        )

        return emailClient.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject,
          html,
        })
      })
    )

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}

interface SendWelcomeEmailOptions {
  to: string
}

export async function sendWelcomeEmail({
  to,
}: SendWelcomeEmailOptions): Promise<{ success: boolean; error?: string }> {
  if (!isEmailAvailable() || !resend) {
    return { success: false, error: 'Email service not configured' }
  }

  const emailClient = resend

  try {
    const unsubscribeUrl = `${BLOG_URL}/unsubscribe?email=${encodeURIComponent(to)}`

    const html = await render(
      WelcomeEmail({ blogUrl: BLOG_URL, unsubscribeUrl })
    )

    await emailClient.emails.send({
      from: FROM_EMAIL,
      to,
      subject: '[AI 블로그] 뉴스레터 구독을 환영합니다! 🎉',
      html,
    })

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { success: false, error: message }
  }
}
