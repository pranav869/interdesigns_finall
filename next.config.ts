import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // Allow serving images from the final projects folder via API
  async rewrites() {
    return []
  },
}

export default nextConfig
