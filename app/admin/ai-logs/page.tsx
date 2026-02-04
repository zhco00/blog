'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { StatCard } from '@/components/admin/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, DollarSign, Zap, CheckCircle } from 'lucide-react'

interface AILog {
  id: string
  type: string
  prompt: string | null
  content: string | null
  tokensUsed: number | null
  createdAt: Date
  published: boolean
  postSlug: string | null
}

interface AIStats {
  totalGenerated: number
  totalPublished: number
  totalTokensUsed: number
  estimatedCost: number
}

interface AILogsData {
  logs: AILog[]
  stats: AIStats
}

export default function AdminAILogsPage() {
  const [data, setData] = useState<AILogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/admin/ai-logs')

        if (response.status === 401) {
          redirect('/admin/login')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch AI logs')
        }

        const data = await response.json()
        setData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
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
          <h1 className="text-3xl font-bold">AI Generation Logs</h1>
          <p className="text-muted-foreground">
            Track AI-generated content and token usage
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Generated"
            value={data?.stats.totalGenerated || 0}
            icon={Brain}
            description="AI content generations"
          />
          <StatCard
            title="Published"
            value={data?.stats.totalPublished || 0}
            icon={CheckCircle}
            description="Published posts"
          />
          <StatCard
            title="Tokens Used"
            value={data?.stats.totalTokensUsed.toLocaleString() || '0'}
            icon={Zap}
            description="Total tokens consumed"
          />
          <StatCard
            title="Estimated Cost"
            value={`$${data?.stats.estimatedCost.toFixed(2) || '0.00'}`}
            icon={DollarSign}
            description="Based on Claude pricing"
          />
        </div>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Generations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.logs && data.logs.length > 0 ? (
                data.logs.map((log) => (
                  <div key={log.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge>{log.type}</Badge>
                        {log.published && (
                          <Badge variant="default">Published</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    {log.prompt && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Prompt:</p>
                        <p className="text-sm bg-gray-50 p-2 rounded line-clamp-2">
                          {log.prompt}
                        </p>
                      </div>
                    )}

                    {log.content && (
                      <div className="mb-2">
                        <p className="text-xs text-muted-foreground mb-1">Content:</p>
                        <p className="text-sm bg-gray-50 p-2 rounded line-clamp-3">
                          {log.content}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {log.tokensUsed && (
                        <span>{log.tokensUsed.toLocaleString()} tokens</span>
                      )}
                      {log.postSlug && (
                        <a
                          href={`/blog/${log.postSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Post
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No AI generations yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
