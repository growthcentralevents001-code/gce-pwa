/**
 * Phase 5 Membership & GCE Connect types.
 * Stored under lib/architecture/connect to avoid dirty types/index.ts WIP.
 */

export const MEMBERSHIP_STATUSES = [
  "draft",
  "applied",
  "pending_payment",
  "pending_verification",
  "pending_approval",
  "active",
  "grace_period",
  "frozen",
  "restricted",
  "suspended",
  "expired",
  "terminated",
  "rejoining_review",
  "archived",
] as const;

export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];

export const ALLOCATION_STATUSES = [
  "unallocated",
  "pending_allocation",
  "allocated",
  "waitlisted",
] as const;

export type AllocationStatus = (typeof ALLOCATION_STATUSES)[number];

export const CIRCLE_LIFECYCLE_STATUSES = [
  "draft",
  "formation",
  "pending_activation",
  "active_growth",
  "full_capacity",
  "mature",
  "under_review",
  "suspended",
  "merged",
  "archived",
] as const;

export type CircleLifecycleStatus = (typeof CIRCLE_LIFECYCLE_STATUSES)[number];

export const CIRCLE_CONSTITUTION_STATUSES = [
  "formation_circle",
  "provisionally_active_circle",
  "fully_constituted_circle",
] as const;

export type CircleConstitutionStatus =
  (typeof CIRCLE_CONSTITUTION_STATUSES)[number];

export const ASSOCIATE_PRICE_MINOR = 600_000; // ₹6,000
export const TAG_SURCHARGE_BPS = 2500; // +25%
export const MAX_TAGS = 4;
export const INCLUDED_TAG_SLOTS = 2;
export const CIRCLE_CAPACITY_MAX = 40;
export const SEAT_RESERVATION_DAYS = 7;
export const RENEWAL_NOTICE_DAYS = 30;
export const GRACE_DAYS = 30;
export const FREEZE_MAX_DAYS = 90;
export const GB_TERM_MONTHS = 6;
export const PRICING_RULE_VERSION = "fd027-v1";

export type ConnectMembership = {
  id: string;
  userId: string;
  planId: string;
  status: MembershipStatus;
  allocationStatus: AllocationStatus;
  specialisationId: string | null;
  organisationId: string | null;
  paymentIntentId: string | null;
  kycCaseId: string | null;
  preferredCity: string | null;
  preferredState: string | null;
  connectBdpUserId: string | null;
  activatedAt: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

export type ConnectCircle = {
  id: string;
  name: string;
  city: string;
  lifecycleStatus: CircleLifecycleStatus;
  constitutionStatus: CircleConstitutionStatus;
  activeSeatCount: number;
  capacityMax: number;
  platformActivationGrantedAt: string | null;
  bdpTargetCreditEventId: string | null;
};
