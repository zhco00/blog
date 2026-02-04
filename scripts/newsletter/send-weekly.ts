/**
 * Weekly Newsletter Sender
 * Runs via GitHub Actions cron job (Sundays)
 */

import { getActiveSubscribers } from '../../lib/db/queries'
import { sendNewsletter } from '../../lib/email/send'
import { allPosts } from '../../.content-collections/generated'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'

async function main() {
  console.log('[Weekly Newsletter] Starting...')

  // Get posts from the last 7 days
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  weekAgo.setHours(0, 0, 0, 0)

  const weeklyPosts = allPosts
    .filter((post) => {
      const postDate = new Date(post.date)
      return postDate >= weekAgo
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (weeklyPosts.length === 0) {
    console.log('[Weekly Newsletter] No new posts this week. Skipping.')
    return
  }

  console.log(`[Weekly Newsletter] Found ${weeklyPosts.length} posts from this week`)

  // Get active subscribers who opted in for weekly newsletter
  const subscribers = await getActiveSubscribers()
  const weeklySubscribers = subscribers.filter((s) => s.weeklyNewsletter)

  if (weeklySubscribers.length === 0) {
    console.log('[Weekly Newsletter] No subscribers. Skipping.')
    return
  }

  console.log(`[Weekly Newsletter] Sending to ${weeklySubscribers.length} subscribers`)

  // Prepare posts for email (limit to top 10)
  const posts = weeklyPosts.slice(0, 10).map((post) => ({
    title: post.title,
    summary: post.summary || post.title,
    url: `${SITE_URL}${post.url}`,
    category: post.category,
    aiGenerated: post.aiGenerated,
  }))

  // Send newsletter
  const result = await sendNewsletter({
    to: weeklySubscribers.map((s) => s.email),
    posts,
    type: 'weekly',
  })

  if (result.success) {
    console.log('[Weekly Newsletter] Sent successfully!')
  } else {
    console.error('[Weekly Newsletter] Failed:', result.error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('[Weekly Newsletter] Error:', error)
  process.exit(1)
})
