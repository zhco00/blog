'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleUnsubscribe = async () => {
    if (!email) {
      setStatus('error')
      setMessage('이메일 주소가 필요합니다.')
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '구독 취소에 실패했습니다.')
      }

      setStatus('success')
      setMessage(data.message)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : '오류가 발생했습니다.')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">뉴스레터 구독 취소</h1>

      {status === 'idle' && (
        <>
          <p className="text-gray-600 mb-6">
            {email ? (
              <>
                <span className="font-medium">{email}</span>
                <br />
                위 이메일의 구독을 취소하시겠습니까?
              </>
            ) : (
              '구독을 취소할 이메일 주소가 없습니다.'
            )}
          </p>
          {email && (
            <Button onClick={handleUnsubscribe} variant="destructive">
              구독 취소하기
            </Button>
          )}
        </>
      )}

      {status === 'loading' && (
        <p className="text-gray-600">처리 중...</p>
      )}

      {status === 'success' && (
        <>
          <div className="text-green-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p>{message}</p>
          </div>
          <Link href="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-red-600 mb-4">
            <p>{message}</p>
          </div>
          <Link href="/">
            <Button variant="outline">홈으로 돌아가기</Button>
          </Link>
        </>
      )}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">뉴스레터 구독 취소</h1>
      <p className="text-gray-600">로딩 중...</p>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Suspense fallback={<LoadingFallback />}>
        <UnsubscribeContent />
      </Suspense>
    </div>
  )
}
