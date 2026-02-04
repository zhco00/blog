'use client'

import { useState } from 'react'

interface EditorModalProps {
  isOpen: boolean
  onClose: () => void
}

type Category = 'manual' | 'tech' | 'reading'

export function EditorModal({ isOpen, onClose }: EditorModalProps) {
  const [step, setStep] = useState<'password' | 'editor'>('password')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('manual')
  const [tags, setTags] = useState('')
  const [summary, setSummary] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      setStep('editor')
      setError('')
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)

      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          title,
          content,
          category,
          tags: tagsArray,
          summary: summary || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create post')
      }

      setSuccess(data.message || 'Post created successfully!')
      setTimeout(() => {
        resetForm()
        onClose()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep('password')
    setPassword('')
    setTitle('')
    setContent('')
    setCategory('manual')
    setTags('')
    setSummary('')
    setError('')
    setSuccess('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {step === 'password' ? 'Authentication' : 'Create New Post'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              type="button"
            >
              ×
            </button>
          </div>

          {step === 'password' ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreatePost}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Post title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="manual">Manual</option>
                    <option value="tech">Tech</option>
                    <option value="reading">Reading</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-2">
                    Tags * (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="typescript, nextjs, react"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="summary" className="block text-sm font-medium mb-2">
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Brief summary (optional)"
                    rows={2}
                    maxLength={500}
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Content * (Markdown)
                  </label>
                  <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                    placeholder="Write your post content in Markdown..."
                    rows={15}
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
                    {success}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
