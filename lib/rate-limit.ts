/**
 * Simple in-memory rate limiter for API endpoints
 * For production, consider using Redis or Upstash Rate Limit
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Check rate limit for a given key (e.g., IP address or user ID)
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  // Clean up expired entries periodically
  if (store.size > 10000) {
    for (const [k, v] of store.entries()) {
      if (v.resetTime < now) {
        store.delete(k)
      }
    }
  }

  // No existing entry or expired
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowMs
    store.set(key, { count: 1, resetTime })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime,
    }
  }

  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment counter
  const updated = { ...entry, count: entry.count + 1 }
  store.set(key, updated)

  return {
    success: true,
    remaining: config.maxRequests - updated.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

// Default rate limit configs
export const AI_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10, // 10 requests
  windowMs: 60 * 1000, // per minute
}

export const SUMMARY_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 20, // 20 summaries
  windowMs: 60 * 60 * 1000, // per hour
}
