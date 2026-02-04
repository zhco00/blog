import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PostCard from '../PostCard'

describe('PostCard', () => {
  const mockPost = {
    slug: 'test-post',
    title: 'Test Post Title',
    date: '2026-02-03',
    category: 'tech',
    tags: ['test', 'vitest'],
    summary: 'This is a test summary',
    aiGenerated: false,
  }

  it('renders post title', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post Title')).toBeDefined()
  })

  it('renders post category badge', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('tech')).toBeDefined()
  })

  it('renders post summary', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('This is a test summary')).toBeDefined()
  })

  it('shows AI badge when post is AI-generated', () => {
    const aiPost = { ...mockPost, aiGenerated: true }
    render(<PostCard post={aiPost} />)
    expect(screen.getByText('AI')).toBeDefined()
  })

  it('renders tags', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('test')).toBeDefined()
    expect(screen.getByText('vitest')).toBeDefined()
  })
})
