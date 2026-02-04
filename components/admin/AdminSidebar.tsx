'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Brain,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Posts',
    href: '/admin/posts',
    icon: FileText,
  },
  {
    title: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    title: 'Subscribers',
    href: '/admin/subscribers',
    icon: Users,
  },
  {
    title: 'AI Logs',
    href: '/admin/ai-logs',
    icon: Brain,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      const response = await fetch('/api/auth/logout', { method: 'POST' })

      if (response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-gray-100">
      <div className="flex h-14 items-center border-b border-gray-800 px-4">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}

        <div className="my-4 border-t border-gray-800" />

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View Blog
        </a>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:bg-gray-800 hover:text-white"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          {loggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    </div>
  )
}
