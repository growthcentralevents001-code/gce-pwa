import { RateLimitError } from "@/lib/errors";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Simple in-memory rate limiter (Phase 3 foundation).
 * Suitable for single-node VPS; not a distributed limiter.
 */
export function checkRateLimit(
  key: string,
  options: { max: number; windowMs: number }
): void {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return;
  }
  existing.count += 1;
  if (existing.count > options.max) {
    throw new RateLimitError("Rate limit exceeded", {
      details: { retryAfterMs: existing.resetAt - now },
    });
  }
}

/** Test helper — clears buckets. */
export function __resetRateLimitBucketsForTests(): void {
  buckets.clear();
}
