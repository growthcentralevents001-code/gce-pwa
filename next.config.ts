import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['growthcentralevents.com', '*.growthcentralevents.com', 'localhost'],
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
