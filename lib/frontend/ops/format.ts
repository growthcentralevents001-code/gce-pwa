/**
 * Batch 8 — Ops presentation helpers (no policy authority).
 * Maps backend statuses to StatusBadge tones; never invents legal determinations.
 */

import type { StatusTone } from "@/lib/frontend/status";
import { toneFromStatusKeyword } from "@/lib/frontend/status";

export const OPS_ROLE_LABELS = {
  platform: "Platform Ops",
  connect: "Connect Ops",
  marketplace: "Marketplace Ops",
  enterprise: "Enterprise Ops",
  finance: "Finance Ops entry",
  compliance: "Compliance",
  support: "Support",
  desk: "Opportunity Desk",
  rm: "Relationship Manager",
  prm: "Platform Relationship Manager",
} as const;

/** Safe compliance copy — never invent statutory breach labels. */
export const COMPLIANCE_SAFE_COPY = {
  holdActive: "Compliance hold active — review required",
  holdReleased: "Hold released",
  flagged: "Flagged for review",
  pendingValidation: "Pending validation",
  reviewRequired: "Review required",
  notLegalDetermination:
    "System flags require human review. They are not a legal or statutory determination.",
} as const;

export const MARKETPLACE_OPS_COPY = {
  venueFinal:
    "Marketplace Ops holds final Venue onboarding approval. MBDP recommend ≠ approve.",
  mbdpRecommend:
    "Marketplace BDP may recommend. Platform / Marketplace Ops confirms.",
} as const;

export const CONNECT_OPS_COPY = {
  confirmBoundary:
    "System proposes → Connect BDP assists → Platform confirms. No self-approval.",
  disputeEscalation:
    "Connect BDP first; PRM escalation only when backend state permits.",
} as const;

export const DESK_COPY = {
  fallbackOnly:
    "Opportunity Desk handles unrouted / escalated opportunities — not primary Circle routing.",
  candidateNotAssignment:
    "Candidates are suggestions. Assignment requires an explicit backend-authorized action.",
  contactReveal:
    "Contact details remain server-authorized. Desk UI never dumps raw contact payloads.",
  paidOff: "Paid Lead Assist mechanics remain OFF.",
} as const;

export const ENTERPRISE_OPS_COPY = {
  cosign:
    "Finance co-sign applies strictly above ₹5,00,000 — Ops does not approve Finance here.",
  noTerritory: "Enterprise Ops has no territory ownership model.",
  expertNoCommission: "Platform Expert has no automatic commission.",
} as const;

export function opsStatusTone(raw: string | null | undefined): StatusTone {
  if (!raw) return "neutral";
  const s = raw.toLowerCase();
  if (/\b(held|hold|escalated|investigating|flagged)\b/.test(s)) return "warning";
  if (/\b(pending|assigned|open|queued|candidate|proposed)\b/.test(s))
    return "pending";
  if (/\b(approved|resolved|closed|released|restored|dismissed)\b/.test(s))
    return "success";
  if (/\b(rejected|suspended|hidden|blocked|critical)\b/.test(s)) return "error";
  return toneFromStatusKeyword(raw);
}

/** UI SoD hint — backend still enforces assertOpsNotSelfApproval. */
export function isSelfApprovalBlocked(
  actorUserId: string | null | undefined,
  requesterUserId: string | null | undefined
): boolean {
  if (!actorUserId || !requesterUserId) return false;
  return actorUserId === requesterUserId;
}

/** Mask sensitive identifiers for Ops display. */
export function maskSensitiveId(value: string | null | undefined, visible = 4): string {
  if (!value) return "—";
  if (value.length <= visible) return "••••";
  return `${"•".repeat(Math.min(8, value.length - visible))}${value.slice(-visible)}`;
}

export function maskContactHint(revealed: boolean): string {
  return revealed ? "Contact available (authorized)" : "Contact not revealed";
}

/** Backend hold statuses today: active | released (+ legacy). Map display labels carefully. */
export function complianceHoldLabel(status: string): string {
  const s = status.toLowerCase();
  if (s === "active") return "Active";
  if (s === "released") return "Released";
  if (s === "proposed") return "Proposed";
  if (s === "release_requested") return "Release requested";
  if (s === "rejected") return "Rejected";
  if (s === "none") return "None";
  return status;
}
