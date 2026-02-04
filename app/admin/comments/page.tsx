'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { CommentCard } from '@/components/admin/CommentCard'

interface Comment {
  id: string
  postSlug: string
  postTitle: string
  authorName: string
  content: string
  createdAt: Date
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/admin/comments')

      if (response.status === 401) {
        redirect('/admin/login')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }

      const data = await response.json()
      setComments(data.comments)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/comments/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      // Remove comment from list
      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete comment')
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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Comments Management</h1>
          <p className="text-muted-foreground">
            Manage all comments ({comments.length} total)
          </p>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                id={comment.id}
                postTitle={comment.postTitle}
                postSlug={comment.postSlug}
                authorName={comment.authorName}
                content={comment.content}
                createdAt={comment.createdAt}
                onDelete={handleDelete}
                deleting={deletingId === comment.id}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No comments yet
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
