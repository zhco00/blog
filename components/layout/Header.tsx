'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [showSecret, setShowSecret] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary hover:text-primary/80">
          AI 블로그
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/blog" className="hover:text-primary transition-colors">
            블로그
          </Link>
          <Link href="/blog?category=reading" className="hover:text-primary transition-colors">
            독서
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            소개
          </Link>

          <Link
            href="/admin/login"
            onMouseEnter={() => setShowSecret(true)}
            onMouseLeave={() => setShowSecret(false)}
            className="text-gray-300 hover:text-gray-600 text-xs opacity-30 hover:opacity-100 transition-opacity"
            aria-label="Admin"
          >
            {showSecret ? 'Admin' : 'A'}
          </Link>
        </div>
      </nav>
    </header>
  )
}
