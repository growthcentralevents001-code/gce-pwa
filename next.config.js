const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  typescript: { ignoreBuildErrors: false },
};

module.exports = nextConfig;
