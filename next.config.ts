import type { NextConfig } from 'next'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  // Note: Security headers (X-Frame-Options, HSTS, etc.) must be configured
  // at the hosting platform level (e.g. _headers file for Netlify/Cloudflare Pages)
  // because output: 'export' ignores Next.js headers() config.
}

export default nextConfig
