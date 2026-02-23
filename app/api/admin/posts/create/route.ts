import { NextResponse } from 'next/server'
import { z } from 'zod'
import { allPosts, type Post } from '@/.content-collections/generated'
import { isAuthenticated } from '@/lib/auth'
import {
  createFileViaGitHub,
  generateMDXContent,
  generateSlug,
  isGithubConfigured,
} from '@/lib/github'

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['manual', 'tech', 'reading', 'ai']),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Too many tags'),
  summary: z.string().max(500, 'Summary too long').optional(),
  aiGenerated: z.boolean().optional(),
})

export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isGithubConfigured()) {
      return NextResponse.json(
        { error: 'GitHub API not configured. Set GITHUB_PAT, GITHUB_OWNER, and GITHUB_REPO.' },
        { status: 503 },
      )
    }

    const body = await request.json()
    const result = createPostSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })
    }

    const { title, content, category, tags, summary, aiGenerated = false } = result.data

    // Generate slug and date
    const slug = generateSlug(title)
    const now = new Date()

    const slugExists = allPosts.some((post: Post) => post.slug === slug)
    if (slugExists) {
      return NextResponse.json(
        { error: 'A post with this title/slug already exists. Please use a different title.' },
        { status: 409 },
      )
    }

    // Generate MDX content
    const mdxContent = generateMDXContent({
      title,
      date: now,
      category,
      tags,
      summary: summary || '',
      aiGenerated,
      content,
    })

    // Create file via GitHub API
    const filePath = `content/posts/${category}/${slug}.mdx`

    await createFileViaGitHub({
      path: filePath,
      content: mdxContent,
      message: `feat: add post "${title}"`,
    })

    return NextResponse.json({
      success: true,
      slug,
      message: 'Post created. Changes will be reflected after deployment.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
