import { notFound } from 'next/navigation'
import { allPosts } from '@/.content-collections/generated'
import PostContent from '@/components/blog/PostContent'
import ViewCounter from '@/components/blog/ViewCounter'
import LikeButton from '@/components/blog/LikeButton'
import ShareButtons from '@/components/blog/ShareButtons'
import Comments from '@/components/blog/Comments'
import RelatedPosts from '@/components/blog/RelatedPosts'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.summary || post.title,
  }
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = allPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // 현재 포스트 인덱스 찾기
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const currentIndex = sortedPosts.findIndex((p) => p.slug === slug)
  const prevPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null
  const nextPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null

  return (
    <div>
      {/* 목록으로 돌아가기 */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/blog">
          <Button variant="ghost">← 목록으로 돌아가기</Button>
        </Link>
      </div>

      <PostContent post={post} />

      {/* Analytics & Share Section */}
      <div className="max-w-4xl mx-auto px-4 py-6 border-t">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <ViewCounter slug={slug} />
            <LikeButton slug={slug} />
          </div>
          <ShareButtons slug={slug} title={post.title} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-t">
        <Comments slug={slug} />
      </div>

      {/* Related Posts */}
      <RelatedPosts
        currentSlug={slug}
        currentTags={post.tags}
        currentCategory={post.category}
        allPosts={allPosts}
      />

      {/* 이전/다음 포스트 네비게이션 */}
      <div className="max-w-4xl mx-auto px-4 py-8 border-t">
        <div className="flex justify-between items-center">
          <div>
            {prevPost ? (
              <Link href={`/blog/${prevPost.slug}`}>
                <Button variant="outline">
                  ← {prevPost.title}
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
          <div>
            {nextPost ? (
              <Link href={`/blog/${nextPost.slug}`}>
                <Button variant="outline">
                  {nextPost.title} →
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
