import Hero from '@/components/home/Hero'
import FeaturedPosts from '@/components/home/FeaturedPosts'
import PostCard from '@/components/blog/PostCard'
import SubscribeForm from '@/components/newsletter/SubscribeForm'
import { allPosts } from '@/.content-collections/generated'

export default function HomePage() {
  const latestPosts = allPosts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  const featuredPosts = latestPosts.slice(0, 3)

  return (
    <div>
      <Hero />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">추천 포스트</h2>
        <FeaturedPosts posts={featuredPosts} />
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8">최신 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-xl mx-auto px-4 py-16">
        <SubscribeForm />
      </section>
    </div>
  )
}
