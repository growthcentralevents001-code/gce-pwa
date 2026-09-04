/**
 * Enterprise Client / BDP / Expert presentation helpers — Checkpoint C reuse.
 * Display only; no commission / co-sign / milestone authority.
 */

import {
  EBDP_CLIENTS_PER_PACK,
  EBDP_DIRECT_TOTAL_MINOR,
  EBDP_ENTITLEMENT_BPS,
  EBDP_FINANCE_INITIAL_MINOR,
  EBDP_FINANCE_TOTAL_MINOR,
  EBDP_PERSON_MAX_PACKS,
  EBDP_RECOVERABLE_MINOR,
  EBDP_STANDARD_MAX_CLIENTS,
  ENTERPRISE_PLATFORM_COMMISSION_BPS,
  FINANCE_COSIGN_THRESHOLD_MINOR,
  financeCosignRequired,
} from "@/lib/architecture/enterprise/constants";
import { formatMinorInr } from "@/lib/frontend/partner/format";

export {
  EBDP_CLIENTS_PER_PACK,
  EBDP_DIRECT_TOTAL_MINOR,
  EBDP_ENTITLEMENT_BPS,
  EBDP_FINANCE_INITIAL_MINOR,
  EBDP_FINANCE_TOTAL_MINOR,
  EBDP_PERSON_MAX_PACKS,
  EBDP_RECOVERABLE_MINOR,
  EBDP_STANDARD_MAX_CLIENTS,
  ENTERPRISE_PLATFORM_COMMISSION_BPS,
  FINANCE_COSIGN_THRESHOLD_MINOR,
  financeCosignRequired,
  formatMinorInr,
};

export const ENTERPRISE_CLIENT_ROLE_LABEL = "Enterprise Client";
export const ENTERPRISE_BDP_ROLE_LABEL = "Enterprise BDP";
export const ENTERPRISE_EXPERT_ROLE_LABEL = "Enterprise Platform Expert";

/** Entitlement is 25% of eligible GCE platform commission — NOT project value. */
export const EBDP_ENTITLEMENT_COPY =
  "Enterprise BDP entitlement is based on the eligible GCE platform commission for attributed components — not 25% of total project value.";

/** FD-038: strictly greater than ₹5,00,000 — never "₹5L and above". */
export const FINANCE_COSIGN_COPY =
  "Finance co-sign required for proposals above ₹5,00,000";

export const GCE_EXECUTION_ROLE_COPY =
  "Delivery structure is project-specific. GCE coordinates platform-managed components and does not automatically physically execute every project.";

export const EXPERT_NO_COMMISSION_COPY =
  "Enterprise Platform Expert structures requirements and proposals. There is no automatic Expert commission.";

export const VENDOR_MANAGED_RECORD_COPY =
  "Vendors are managed records. Vendor self-service login and workspace are not available at launch.";

export const ORG_VS_REP_COPY =
  "Enterprise Client organisation is separate from the Enterprise Client Representative acting for it.";

export function ebdpPackageOptionLabel(option: string): string {
  if (option === "direct_30000") return "Direct — ₹30,000";
  if (option === "finance_recovery_36000") {
    return "Finance — ₹36,000 (₹5,000 + ₹31,000 recoverable)";
  }
  return option.replace(/_/g, " ");
}

export function clientCapacityLabel(
  active: number,
  capacity = EBDP_CLIENTS_PER_PACK
): string {
  const capped = Math.min(Math.max(0, active), capacity);
  return `${capped} / ${capacity}`;
}

export function financeCosignStatusLabel(input: {
  required?: boolean | null;
  status?: string | null;
  cosignedAt?: string | null;
}): { label: string; tone: "neutral" | "success" | "warning" | "pending" | "error" } {
  const status = String(input.status ?? "");
  if (status === "finance_cosigned" || input.cosignedAt) {
    return { label: "Finance co-signed", tone: "success" };
  }
  if (status === "pending_finance_cosign" || input.required) {
    return { label: "Finance co-sign pending", tone: "pending" };
  }
  if (input.required === false) {
    return { label: "Finance co-sign not required", tone: "neutral" };
  }
  return { label: status ? status.replace(/_/g, " ") : "Co-sign status unknown", tone: "neutral" };
}

export function opportunityStatusLabel(status: string): string {
  const map: Record<string, string> = {
    open: "Open",
    qualifying: "Qualifying",
    proposal_in_progress: "Proposal in progress",
    quoting: "Quoting",
    won: "Won",
    lost: "Lost",
    cancelled: "Cancelled",
    archived: "Archived",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

/** Display-only. Never leak snake_case enum keys into headers. */
export function formatContractualRole(role: string): string {
  if (role === "platform_intermediary") return "Platform intermediary";
  return role.replace(/_/g, " ");
}

export function milestoneTimelineTone(
  status: string
): "neutral" | "success" | "warning" | "pending" {
  switch (status) {
    case "approved":
    case "paid":
    case "waived":
      return "success";
    case "due":
    case "submitted":
    case "overdue":
    case "blocked":
      return "warning";
    case "cancelled":
      return "neutral";
    case "planned":
    default:
      return "pending";
  }
}

export function projectStatusLabel(status: string): string {
  const map: Record<string, string> = {
    setup: "Setup",
    approved: "Approved",
    active: "Active",
    on_hold: "On hold",
    completed: "Completed",
    cancelled: "Cancelled",
    disputed: "Disputed",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function milestoneStatusLabel(status: string): string {
  const map: Record<string, string> = {
    planned: "Planned",
    due: "Due",
    submitted: "Submitted",
    approved: "Approved",
    paid: "Paid",
    waived: "Waived",
    cancelled: "Cancelled",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function attributionStatusLabel(status: string): string {
  const map: Record<string, string> = {
    proposed: "Proposed — awaiting Platform confirmation",
    active: "Attributed to Enterprise BDP",
    unattributed: "Organic / unattributed (valid)",
    reassigned: "Reassigned (prospective)",
    suspended: "Suspended",
    voided: "Voided",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

/** Stale Enterprise terms that must not appear in Batch 6-owned UI. */
export const STALE_ENTERPRISE_TERMS = [
  "25% of project value",
  "25% of total project",
  "30/40/30",
  "30-40-30",
  "Vendor login",
  "Vendor dashboard",
  "Vendor workspace",
  "Expert commission",
  "Enterprise BDM",
  "Super Admin",
  "territory ownership",
  "zone ownership",
  "₹5,00,000 and above",
  "₹5L and above",
  ">= ₹5,00,000",
] as const;

export function containsStaleEnterpriseTerm(text: string): boolean {
  const lower = text.toLowerCase();
  return STALE_ENTERPRISE_TERMS.some((t) => lower.includes(t.toLowerCase()));
}
