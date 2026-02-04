'use client'

import { Badge } from '@/components/ui/badge'
import { MDXContent } from '@content-collections/mdx/react'
import AISummary from './AISummary'

interface PostContentProps {
  post: {
    title: string
    date: string
    category: string
    tags: string[]
    aiGenerated: boolean
    body: string
    content: string
  }
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 메타데이터 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="secondary">{post.category}</Badge>
          {post.aiGenerated && (
            <Badge variant="outline" className="text-xs">
              AI 생성
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <time>{new Date(post.date).toLocaleDateString('ko-KR')}</time>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* AI 3줄 요약 */}
      <AISummary title={post.title} content={post.content} />

      {/* MDX 콘텐츠 */}
      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
        <MDXContent code={post.body} />
      </div>
    </article>
  )
}
