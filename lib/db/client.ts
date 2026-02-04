import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Check if DATABASE_URL is configured
const databaseUrl = process.env.DATABASE_URL

let db: ReturnType<typeof drizzle> | null = null
let isDbAvailable = false

// Initialize database connection with graceful fallback
if (databaseUrl) {
  try {
    const sql = neon(databaseUrl)
    db = drizzle(sql, { schema })
    isDbAvailable = true
  } catch (error) {
    console.warn('[DB] Failed to initialize database connection:', error)
    isDbAvailable = false
  }
} else {
  console.warn('[DB] DATABASE_URL not configured - running in no-database mode')
}

// Export database instance (can be null)
export { db, isDbAvailable }

// Helper function to check if database is available
export function requireDb() {
  if (!isDbAvailable || !db) {
    throw new Error('Database is not available. Please configure DATABASE_URL.')
  }
  return db
}
