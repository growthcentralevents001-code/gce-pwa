/**
 * Connect member presentation helpers — display only; backend remains authority.
 */

import {
  CIRCLE_CAPACITY_MAX,
  ASSOCIATE_PRICE_MINOR,
  MAX_TAGS,
  INCLUDED_TAG_SLOTS,
  TAG_SURCHARGE_BPS,
  type AllocationStatus,
  type CircleConstitutionStatus,
  type CircleLifecycleStatus,
} from "@/lib/architecture/connect/types";
import { circleStatusesForCount, tagSurchargeForSlot } from "@/lib/architecture/connect/rules";
import type { StatusTone } from "@/lib/frontend/status";
import {
  GC_POWER_SECTORS,
  type GcPowerSectorId,
} from "@/lib/frontend/design-language";

export { CIRCLE_CAPACITY_MAX, ASSOCIATE_PRICE_MINOR, MAX_TAGS };

export type CircleDirectoryCard = {
  id: string;
  name: string;
  specialisation: string | null;
  sectorLabel: string | null;
  tagLabels: string[];
  status: string | null;
};

export function membershipStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Draft",
    applied: "Applied — awaiting review",
    pending_payment: "Payment pending",
    pending_verification: "Pending verification",
    pending_approval: "Pending platform approval",
    active: "Active",
    grace_period: "Grace period",
    frozen: "Frozen",
    restricted: "Restricted",
    suspended: "Suspended",
    expired: "Expired",
    terminated: "Terminated",
    rejoining_review: "Rejoining review",
    archived: "Archived",
  };
  return map[status] ?? status.replaceAll("_", " ");
}

export function membershipStatusTone(status: string): StatusTone {
  switch (status) {
    case "active":
      return "success";
    case "pending_payment":
    case "pending_verification":
    case "pending_approval":
    case "applied":
    case "draft":
    case "grace_period":
      return "pending";
    case "frozen":
    case "restricted":
    case "rejoining_review":
      return "warning";
    case "suspended":
    case "expired":
    case "terminated":
      return "error";
    case "archived":
      return "inactive";
    default:
      return "neutral";
  }
}

export function allocationStatusTone(status: string): StatusTone {
  switch (status) {
    case "allocated":
      return "success";
    case "pending_allocation":
    case "waitlisted":
      return "warning";
    case "unallocated":
      return "pending";
    default:
      return "neutral";
  }
}

export function leadStatusTone(status: string): StatusTone {
  switch (status) {
    case "accepted":
    case "contact_revealed":
    case "closed_dual_confirmed":
      return "success";
    case "offered":
    case "routing":
    case "routed":
    case "outcome_pending":
    case "in_follow_up":
      return "pending";
    case "review_required":
    case "disputed":
      return "warning";
    case "declined":
    case "expired":
    case "cancelled":
    case "closed_unconverted":
      return "error";
    default:
      return "neutral";
  }
}

export function formatLifecycleLabel(status: CircleLifecycleStatus | string): string {
  return String(status).replaceAll("_", " ");
}

export function formatConstitutionLabel(
  status: CircleConstitutionStatus | string
): string {
  return String(status).replaceAll("_", " ");
}

export function circleCapacityLabel(
  activeSeatCount: number,
  capacityMax = CIRCLE_CAPACITY_MAX
): string {
  const max = Math.min(capacityMax, CIRCLE_CAPACITY_MAX);
  const current = Math.min(Math.max(0, activeSeatCount), max);
  return `${current} / ${max}`;
}

/** Display helper — mirrors backend dual status model; does not allocate seats. */
export function displayStatusesForCount(count: number) {
  return circleStatusesForCount(count);
}

export function tagSlotCommercialNote(slot: number): string {
  if (slot <= INCLUDED_TAG_SLOTS) return "Included with Associate";
  const { surchargeMinor } = tagSurchargeForSlot(slot);
  return `+₹${(surchargeMinor / 100).toLocaleString("en-IN")} / quarter (+${TAG_SURCHARGE_BPS / 100}% base)`;
}

export function associatePlanLabel(): string {
  return `Associate · ₹${(ASSOCIATE_PRICE_MINOR / 100).toLocaleString("en-IN")} / quarter`;
}

export function waitlistCopy(allocationStatus: AllocationStatus | string): {
  title: string;
  description: string;
} {
  if (allocationStatus === "waitlisted") {
    return {
      title: "On waitlist",
      description:
        "You are waitlisted for Circle allocation. Queue position is not shown unless the server provides it — membership remains valid while allocation is pending.",
    };
  }
  if (allocationStatus === "unallocated") {
    return {
      title: "Temporarily unallocated",
      description:
        "Active membership does not require immediate Circle allocation. Activation and allocation are separate.",
    };
  }
  if (allocationStatus === "pending_allocation") {
    return {
      title: "Allocation in progress",
      description:
        "A Circle allocation proposal is pending confirmation. The platform decides alternatives, waitlist, or formation — not this screen.",
    };
  }
  return {
    title: "Allocated",
    description: "Your membership is allocated to a Circle seat.",
  };
}

export function extractApiError(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const o = json as Record<string, unknown>;
  const err = o.error;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return fallback;
}

export function isPaidLeadAssistExposed(flags: Record<string, boolean> | null): boolean {
  if (!flags) return false;
  return Object.values(flags).some(Boolean);
}

/** Legacy seed keys (sector_a–d) → canonical GC Power Sector ids (FD-030). */
const LEGACY_POWER_SECTOR_KEYS: Record<string, GcPowerSectorId> = {
  sector_a: "real_estate",
  sector_b: "industrial",
  sector_c: "professional",
  sector_d: "consumer",
};

export function normalizePowerSectorKey(
  raw: string | null | undefined
): GcPowerSectorId | null {
  if (!raw?.trim()) return null;
  const key = raw.trim().toLowerCase();
  if (LEGACY_POWER_SECTOR_KEYS[key]) return LEGACY_POWER_SECTOR_KEYS[key];
  const byId = GC_POWER_SECTORS.find((s) => s.id === key);
  if (byId) return byId.id;
  const needle = key.replaceAll("_", " ");
  const byLabel = GC_POWER_SECTORS.find(
    (s) =>
      s.label.toLowerCase().includes(needle) ||
      s.shortLabel.toLowerCase().includes(needle)
  );
  return byLabel?.id ?? null;
}

export function formatPowerSectorLabel(
  raw: string | null | undefined
): string | null {
  const id = normalizePowerSectorKey(raw);
  if (!id) return raw?.trim() || null;
  return GC_POWER_SECTORS.find((s) => s.id === id)?.shortLabel ?? raw?.trim() ?? null;
}

export function countMembersByPowerSector(
  members: CircleDirectoryCard[]
): Record<GcPowerSectorId, number> {
  const counts = Object.fromEntries(
    GC_POWER_SECTORS.map((s) => [s.id, 0])
  ) as Record<GcPowerSectorId, number>;
  for (const member of members) {
    const id = normalizePowerSectorKey(member.sectorLabel);
    if (id) counts[id] += 1;
  }
  return counts;
}

/** Unique specialisation labels represented per GC Power Sector. */
export function specialisationsByPowerSector(
  members: CircleDirectoryCard[]
): Record<GcPowerSectorId, string[]> {
  const result = Object.fromEntries(
    GC_POWER_SECTORS.map((s) => [s.id, [] as string[]])
  ) as Record<GcPowerSectorId, string[]>;
  for (const member of members) {
    const id = normalizePowerSectorKey(member.sectorLabel);
    if (!id || !member.specialisation?.trim()) continue;
    const list = result[id];
    if (!list.includes(member.specialisation)) {
      list.push(member.specialisation);
    }
  }
  for (const sector of GC_POWER_SECTORS) {
    result[sector.id].sort((a, b) => a.localeCompare(b));
  }
  return result;
}

export function circleRemainingSeatsLabel(
  activeSeatCount: number,
  capacityMax = CIRCLE_CAPACITY_MAX
): string {
  const max = Math.min(capacityMax, CIRCLE_CAPACITY_MAX);
  const current = Math.min(Math.max(0, activeSeatCount), max);
  const remaining = Math.max(0, max - current);
  if (remaining === 0) return "Circle full — no seats remaining";
  return `${remaining} seat${remaining === 1 ? "" : "s"} remaining`;
}
