/**
 * Daily Newsletter Sender
 * Runs via GitHub Actions cron job
 */

import { getActiveSubscribers } from '../../lib/db/queries'
import { sendNewsletter } from '../../lib/email/send'
import { allPosts } from '../../.content-collections/generated'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3005'

async function main() {
  console.log('[Daily Newsletter] Starting...')

  // Get today's posts
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayPosts = allPosts.filter((post) => {
    const postDate = new Date(post.date)
    postDate.setHours(0, 0, 0, 0)
    return postDate.getTime() === today.getTime()
  })

  if (todayPosts.length === 0) {
    console.log('[Daily Newsletter] No new posts today. Skipping.')
    return
  }

  console.log(`[Daily Newsletter] Found ${todayPosts.length} new posts`)

  // Get active subscribers who opted in for daily newsletter
  const subscribers = await getActiveSubscribers()
  const dailySubscribers = subscribers.filter((s) => s.dailyNewsletter)

  if (dailySubscribers.length === 0) {
    console.log('[Daily Newsletter] No subscribers. Skipping.')
    return
  }

  console.log(`[Daily Newsletter] Sending to ${dailySubscribers.length} subscribers`)

  // Prepare posts for email
  const posts = todayPosts.map((post) => ({
    title: post.title,
    summary: post.summary || post.title,
    url: `${SITE_URL}${post.url}`,
    category: post.category,
    aiGenerated: post.aiGenerated,
  }))

  // Send newsletter
  const result = await sendNewsletter({
    to: dailySubscribers.map((s) => s.email),
    posts,
    type: 'daily',
  })

  if (result.success) {
    console.log('[Daily Newsletter] Sent successfully!')
  } else {
    console.error('[Daily Newsletter] Failed:', result.error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('[Daily Newsletter] Error:', error)
  process.exit(1)
})
