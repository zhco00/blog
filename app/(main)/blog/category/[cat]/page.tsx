import { allPosts } from '@/.content-collections/generated'
import PostCard from '@/components/blog/PostCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ cat: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cat } = await params
  return {
    title: `${cat} 카테고리`,
    description: `${cat} 카테고리의 모든 포스트`,
  }
}

export async function generateStaticParams() {
  const categories = new Set(allPosts.map((post) => post.category))
  return Array.from(categories).map((cat) => ({
    cat,
  }))
}

export default async function CategoryPage({ params }: PageProps) {
  const { cat } = await params
  const categoryPosts = allPosts
    .filter((post) => post.category === cat)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (categoryPosts.length === 0) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost">← 전체 블로그</Button>
        </Link>
      </div>

      <h1 className="text-4xl font-bold mb-4">{cat}</h1>
      <p className="text-muted-foreground mb-8">{categoryPosts.length}개의 포스트</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
