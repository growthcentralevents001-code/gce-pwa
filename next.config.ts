import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  turbopack: {},
  async redirects() {
    return [
      // Batch 10 — retire mega-admin UI; Ops is canonical (Batch 8)
      { source: "/admin", destination: "/ops", permanent: false },
      { source: "/admin/:path*", destination: "/ops", permanent: false },
      { source: "/admin-events", destination: "/ops", permanent: false },
      { source: "/admin-partners", destination: "/ops", permanent: false },
      // Legacy partner entry
      { source: "/partner-dashboard", destination: "/dashboard/venue", permanent: false },
      // Booking single truth
      { source: "/booking", destination: "/customer/events", permanent: false },
      { source: "/booking/:path*", destination: "/customer/events", permanent: false },
      { source: "/bookings", destination: "/customer/bookings", permanent: false },
      { source: "/checkout", destination: "/customer/events", permanent: false },
      { source: "/wishlist", destination: "/customer/wishlist", permanent: false },
      { source: "/profile", destination: "/settings/profile", permanent: false },
      // Venue invent-fee plans → apply flow
      { source: "/venue/plans", destination: "/venue/apply", permanent: false },
      // Inactive commercial workspaces (FD-039) — public marketing paths
      { source: "/zbp", destination: "/for-partners", permanent: false },
      { source: "/zbp/:path*", destination: "/for-partners", permanent: false },
      { source: "/affiliate", destination: "/for-partners", permanent: false },
      { source: "/affiliate/:path*", destination: "/for-partners", permanent: false },
      { source: "/bdm-dashboard", destination: "/for-partners", permanent: false },
      // Phase 14B — retire legacy Venue dashboard siblings (canonical /venue/*)
      {
        source: "/dashboard/venue/events",
        destination: "/venue/events",
        permanent: false,
      },
      {
        source: "/dashboard/venue/events/:path*",
        destination: "/venue/events",
        permanent: false,
      },
      {
        source: "/dashboard/venue/create-event",
        destination: "/venue/events/new",
        permanent: false,
      },
      {
        source: "/dashboard/venue/bookings",
        destination: "/venue/bookings",
        permanent: false,
      },
    ];
  },
};

/**
 * Production PWA: static assets may cache; authenticated /api/* must never
 * be stored in the service worker (Batch 10 / Checkpoint E privacy).
 */
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
    runtimeCaching: [
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkOnly",
        method: "GET",
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkOnly",
        method: "POST",
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkOnly",
        method: "PUT",
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkOnly",
        method: "PATCH",
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkOnly",
        method: "DELETE",
      },
      {
        urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "google-fonts",
          expiration: { maxEntries: 8, maxAgeSeconds: 60 * 60 * 24 * 365 },
        },
      },
      {
        urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-image-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
      {
        urlPattern: /\.(?:js|css|woff2?)$/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "static-style-script-assets",
          expiration: { maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      {
        urlPattern: ({ request }: { request: Request }) =>
          request.mode === "navigate",
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          networkTimeoutSeconds: 10,
          expiration: { maxEntries: 32, maxAgeSeconds: 60 * 60 * 24 },
        },
      },
    ],
  });
  return withPWA(config);
}

export default withOptionalPWA(nextConfig);
