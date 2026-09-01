/**
 * Roles / routes that must never appear in active Batch 0 navigation.
 * FD-039 / ADR-011 quarantine.
 */
export const LEGACY_NAV_IDS = [
  "zbp",
  "bdm",
  "affiliate",
  "franchisee",
  "super-admin",
  "marketplace-affiliate",
] as const;

export const LEGACY_NAV_HREF_FRAGMENTS = [
  "/dashboard/zbp",
  "/dashboard/bdm",
  "/dashboard/affiliate",
  "/dashboard/franchisee",
  "/dashboard/user",
  "/admin/zbp",
  "/admin/affiliates",
  "/admin/franchisees",
  "/admin/dashboard",
  "/admin/analytics",
  "/admin/bookings",
  "/admin/logs",
  "/admin/leads",
  "/admin/ratings",
  "/admin/thecircle",
  "/affiliate",
  "/bdm-dashboard",
  "/partner-dashboard",
] as const;

export const FUTURE_INACTIVE_NAV_IDS = [
  "core-direct-purchase",
  "paid-lead-assist",
  "wallet-cashout",
  "vendor-self-service",
] as const;

export function isLegacyNavHref(href: string): boolean {
  const normalized = href.replace(/\/$/, "") || href;
  return LEGACY_NAV_HREF_FRAGMENTS.some(
    (frag) => normalized === frag || normalized.startsWith(`${frag}/`)
  );
}
