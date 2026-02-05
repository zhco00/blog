'use client'

import { useEffect, useState } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, ExternalLink, Pencil, Trash2, Plus, Loader2 } from 'lucide-react'

interface Post {
  slug: string
  title: string
  date: string
  category: string
  aiGenerated: boolean
  summary?: string
  views: number
  likes: number
}

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'manual' | 'ai'>('all')
  const [search, setSearch] = useState('')
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/posts')

        if (response.status === 401) {
          redirect('/admin/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }

        const data = await response.json()
        setPosts(data.posts)
        setFilteredPosts(data.posts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    // Apply filter
    if (filter === 'manual') {
      filtered = filtered.filter((p) => !p.aiGenerated)
    } else if (filter === 'ai') {
      filtered = filtered.filter((p) => p.aiGenerated)
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.summary?.toLowerCase().includes(searchLower) ||
          p.category.toLowerCase().includes(searchLower)
      )
    }

    setFilteredPosts(filtered)
  }, [filter, search, posts])

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setDeletingSlug(slug)
    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete')
      }

      // Remove from local state
      setPosts(posts.filter((p) => p.slug !== slug))
      setFilteredPosts(filteredPosts.filter((p) => p.slug !== slug))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post')
    } finally {
      setDeletingSlug(null)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="text-destructive">{error}</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Posts Management</h1>
            <p className="text-muted-foreground">Manage all your blog posts</p>
          </div>
          <Button onClick={() => router.push('/admin/posts/editor')}>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({posts.length})
            </Button>
            <Button
              variant={filter === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('manual')}
            >
              Manual ({posts.filter((p) => !p.aiGenerated).length})
            </Button>
            <Button
              variant={filter === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('ai')}
            >
              AI Generated ({posts.filter((p) => p.aiGenerated).length})
            </Button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.slug}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        {post.aiGenerated && (
                          <Badge variant="secondary">AI Generated</Badge>
                        )}
                      </div>
                      {post.summary && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                        <span>•</span>
                        <span>{post.category}</span>
                        <span>•</span>
                        <span>{post.views} views</span>
                        <span>•</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/posts/editor?edit=${post.slug}`)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        title="View"
                      >
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.slug)}
                        disabled={deletingSlug === post.slug}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                      >
                        {deletingSlug === post.slug ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              {search || filter !== 'all'
                ? 'No posts found matching your criteria'
                : 'No posts yet'}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
