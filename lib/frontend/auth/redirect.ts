/**
 * Safe post-auth redirect — blocks open redirects.
 * Allows relative paths only (must start with single `/`, not `//`).
 */
export function sanitizeAuthRedirect(
  raw: string | null | undefined,
  fallback = "/"
): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("://")) return fallback;
  if (/[\s\\]/.test(value)) return fallback;
  return value;
}

/** Accepts next | redirect | redirectTo query names used across the app. */
export function resolveAuthRedirectParam(
  params: URLSearchParams | { get(name: string): string | null },
  fallback = "/"
): string {
  const raw =
    params.get("next") ||
    params.get("redirectTo") ||
    params.get("redirect") ||
    null;
  return sanitizeAuthRedirect(raw, fallback);
}
