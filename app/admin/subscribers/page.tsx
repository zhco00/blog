'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Mail } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  subscribedAt: Date
  active: boolean
  dailyNewsletter: boolean
  weeklyNewsletter: boolean
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/subscribers')

      if (response.status === 401) {
        redirect('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch subscribers')
      }

      const data = await response.json()
      setSubscribers(data.subscribers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subscriber')
      }

      // Remove subscriber from list
      setSubscribers((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete subscriber')
    } finally {
      setDeletingId(null)
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

  const activeCount = subscribers.filter((s) => s.active).length

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Subscribers Management</h1>
          <p className="text-muted-foreground">
            {activeCount} active subscribers ({subscribers.length} total)
          </p>
        </div>

        {/* Subscribers List */}
        <div className="space-y-4">
          {subscribers.length > 0 ? (
            subscribers.map((subscriber) => (
              <Card key={subscriber.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{subscriber.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Subscribed on{' '}
                            {new Date(subscriber.subscribedAt).toLocaleDateString('ko-KR')}
                          </span>
                          {subscriber.active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                          {subscriber.dailyNewsletter && (
                            <Badge variant="outline">Daily</Badge>
                          )}
                          {subscriber.weeklyNewsletter && (
                            <Badge variant="outline">Weekly</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(subscriber.id)}
                      disabled={deletingId === subscriber.id}
                      className="text-destructive hover:text-destructive ml-4"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No subscribers yet
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
