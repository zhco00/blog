'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowRight, Sparkles, Code, BookOpen, PenLine, Flame, Eye, Heart } from 'lucide-react'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  tags: string[]
  summary?: string
  aiGenerated: boolean
}

interface Analytics {
  views: number
  likes: number
}

interface HomePostListProps {
  posts: Post[]
  analytics: Record<string, Analytics>
}

type FilterType = 'all' | 'tech' | 'reading' | 'manual' | 'ai'

export default function HomePostList({ posts, analytics }: HomePostListProps) {
  const [filter, setFilter] = useState<FilterType>('all')

  const filters = [
    { key: 'all' as const, label: '전체', icon: null },
    { key: 'tech' as const, label: '기술', icon: Code },
    { key: 'reading' as const, label: '독서', icon: BookOpen },
    { key: 'manual' as const, label: '일상', icon: PenLine },
    { key: 'ai' as const, label: 'AI 생성', icon: Sparkles },
  ]

  // 카테고리별 카운트
  const getCategoryCount = (key: FilterType) => {
    if (key === 'all') return posts.length
    if (key === 'ai') return posts.filter((p) => p.aiGenerated).length
    if (key === 'tech') return posts.filter((p) => p.category === 'tech').length
    if (key === 'reading') return posts.filter((p) => p.category === 'reading').length
    if (key === 'manual') return posts.filter((p) => p.category === 'manual' && !p.aiGenerated).length
    return 0
  }

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filter === 'all') return true
      if (filter === 'ai') return post.aiGenerated
      if (filter === 'tech') return post.category === 'tech'
      if (filter === 'reading') return post.category === 'reading'
      if (filter === 'manual') return post.category === 'manual' && !post.aiGenerated
      return true
    })
  }, [posts, filter])

  // 인기 포스트 (조회수 + 좋아요 기준)
  const popularPosts = useMemo(() => {
    return [...posts]
      .map((post) => ({
        ...post,
        score: (analytics[post.slug]?.views || 0) + (analytics[post.slug]?.likes || 0) * 5,
        views: analytics[post.slug]?.views || 0,
        likes: analytics[post.slug]?.likes || 0,
      }))
      .filter((post) => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
  }, [posts, analytics])

  // 카테고리별 색상
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'reading':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100'
      case 'tech':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100'
      default:
        return ''
    }
  }

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'reading':
        return 'bg-green-100 text-green-700'
      case 'tech':
        return 'bg-blue-100 text-blue-700'
      default:
        return ''
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'reading':
        return '독서'
      case 'tech':
        return '기술'
      case 'manual':
        return '일상'
      default:
        return category
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 mb-16">
      {/* 인기 포스트 섹션 - 항상 표시 */}
      {popularPosts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">인기 포스트</h2>
              <p className="text-sm text-muted-foreground">많이 읽힌 글</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map((post, index) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card
                  className={`h-full hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden ${
                    index === 0
                      ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
                      : 'bg-gradient-to-br from-gray-50 to-slate-50'
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">
                      🔥 TOP
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className={getCategoryBadgeStyle(post.category)}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                      {post.aiGenerated && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-amber-600 border-amber-300 bg-amber-50"
                        >
                          <Sparkles className="h-3 w-3" /> AI
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                      {new Date(post.date).toLocaleDateString('ko-KR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {post.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.summary}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 필터 버튼 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(key)}
            className="gap-2"
          >
            {Icon && <Icon className="h-4 w-4" />}
            {label}
            <span className="text-xs opacity-70">{getCategoryCount(key)}</span>
          </Button>
        ))}
      </div>

      {/* 최신 포스트 목록 */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">
              {filter === 'all' && '최신 포스트'}
              {filter === 'tech' && '기술 포스트'}
              {filter === 'reading' && '독서 기록'}
              {filter === 'manual' && '일상 포스트'}
              {filter === 'ai' && 'AI 생성 포스트'}
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="gap-2">
              전체 보기 <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.slice(0, 6).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card
                  className={`h-full hover:shadow-lg transition-shadow cursor-pointer ${getCategoryStyle(post.category)}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="secondary" className={getCategoryBadgeStyle(post.category)}>
                        {getCategoryLabel(post.category)}
                      </Badge>
                      {post.aiGenerated && (
                        <Badge
                          variant="outline"
                          className="gap-1 text-amber-600 border-amber-300 bg-amber-50"
                        >
                          <Sparkles className="h-3 w-3" /> AI
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>
                      {new Date(post.date).toLocaleDateString('ko-KR')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {post.summary && (
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-xl">
            해당 카테고리에 포스트가 없습니다.
          </div>
        )}
      </section>
    </div>
  )
}
