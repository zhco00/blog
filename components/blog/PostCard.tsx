import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCategoryColor, getCategoryLabel } from '@/lib/categories'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  summary?: string
  aiGenerated: boolean
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const colorClass = getCategoryColor(post.category)

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>
              {getCategoryLabel(post.category)}
            </span>
            {post.aiGenerated && (
              <Badge variant="outline" className="text-xs">
                AI
              </Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2">{post.title}</CardTitle>
          <CardDescription>{new Date(post.date).toLocaleDateString('ko-KR')}</CardDescription>
        </CardHeader>
        <CardContent>
          {post.summary && <p className="text-sm text-muted-foreground line-clamp-3">{post.summary}</p>}
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags
                .filter((tag) => tag !== 'daily-post' && tag !== 'ai-generated')
                .slice(0, 3)
                .map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
