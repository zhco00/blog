import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const JWT_SECRET = process.env.JWT_SECRET
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const COOKIE_NAME = 'admin-token'

// Check if auth is configured
const isAuthConfigured = Boolean(JWT_SECRET && ADMIN_PASSWORD)

if (!isAuthConfigured) {
  console.warn('[Auth] JWT_SECRET or ADMIN_PASSWORD not configured - auth disabled')
}

// Get secret as Uint8Array for jose
function getSecret(): Uint8Array {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }
  return new TextEncoder().encode(JWT_SECRET)
}

/**
 * Verify admin password
 */
export function verifyPassword(password: string): boolean {
  if (!isAuthConfigured || !ADMIN_PASSWORD) {
    console.warn('[Auth] Password verification attempted but auth not configured')
    return false
  }

  return password === ADMIN_PASSWORD
}

/**
 * Create admin session (HTTP-only cookie)
 */
export async function createSession(): Promise<void> {
  if (!isAuthConfigured) {
    throw new Error('Auth is not configured')
  }

  try {
    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(getSecret())

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
  } catch (error) {
    console.error('[Auth] createSession failed:', error)
    throw new Error('Failed to create session')
  }
}

/**
 * Verify session and return payload if valid
 */
export async function verifySession(): Promise<{ role: string } | null> {
  if (!isAuthConfigured) {
    return null
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const verified = await jwtVerify(token, getSecret())
    return verified.payload as { role: string }
  } catch (error) {
    // Token expired or invalid
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await verifySession()
  return session?.role === 'admin'
}

/**
 * Require authentication - redirect if not authenticated
 */
export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/admin/login')
  }
}

/**
 * Destroy session (logout)
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  } catch (error) {
    console.error('[Auth] destroySession failed:', error)
  }
}

/**
 * Get current user (if authenticated)
 */
export async function getCurrentUser(): Promise<{ role: string } | null> {
  return await verifySession()
}
