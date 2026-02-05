import Hero from '@/components/home/Hero'
import HomePostList from '@/components/home/HomePostList'
import { allPosts } from '@/.content-collections/generated'
import { getAllPostAnalytics } from '@/lib/db/queries'

export default async function HomePage() {
  // 모든 포스트 정렬 (독서 포함)
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // 조회수/좋아요 데이터 가져오기
  const analytics = await getAllPostAnalytics()
  const analyticsMap = Object.fromEntries(
    analytics.map((a) => [a.slug, { views: a.views, likes: a.likes }])
  )

  return (
    <div>
      <Hero />
      <HomePostList posts={sortedPosts} analytics={analyticsMap} />
    </div>
  )
}
