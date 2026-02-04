'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  slug: string
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch current view count
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/analytics/view/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setViews(data.views || 0)
        }
      } catch (error) {
        console.error('[ViewCounter] Failed to fetch views:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Increment view count
    const incrementView = async () => {
      try {
        await fetch(`/api/analytics/view/${slug}`, { method: 'POST' })
      } catch (error) {
        console.error('[ViewCounter] Failed to increment view:', error)
      }
    }

    fetchViews()
    incrementView()
  }, [slug])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{views.toLocaleString()}</span>
    </div>
  )
}
