'use client'

import { Button } from '@/components/ui/button'
import { Share2, Twitter, Facebook, Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  slug: string
  title: string
}

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : ''

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('[ShareButtons] Failed to copy link:', error)
    }
  }

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(url)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        공유:
      </span>
      <Button variant="outline" size="sm" onClick={handleTwitterShare}>
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleFacebookShare}>
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        <LinkIcon className="h-4 w-4" />
        {copied ? '복사됨!' : '링크 복사'}
      </Button>
    </div>
  )
}
