'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { allPosts } from '@/.content-collections/generated'
import PostCard from '@/components/blog/PostCard'
import CategoryFilter from '@/components/blog/CategoryFilter'
import SearchBar from '@/components/blog/SearchBar'

function BlogContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')

  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [searchQuery, setSearchQuery] = useState('')

  // URL 파라미터 변경 시 카테고리 업데이트
  useEffect(() => {
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  // 카테고리 목록 추출
  const categories = useMemo(() => {
    const uniqueCategories = new Set(allPosts.map((post) => post.category))
    return Array.from(uniqueCategories)
  }, [])

  // 필터링된 포스트
  const filteredPosts = useMemo(() => {
    let result = allPosts

    // 카테고리 필터
    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory)
    }

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.summary?.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // 날짜순 정렬
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [selectedCategory, searchQuery])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">블로그</h1>

      {/* 필터 섹션 */}
      <div className="mb-8 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="제목, 내용, 태그로 검색..."
        />
        <CategoryFilter
          categories={categories}
          currentCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* 결과 카운트 */}
      <p className="text-sm text-muted-foreground mb-4">
        {filteredPosts.length}개의 포스트
      </p>

      {/* 포스트 그리드 */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12">로딩 중...</div>}>
      <BlogContent />
    </Suspense>
  )
}
