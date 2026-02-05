import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.enum(['manual', 'tech', 'reading', 'ai-daily-tip', 'ai-github', 'ai-news']),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    aiGenerated: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document)
    const slug = document._meta.path.split('/').pop() || ''
    return {
      ...document,
      body,
      slug,
      url: `/blog/${slug}`,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
