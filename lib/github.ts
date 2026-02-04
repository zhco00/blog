import { Octokit } from '@octokit/rest'

export interface CreateFileOptions {
  path: string
  content: string
  message: string
  branch?: string
}

/**
 * Creates or updates a file in GitHub repository using GitHub API
 * This is used instead of git push in serverless environments
 */
export async function createFileViaGitHub({
  path,
  content,
  message,
  branch = 'main',
}: CreateFileOptions): Promise<void> {
  const token = process.env.GITHUB_PAT
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    throw new Error(
      'Missing GitHub configuration. Set GITHUB_PAT, GITHUB_OWNER, and GITHUB_REPO environment variables.'
    )
  }

  const octokit = new Octokit({ auth: token })

  try {
    // Check if file exists to get its SHA (required for updates)
    let sha: string | undefined
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      })

      if ('sha' in data) {
        sha = data.sha
      }
    } catch (error) {
      // File doesn't exist, which is fine for creation
      if (error instanceof Error && 'status' in error && error.status !== 404) {
        throw error
      }
    }

    // Create or update file
    const contentBase64 = Buffer.from(content).toString('base64')

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: contentBase64,
      branch,
      ...(sha && { sha }),
    })

    console.log(`[createFileViaGitHub] Successfully created/updated file: ${path}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(
      `[createFileViaGitHub] Failed - path: ${path}, message: ${message}, error: ${errorMessage}`
    )
    throw new Error(`Failed to create file via GitHub API: ${errorMessage}`)
  }
}

/**
 * Check if GitHub API is configured
 */
export function isGithubConfigured(): boolean {
  return !!(process.env.GITHUB_PAT && process.env.GITHUB_OWNER && process.env.GITHUB_REPO)
}

/**
 * Generate a slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
}

/**
 * Generate MDX frontmatter
 */
export function generateMDXContent(options: {
  title: string
  date: Date
  category: string
  tags: string[]
  summary: string
  aiGenerated?: boolean
  content: string
}): string {
  const { title, date, category, tags, summary, aiGenerated = false, content } = options

  const frontmatter = `---
title: "${title}"
date: ${date.toISOString()}
category: ${category}
tags: [${tags.map((tag) => `"${tag}"`).join(', ')}]
summary: "${summary}"
aiGenerated: ${aiGenerated}
---

${content}`

  return frontmatter
}
