/**
 * Generates a prompt for analyzing GitHub trending repositories
 */
export function generateGithubAnalysisPrompt(repos: GithubRepo[]): string {
  const repoList = repos
    .map(
      (repo, index) =>
        `${index + 1}. **${repo.name}** (${repo.stars} stars, ${repo.language})
   - ${repo.description}
   - URL: ${repo.url}`
    )
    .join('\n\n')

  return `You are a technical analyst writing a weekly GitHub trending analysis for developers.

Analyze these trending repositories from the past week:

${repoList}

Write a comprehensive analysis that:
1. Identifies key trends and patterns
2. Highlights the most impactful repositories
3. Explains why these projects are gaining traction
4. Provides actionable insights for developers
5. Is between 800-1200 words

Format the output as Markdown with the following structure:

# GitHub Trending This Week: [Theme/Pattern]

## TL;DR
[3-4 bullet points summarizing key trends]

## Top Repositories

### [Repository Name 1]
- **What it is:** [Brief description]
- **Why it's trending:** [Analysis]
- **Who should care:** [Target audience]
- **Notable features:** [Key highlights]

### [Repository Name 2]
[Repeat structure]

### [Repository Name 3]
[Repeat structure]

## Emerging Patterns
[Analysis of common themes across trending repos]

## Actionable Takeaways
1. [Takeaway 1]
2. [Takeaway 2]
3. [Takeaway 3]

## Worth Watching
[Brief mentions of other interesting repos]

Focus on insights that help developers stay current and make informed technology decisions.`
}

export interface GithubRepo {
  name: string
  description: string
  url: string
  stars: number
  language: string
}

/**
 * Extracts metadata from generated GitHub analysis
 */
export function extractGithubMetadata(content: string): {
  title: string
  summary: string
} {
  const titleMatch = content.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1] : 'GitHub Trending This Week'

  const tldrMatch = content.match(/##\s+TL;DR\s+([\s\S]+?)(?=\n##|\n\n)/)
  const summary = tldrMatch ? tldrMatch[1].trim().slice(0, 200) : ''

  return { title, summary }
}

/**
 * Mock GitHub trending data for testing
 */
export function getMockGithubRepos(): GithubRepo[] {
  return [
    {
      name: 'anthropics/anthropic-sdk-typescript',
      description: 'Official TypeScript SDK for Claude API',
      url: 'https://github.com/anthropics/anthropic-sdk-typescript',
      stars: 5200,
      language: 'TypeScript',
    },
    {
      name: 'vercel/next.js',
      description: 'The React Framework for the Web',
      url: 'https://github.com/vercel/next.js',
      stars: 135000,
      language: 'JavaScript',
    },
    {
      name: 'microsoft/vscode',
      description: 'Visual Studio Code',
      url: 'https://github.com/microsoft/vscode',
      stars: 165000,
      language: 'TypeScript',
    },
  ]
}
