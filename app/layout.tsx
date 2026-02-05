import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AI 블로그',
    template: '%s | AI 블로그',
  },
  description: '개인 블로그 + AI 자동화 콘텐츠 플랫폼. 수동 포스팅과 AI 자동 생성 콘텐츠를 결합한 차세대 블로그.',
  keywords: ['블로그', 'AI', '자동화', 'Next.js', 'React', 'TypeScript'],
  authors: [{ name: 'AI Blog' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005',
    siteName: 'AI 블로그',
    title: 'AI 블로그',
    description: '개인 블로그 + AI 자동화 콘텐츠 플랫폼',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  )
}
