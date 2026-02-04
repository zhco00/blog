'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatCard } from '@/components/admin/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, FileText, MessageSquare, Users } from 'lucide-react'

interface DashboardStats {
  totalViews: number
  totalPosts: number
  totalComments: number
  totalSubscribers: number
  topPosts: Array<{
    slug: string
    title: string
    views: number
    likes: number
  }>
  recentComments: Array<{
    id: string
    postSlug: string
    postTitle: string
    authorName: string
    content: string
    createdAt: Date
  }>
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')

        if (response.status === 401) {
          redirect('/admin/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch statistics')
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your blog statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Views"
            value={stats?.totalViews.toLocaleString() || '0'}
            icon={Eye}
            description="All time page views"
          />
          <StatCard
            title="Total Posts"
            value={stats?.totalPosts || 0}
            icon={FileText}
            description="Published articles"
          />
          <StatCard
            title="Total Comments"
            value={stats?.totalComments || 0}
            icon={MessageSquare}
            description="User comments"
          />
          <StatCard
            title="Subscribers"
            value={stats?.totalSubscribers || 0}
            icon={Users}
            description="Newsletter subscribers"
          />
        </div>

        {/* Top Posts and Recent Comments */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Top Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Top Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topPosts && stats.topPosts.length > 0 ? (
                <div className="space-y-4">
                  {stats.topPosts.map((post, index) => (
                    <div key={post.slug} className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline truncate"
                          >
                            {post.title}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground ml-4">
                        <span>{post.views} views</span>
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No posts yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Comments</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentComments && stats.recentComments.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentComments.map((comment) => (
                    <div key={comment.id} className="space-y-1">
                      <div className="flex items-start justify-between">
                        <span className="text-sm font-medium">{comment.authorName}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {comment.content}
                      </p>
                      <a
                        href={`/blog/${comment.postSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        {comment.postTitle}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
