'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LikeButtonProps {
  slug: string
}

export default function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch current like count
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/analytics/view/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setLikes(data.likes || 0)
        }
      } catch {
        // Failed to fetch likes - will show 0
      } finally {
        setIsLoading(false)
      }
    }

    // Check if already liked (localStorage)
    const likedKey = `liked_${slug}`
    const alreadyLiked = localStorage.getItem(likedKey) === 'true'
    setIsLiked(alreadyLiked)

    fetchLikes()
  }, [slug])

  const handleLike = async () => {
    const likedKey = `liked_${slug}`
    const newIsLiked = !isLiked

    try {
      const response = await fetch(`/api/analytics/like/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: newIsLiked }),
      })

      if (response.ok) {
        const data = await response.json()
        setLikes(data.likes || 0)
        setIsLiked(newIsLiked)

        // Store in localStorage
        if (newIsLiked) {
          localStorage.setItem(likedKey, 'true')
        } else {
          localStorage.removeItem(likedKey)
        }
      }
    } catch {
      // Failed to toggle like - UI state unchanged
    }
  }

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Heart className="h-4 w-4 mr-1" />
        <span>...</span>
      </Button>
    )
  }

  return (
    <Button
      variant={isLiked ? 'default' : 'outline'}
      size="sm"
      onClick={handleLike}
      className="gap-1"
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likes.toLocaleString()}</span>
    </Button>
  )
}
