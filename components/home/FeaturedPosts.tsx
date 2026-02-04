import PostCard from '@/components/blog/PostCard'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  summary?: string
  aiGenerated: boolean
}

interface FeaturedPostsProps {
  posts: Post[]
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
