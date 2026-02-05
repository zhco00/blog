import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { createFileViaGitHub, deleteFileViaGitHub, isGithubConfigured } from '@/lib/github'
import { allPosts, type Post } from '@/.content-collections/generated'
import { z } from 'zod'

/**
 * GET /api/admin/posts/[slug] - Get a single post for editing
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params
    const post = allPosts.find((p: Post) => p.slug === slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json({
      slug: post.slug,
      title: post.title,
      date: post.date,
      category: post.category,
      tags: post.tags,
      summary: post.summary || '',
      aiGenerated: post.aiGenerated,
      content: post.content,
      filePath: post._meta.filePath,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['manual', 'tech', 'reading', 'ai-daily-tip', 'ai-github', 'ai-news']),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Too many tags'),
  summary: z.string().max(500, 'Summary too long').optional(),
  aiGenerated: z.boolean().optional(),
})

/**
 * PUT /api/admin/posts/[slug] - Update a post
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isGithubConfigured()) {
      return NextResponse.json(
        { error: 'GitHub API not configured' },
        { status: 503 }
      )
    }

    const { slug } = await params
    const post = allPosts.find((p: Post) => p.slug === slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const body = await request.json()
    const result = updatePostSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { title, content, category, tags, summary, aiGenerated } = result.data

    // Escape curly braces for MDX compatibility
    const escapedContent = content
      .replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;')

    // Generate updated MDX content
    const mdxContent = `---
title: "${title}"
date: "${post.date}"
category: ${category}
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
summary: "${summary || ''}"
aiGenerated: ${aiGenerated ?? post.aiGenerated}
---

${escapedContent}`

    // Update file via GitHub API
    const filePath = `content/posts/${post._meta.filePath}`
    await createFileViaGitHub({
      path: filePath,
      content: mdxContent,
      message: `docs: update post "${title}"`,
    })

    return NextResponse.json({
      success: true,
      message: 'Post updated. Changes will be reflected after deployment.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/posts/[slug] - Delete a post
 * Posts are deleted via GitHub API which triggers a rebuild
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    // Check if GitHub is configured
    if (!isGithubConfigured()) {
      return NextResponse.json(
        { error: 'GitHub API not configured. Set GITHUB_PAT, GITHUB_OWNER, and GITHUB_REPO.' },
        { status: 503 }
      )
    }

    // Find the post by slug (slug is the _meta.path without the category prefix)
    const post = allPosts.find((p: Post) => p.slug === slug || p._meta.path === slug)
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete the file via GitHub API
    const filePath = `content/posts/${post._meta.filePath}`
    await deleteFileViaGitHub({
      path: filePath,
      message: `chore: delete post "${post.title}"`,
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted. Changes will be reflected after deployment.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to delete post: ${message}` },
      { status: 500 }
    )
  }
}
