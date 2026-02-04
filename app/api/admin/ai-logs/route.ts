import { NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { isDbAvailable } from '@/lib/db/client'
import { getAIGenerations, getAIGenerationStats } from '@/lib/db/queries'

/**
 * GET /api/admin/ai-logs - Get AI generation logs and stats
 */
export async function GET() {
  try {
    // Check authentication
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isDbAvailable) {
      return NextResponse.json({
        logs: [],
        stats: {
          totalGenerated: 0,
          totalPublished: 0,
          totalTokensUsed: 0,
          estimatedCost: 0,
        },
      })
    }

    const logs = await getAIGenerations(100) // Get last 100 logs
    const stats = await getAIGenerationStats()

    // Calculate estimated cost
    // Claude Sonnet 4: $3 per million input tokens, $15 per million output tokens
    // Assuming 50/50 split for simplicity
    const avgCostPerToken = (3 + 15) / 2 / 1_000_000
    const estimatedCost = (stats?.totalTokensUsed || 0) * avgCostPerToken

    return NextResponse.json({
      logs,
      stats: {
        ...stats,
        estimatedCost: Number(estimatedCost.toFixed(4)),
      },
    })
  } catch (error) {
    console.error('[API] GET /api/admin/ai-logs failed:', error)
    return NextResponse.json(
      { error: 'Failed to get AI logs' },
      { status: 500 }
    )
  }
}
