'use client'

import { useEffect, useState, useRef } from 'react'
import { Eye } from 'lucide-react'

interface ViewCounterProps {
  slug: string
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const [views, setViews] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const hasIncremented = useRef(false)

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasIncremented.current) return
    hasIncremented.current = true

    // Check if already viewed in this session
    const viewedKey = `viewed_${slug}`
    const alreadyViewed = sessionStorage.getItem(viewedKey) === 'true'

    const initializeViews = async () => {
      try {
        if (alreadyViewed) {
          // Already viewed - just fetch current count
          const response = await fetch(`/api/analytics/view/${slug}`)
          if (response.ok) {
            const data = await response.json()
            setViews(data.views || 0)
          }
        } else {
          // First view - increment and get new count
          const response = await fetch(`/api/analytics/view/${slug}`, { method: 'POST' })
          if (response.ok) {
            const data = await response.json()
            setViews(data.views || 0)
            // Mark as viewed in this session
            sessionStorage.setItem(viewedKey, 'true')
          }
        }
      } catch {
        // Failed to fetch/increment views
      } finally {
        setIsLoading(false)
      }
    }

    initializeViews()
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
