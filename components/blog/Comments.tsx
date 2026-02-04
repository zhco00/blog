'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'

interface Comment {
  id: string
  postSlug: string
  authorName: string
  content: string
  createdAt: string
}

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    fetchComments()
  }, [slug])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?slug=${slug}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('[Comments] Failed to fetch comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorName.trim() || !content.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postSlug: slug,
          authorName: authorName.trim(),
          content: content.trim(),
        }),
      })

      if (response.ok) {
        // Clear form
        setAuthorName('')
        setContent('')
        // Refresh comments
        await fetchComments()
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to post comment')
      }
    } catch (error) {
      console.error('[Comments] Failed to submit comment:', error)
      alert('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-2xl font-bold">
          댓글 {comments.length > 0 && `(${comments.length})`}
        </h2>
      </div>

      {/* Comment Form */}
      <Card>
        <CardHeader>
          <CardTitle>댓글 작성</CardTitle>
          <CardDescription>의견을 자유롭게 남겨주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="이름"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="댓글 내용을 입력하세요..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                required
                className="w-full min-h-[100px] px-3 py-2 border rounded-md resize-y"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      {isLoading ? (
        <p className="text-muted-foreground">댓글을 불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold">{comment.authorName}</p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                <p className="whitespace-pre-wrap">{comment.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
