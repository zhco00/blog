import { withContentCollections } from '@content-collections/next'
import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
}

const sentryConfig = {
  // Suppresses source map uploading logs during build
  silent: true,
  // Upload source maps only in production
  disableSourceMapUpload: process.env.NODE_ENV !== 'production',
}

export default withSentryConfig(
  withContentCollections(nextConfig),
  sentryConfig
)
