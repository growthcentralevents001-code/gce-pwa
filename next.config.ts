import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {},
};

function withOptionalPWA(config: NextConfig): NextConfig {
  if (process.env.NODE_ENV !== "production") {
    return config;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withPWA = require("next-pwa")({
    dest: "public",
    disable: false,
    register: true,
    skipWaiting: true,
  });
  return withPWA(config);
}

export default withOptionalPWA(nextConfig);
