/**
 * Marketplace BDP / Venue presentation helpers — Checkpoint C reuse.
 * Display only; no split/eligibility/settlement authority.
 */

import {
  MBDP_COMMISSION_BPS,
  MBDP_DIRECT_TOTAL_MINOR,
  MBDP_FINANCE_INITIAL_MINOR,
  MBDP_FINANCE_TOTAL_MINOR,
  MBDP_PERSON_MAX_UNITS,
  MBDP_RECOVERABLE_MINOR,
  MBDP_STANDARD_MAX_VENUES,
  MBDP_VENUES_PER_UNIT,
  OFFER_CLAIM_VALIDITY_HOURS,
  OFFER_CUSTOMER_CAP,
  OFFER_MAX_CAMPAIGN_DAYS,
  OFFER_MIN_PLANNED_VALUE_MINOR,
} from "@/lib/architecture/marketplace/constants";
import { formatMinorInr } from "@/lib/frontend/partner/format";

export {
  MBDP_COMMISSION_BPS,
  MBDP_DIRECT_TOTAL_MINOR,
  MBDP_FINANCE_INITIAL_MINOR,
  MBDP_FINANCE_TOTAL_MINOR,
  MBDP_PERSON_MAX_UNITS,
  MBDP_RECOVERABLE_MINOR,
  MBDP_STANDARD_MAX_VENUES,
  MBDP_VENUES_PER_UNIT,
  OFFER_CLAIM_VALIDITY_HOURS,
  OFFER_CUSTOMER_CAP,
  OFFER_MAX_CAMPAIGN_DAYS,
  OFFER_MIN_PLANNED_VALUE_MINOR,
  formatMinorInr,
};

export const MARKETPLACE_BDP_ROLE_LABEL = "Marketplace BDP";
export const VENUE_PARTNER_ROLE_LABEL = "Venue Partner";

/** Canonical attributed economics copy — amounts still from backend. */
export const ATTRIBUTED_SPLIT_COPY =
  "Attributed eligible Event revenue: Venue 80% · Marketplace BDP 10% · GCE 10%";

/** Canonical unattributed economics — missing MBDP 10% is NOT pending. */
export const UNATTRIBUTED_SPLIT_COPY =
  "Unattributed: Venue 80% · Marketplace BDP 0% · GCE 20%. The missing 10% is not pending Marketplace BDP commission.";

export function mbdpPackageOptionLabel(option: string): string {
  if (option === "direct_50000") return "Direct — ₹50,000";
  if (option === "finance_recovery_60000") {
    return "Finance — ₹60,000 (₹5,000 + ₹55,000 recoverable)";
  }
  return option.replace(/_/g, " ");
}

export function venueStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    recommended: "Recommended by Marketplace BDP",
    under_review: "Platform review",
    active: "Active",
    rejected: "Rejected",
    needs_action: "Needs action",
    suspended: "Suspended",
    inactive: "Inactive",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function attributionStatusLabel(status: string): string {
  const map: Record<string, string> = {
    proposed: "Proposed — awaiting Platform confirmation",
    active: "Attributed to Marketplace BDP",
    unattributed: "Organic / unattributed (valid)",
    reassigned: "Reassigned",
    suspended: "Suspended",
    voided: "Voided",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function unitVenueCapacityLabel(
  active: number,
  capacity = MBDP_VENUES_PER_UNIT
): string {
  const capped = Math.min(Math.max(0, active), capacity);
  return `${capped} / ${capacity}`;
}

export function plannedSaleValueNote(): string {
  return `Minimum expected/planned sale value ${formatMinorInr(
    OFFER_MIN_PLANNED_VALUE_MINOR
  )} — not a fee, deposit, or guaranteed revenue.`;
}

export function offerCampaignRulesNote(): string {
  return `Campaign max ${OFFER_MAX_CAMPAIGN_DAYS} days · customer cap ${OFFER_CUSTOMER_CAP} · claim validity ${OFFER_CLAIM_VALIDITY_HOURS} hours (backend-enforced).`;
}

export const STALE_MARKETPLACE_TERMS = [
  "Affiliate",
  "ZBP",
  "₹30,000",
  "30,000",
  "24h claim",
  "24-hour claim",
  "Dedicated Relationship Manager",
  "Venue RM",
] as const;

export function containsStaleMarketplaceTerm(text: string): boolean {
  return STALE_MARKETPLACE_TERMS.some((t) =>
    text.toLowerCase().includes(t.toLowerCase())
  );
}

/** Venue relationship — MBDP that onboarded/attributed is the Marketplace RM (FD-033). */
export const VENUE_MBDP_RELATIONSHIP_COPY =
  "Your Marketplace BDP is your Marketplace relationship manager. There is no separate generic Venue RM column.";

/** Public / partner copy — performance-linked, not guaranteed (FD-033 / FD-029). */
export const MBDP_EARNINGS_DISCLAIMER =
  "Marketplace BDP commission is earned only on eligible attributed Marketplace Event revenue where valid Venue attribution exists — not on Offer Claims alone. Unattributed revenue uses 80/0/20 (the missing 10% is not pending MBDP commission). Earnings vary with Venue activity; no fixed income, guaranteed ROI, or passive income is promised.";
