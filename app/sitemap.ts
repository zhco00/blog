import { allPosts, allReadings } from '@/.content-collections/generated'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://yourblog.com' // TODO: 실제 도메인으로 변경

  // 정적 페이지
  const routes = ['', '/blog', '/reading', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // 블로그 포스트
  const posts = allPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  // 독서 기록
  const readings = allReadings.map((book) => ({
    url: `${baseUrl}/reading/${book.slug}`,
    lastModified: book.finishedDate ? new Date(book.finishedDate) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...routes, ...posts, ...readings]
}
