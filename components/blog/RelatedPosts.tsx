import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  summary?: string
}

interface RelatedPostsProps {
  currentSlug: string
  currentTags: string[]
  currentCategory: string
  allPosts: Post[]
  maxPosts?: number
}

function calculateRelevanceScore(
  post: Post,
  currentTags: string[],
  currentCategory: string
): number {
  let score = 0

  // Category match: +3 points
  if (post.category === currentCategory) {
    score += 3
  }

  // Tag matches: +2 points per matching tag
  const matchingTags = post.tags.filter((tag) => currentTags.includes(tag))
  score += matchingTags.length * 2

  return score
}

export default function RelatedPosts({
  currentSlug,
  currentTags,
  currentCategory,
  allPosts,
  maxPosts = 3,
}: RelatedPostsProps) {
  // Filter and score related posts
  const relatedPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      ...post,
      score: calculateRelevanceScore(post, currentTags, currentCategory),
    }))
    .filter((post) => post.score > 0)
    .sort((a, b) => {
      // Sort by score first, then by date
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .slice(0, maxPosts)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 border-t">
      <h2 className="text-xl font-bold mb-6">관련 포스트</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
            </div>
            <h3 className="font-medium text-gray-900 group-hover:text-primary line-clamp-2 mb-2">
              {post.title}
            </h3>
            <time className="text-xs text-gray-500">
              {new Date(post.date).toLocaleDateString('ko-KR')}
            </time>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      currentTags.includes(tag)
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
