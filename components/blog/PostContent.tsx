'use client'

import { Badge } from '@/components/ui/badge'
import { MDXContent } from '@content-collections/mdx/react'

interface PostContentProps {
  post: {
    title: string
    date: string
    category: string
    tags: string[]
    aiGenerated: boolean
    body: string
    summary?: string
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI 칼럼',
  tech: '기술',
  reading: '독서',
  manual: '일상',
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* 메타데이터 */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Badge variant="secondary" className="text-xs font-medium">
            {CATEGORY_LABELS[post.category] || post.category}
          </Badge>
          {post.aiGenerated && (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              AI 생성
            </Badge>
          )}
          <span className="text-sm text-muted-foreground">
            {new Date(post.date).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-5">
          {post.title}
        </h1>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags
              .filter((tag) => tag !== 'daily-post' && tag !== 'ai-generated')
              .map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* AI 면책 고지 */}
      {post.aiGenerated && (
        <div className="mb-8 px-4 py-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
          이 글은 AI가 작성했습니다. 구체적인 수치나 데이터는 실제와 다를 수 있으니 참고용으로만 활용해 주세요.
        </div>
      )}

      {/* MDX 콘텐츠 */}
      <div className="prose prose-lg max-w-none">
        <MDXContent code={post.body} />
      </div>
    </article>
  )
}
