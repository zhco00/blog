export interface AIPublishNotification {
  title: string
  slug: string
  type: string
  tokensUsed: number
}

/**
 * Send Discord notification when AI publishes a new post
 */
export async function notifyAIPublish(data: AIPublishNotification): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) {
    console.log('[notifyAIPublish] Discord webhook not configured, skipping notification')
    return
  }

  const embed = {
    title: '🤖 New AI Post Published',
    color: 0x7c3aed, // Purple
    fields: [
      { name: 'Title', value: data.title, inline: false },
      { name: 'Type', value: data.type, inline: true },
      { name: 'Tokens Used', value: String(data.tokensUsed), inline: true },
      { name: 'Slug', value: data.slug, inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: 'AI Blog Automation',
    },
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    })

    if (!response.ok) {
      throw new Error(`Discord webhook returned ${response.status}`)
    }

    console.log('[notifyAIPublish] Notification sent successfully')
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`[notifyAIPublish] Failed - data: ${JSON.stringify(data)}, error: ${errorMessage}`)
    // Don't throw - notification failure shouldn't break the main flow
  }
}

/**
 * Check if Discord notifications are configured
 */
export function isNotificationConfigured(): boolean {
  return !!process.env.DISCORD_WEBHOOK_URL
}
