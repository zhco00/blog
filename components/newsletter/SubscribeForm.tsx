'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Mail, Loader2, CheckCircle } from 'lucide-react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '구독에 실패했습니다.')
      }

      setStatus('success')
      setMessage(data.message)
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : '오류가 발생했습니다.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-green-700 font-medium">{message}</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">뉴스레터 구독</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        새로운 포스트와 개발 팁을 이메일로 받아보세요.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          required
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          disabled={status === 'loading'}
        />

        {status === 'error' && (
          <p className="text-sm text-red-600">{message}</p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={status === 'loading' || !email}
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              구독 중...
            </>
          ) : (
            '무료 구독하기'
          )}
        </Button>
      </form>

      <p className="text-xs text-gray-500 mt-3 text-center">
        언제든지 구독을 취소할 수 있습니다.
      </p>
    </div>
  )
}
