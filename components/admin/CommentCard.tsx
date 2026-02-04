'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface CommentCardProps {
  id: string
  postTitle: string
  postSlug: string
  authorName: string
  content: string
  createdAt: Date
  onDelete: (id: string) => void
  deleting?: boolean
}

export function CommentCard({
  id,
  postTitle,
  postSlug,
  authorName,
  content,
  createdAt,
  onDelete,
  deleting = false,
}: CommentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{authorName}</h3>
            <p className="text-xs text-muted-foreground">
              on{' '}
              <a
                href={`/blog/${postSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {postTitle}
              </a>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(createdAt).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(id)}
            disabled={deleting}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  )
}
