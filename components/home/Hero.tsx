import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">AI 자동화 블로그</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          개인 블로그와 AI 자동 콘텐츠를 결합한 차세대 플랫폼.
          <br />
          매일 새로운 인사이트를 발견하세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/blog">
            <Button size="lg">블로그 둘러보기</Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline">
              소개
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
