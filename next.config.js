const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for multiple lockfiles warning
  outputFileTracingRoot: path.join(__dirname),
  
  async headers() {
    return [
      {
        source: '/admin',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ]
  },
}
module.exports = nextConfig
