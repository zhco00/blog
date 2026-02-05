'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save, Eye, Edit2, Loader2 } from 'lucide-react'

// Dynamic import to avoid SSR issues with TipTap
const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor'),
  { ssr: false, loading: () => <div className="h-[400px] border rounded-lg animate-pulse bg-gray-100" /> }
)

type Category = 'manual' | 'tech' | 'reading' | 'ai-daily-tip' | 'ai-github' | 'ai-news'

function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('edit')
  const isEditMode = !!editSlug

  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('manual')
  const [tagsInput, setTagsInput] = useState('')
  const [summary, setSummary] = useState('')
  const [aiGenerated, setAiGenerated] = useState(false)

  // Load post data for editing
  useEffect(() => {
    if (!editSlug) return

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${editSlug}`)
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/admin/login')
            return
          }
          throw new Error('Failed to fetch post')
        }

        const data = await response.json()
        setTitle(data.title)
        // Convert markdown content to simple HTML for editor
        // The content from MDX might be markdown, so we set it as-is
        // TipTap will handle it
        setContent(data.content || '')
        setCategory(data.category)
        setTagsInput(data.tags.join(', '))
        setSummary(data.summary || '')
        setAiGenerated(data.aiGenerated)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [editSlug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      if (tags.length === 0) {
        throw new Error('At least one tag is required')
      }

      if (!content.trim()) {
        throw new Error('Content is required')
      }

      const postData = {
        title,
        content,
        category,
        tags,
        summary,
        aiGenerated,
      }

      const url = isEditMode
        ? `/api/admin/posts/${editSlug}`
        : '/api/admin/posts/create'

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save post')
      }

      setSuccess(data.message || 'Post saved successfully!')

      if (!isEditMode) {
        setTimeout(() => router.push('/admin/posts'), 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/posts')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {isEditMode ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>

          {/* Tab buttons */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'edit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('edit')}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant={activeTab === 'preview' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('preview')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
            {success}
          </div>
        )}

        {/* Edit Tab */}
        {activeTab === 'edit' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                required
              />
            </div>

            {/* Category & AI Generated */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="manual">일상</option>
                  <option value="tech">기술</option>
                  <option value="reading">독서</option>
                  <option value="ai-daily-tip">AI Daily Tip</option>
                  <option value="ai-github">AI GitHub</option>
                  <option value="ai-news">AI News</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiGenerated}
                    onChange={(e) => setAiGenerated(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">AI Generated</span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                Tags * (comma-separated)
              </label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="react, typescript, nextjs"
                required
              />
              {tagsInput && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tagsInput.split(',').map(
                    (tag, i) =>
                      tag.trim() && (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      )
                  )}
                </div>
              )}
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium mb-2">
                Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Brief summary (optional)"
                rows={2}
                maxLength={500}
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium mb-2">Content *</label>
              <RichTextEditor
                content={content}
                onChange={setContent}
                placeholder="Write your content here..."
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Post' : 'Create Post'}
                </>
              )}
            </Button>
          </form>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <Card className="p-8">
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">
                  {category === 'reading'
                    ? '독서'
                    : category === 'tech'
                      ? '기술'
                      : category === 'manual'
                        ? '일상'
                        : category}
                </Badge>
                {aiGenerated && (
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    AI
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-3">{title || 'Untitled'}</h1>
              {summary && <p className="text-lg text-muted-foreground">{summary}</p>}
              {tagsInput && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tagsInput.split(',').map(
                    (tag, i) =>
                      tag.trim() && (
                        <Badge key={i} variant="outline">
                          {tag.trim()}
                        </Badge>
                      )
                  )}
                </div>
              )}
            </div>

            <article
              className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-img:rounded-lg"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Preview content
              dangerouslySetInnerHTML={{ __html: content || '<p><em>No content yet...</em></p>' }}
            />
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default function AdminEditorPage() {
  return (
    <Suspense
      fallback={
        <AdminLayout>
          <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </AdminLayout>
      }
    >
      <EditorContent />
    </Suspense>
  )
}
