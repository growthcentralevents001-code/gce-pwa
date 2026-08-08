/** Customer CX presentation helpers — never invent business economics. */

import type { StatusTone } from "@/lib/frontend/status";

export function formatInrMinor(
  minor: number | null | undefined,
  currency = "INR"
): string {
  if (minor == null || Number.isNaN(Number(minor))) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(minor) / 100);
}

export function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function bookingStatusTone(status: string): StatusTone {
  switch (status) {
    case "confirmed":
    case "paid":
      return "success";
    case "pending_payment":
      return "pending";
    case "refund_pending":
    case "cancel_requested":
      return "warning";
    case "cancelled":
    case "failed":
    case "expired":
      return "error";
    case "refunded":
      return "inactive";
    default:
      return "neutral";
  }
}

export function ticketStatusTone(status: string): StatusTone {
  switch (status) {
    case "issued":
    case "valid":
      return "success";
    case "checked_in":
      return "info";
    case "cancelled":
    case "void":
      return "inactive";
    default:
      return "neutral";
  }
}

export function claimStatusTone(
  status: string,
  expired?: boolean
): StatusTone {
  if (expired || status === "expired") return "inactive";
  switch (status) {
    case "claimed":
      return "warning";
    case "redeemed":
      return "success";
    default:
      return "neutral";
  }
}

/** Format remaining time until server-provided expiry (display only). */
export function formatTimeRemaining(
  expiresAt: string | null | undefined,
  now = Date.now()
): { label: string; urgent: boolean; expired: boolean } {
  if (!expiresAt) return { label: "—", urgent: false, expired: false };
  const ms = new Date(expiresAt).getTime() - now;
  if (Number.isNaN(ms) || ms <= 0) {
    return { label: "Expired", urgent: false, expired: true };
  }
  const hours = Math.floor(ms / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  const urgent = ms < 12 * 3_600_000;
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { label: `${days}d ${hours % 24}h left`, urgent, expired: false };
  }
  if (hours > 0)
    return { label: `${hours}h ${mins}m left`, urgent, expired: false };
  return { label: `${mins}m left`, urgent: true, expired: false };
}

export function venueDisplayName(venue: unknown): string {
  if (!venue || typeof venue !== "object") return "";
  const v = venue as Record<string, unknown>;
  const name = v.display_name ?? v.displayName;
  const city = v.city;
  if (name && city) return `${String(name)} · ${String(city)}`;
  if (name) return String(name);
  if (city) return String(city);
  return "";
}

export function extractApiError(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const o = json as Record<string, unknown>;
  const err = o.error;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  if (typeof o.message === "string") return o.message;
  return fallback;
}

const QR_SESSION_PREFIX = "gce.cx.qr.";

/** One-time QR tokens after sandbox confirm — never invent tokens. */
export function stashBookingQrTokens(
  bookingId: string,
  tokens: string[]
): void {
  if (typeof window === "undefined" || !tokens.length) return;
  try {
    sessionStorage.setItem(
      `${QR_SESSION_PREFIX}${bookingId}`,
      JSON.stringify(tokens)
    );
  } catch {
    // ignore storage failures
  }
}

export function takeBookingQrTokens(bookingId: string): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const key = `${QR_SESSION_PREFIX}${bookingId}`;
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    sessionStorage.removeItem(key);
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((t): t is string => typeof t === "string")
      : null;
  } catch {
    return null;
  }
}

const CLAIM_SESSION_PREFIX = "gce.cx.claim.";

export function stashClaimToken(
  claimId: string,
  token: string,
  expiresAt?: string | null
): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      `${CLAIM_SESSION_PREFIX}${claimId}`,
      JSON.stringify({ token, expiresAt: expiresAt ?? null })
    );
  } catch {
    // ignore
  }
}

export function peekClaimToken(
  claimId: string
): { token: string; expiresAt: string | null } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${CLAIM_SESSION_PREFIX}${claimId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string; expiresAt?: string | null };
    if (!parsed.token) return null;
    return { token: parsed.token, expiresAt: parsed.expiresAt ?? null };
  } catch {
    return null;
  }
}
