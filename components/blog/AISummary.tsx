'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

interface AISummaryProps {
  title: string
  content: string
}

export default function AISummary({ title, content }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const generateSummary = async () => {
    if (loading || summary) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '요약 생성에 실패했습니다.')
      }

      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : '요약 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (!summary && !loading && !error) {
    return (
      <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
        <Button
          variant="ghost"
          onClick={generateSummary}
          className="w-full flex items-center justify-center gap-2 text-purple-700 hover:text-purple-800 hover:bg-purple-100"
        >
          <Sparkles className="w-4 h-4" />
          AI 3줄 요약 보기
        </Button>
      </div>
    )
  }

  return (
    <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-purple-100/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-purple-700 font-medium">
          <Sparkles className="w-4 h-4" />
          AI 3줄 요약
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-purple-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-purple-600" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          {loading && (
            <div className="flex items-center justify-center py-4 text-purple-600">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              요약을 생성하고 있습니다...
            </div>
          )}

          {error && (
            <div className="py-3 text-red-600 text-sm">
              {error}
              <Button
                variant="link"
                onClick={generateSummary}
                className="ml-2 text-purple-600 p-0 h-auto"
              >
                다시 시도
              </Button>
            </div>
          )}

          {summary && (
            <div className="prose prose-sm prose-purple max-w-none">
              <div className="whitespace-pre-line text-gray-700">{summary}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
