import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createFileViaGitHub, generateMDXContent, generateSlug } from '@/lib/github'

const createPostSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['manual', 'tech', 'reading']),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Too many tags'),
  summary: z.string().max(500, 'Summary too long').optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = createPostSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { password, title, content, category, tags, summary } = result.data

    // Verify password
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 })
    }

    // Generate slug and MDX content
    const slug = generateSlug(title)
    const now = new Date()

    const mdxContent = generateMDXContent({
      title,
      date: now,
      category,
      tags,
      summary: summary || '',
      aiGenerated: false,
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
      message: 'Post created successfully. It will be published after deployment.',
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create post. Please check server logs.',
      },
      { status: 500 }
    )
  }
}
