/**
 * Phase 6 Connect BDP permission codes (Technical Recommendation).
 * Enforced in API/services; RLS protects row ownership.
 */
export const PHASE6_CONNECT_BDP_PERMISSIONS = [
  "connect_bdp.unit.read.own",
  "connect_bdp.unit.apply",
  "connect_bdp.unit.approve",
  "connect_bdp.city.assign",
  "connect_bdp.attribution.propose",
  "connect_bdp.attribution.approve",
  "connect_bdp.circle.assign",
  "connect_bdp.target.read.own",
  "connect_bdp.commission.read.own",
  "connect_bdp.commission.read.finance",
  "connect_bdp.recovery.apply",
  "connect_bdp.dispute.manage.own",
  "connect_bdp.dispute.escalate",
  "connect_bdp.handover.manage",
  "connect_bdp.suspend",
] as const;

export type Phase6ConnectBdpPermission =
  (typeof PHASE6_CONNECT_BDP_PERMISSIONS)[number];

import type { GceRoleKey, RoleAssignment } from "../types";

const PLATFORM_OPS: GceRoleKey[] = [
  "platform_admin",
  "support_admin",
  "compliance_admin",
];

export const CONNECT_BDP_PERMISSION_ROLES: Record<
  Phase6ConnectBdpPermission,
  readonly GceRoleKey[]
> = {
  "connect_bdp.unit.read.own": ["connect_bdp", ...PLATFORM_OPS],
  "connect_bdp.unit.apply": ["connect_bdp", ...PLATFORM_OPS],
  "connect_bdp.unit.approve": PLATFORM_OPS,
  "connect_bdp.city.assign": PLATFORM_OPS,
  "connect_bdp.attribution.propose": ["connect_bdp", ...PLATFORM_OPS],
  "connect_bdp.attribution.approve": PLATFORM_OPS,
  "connect_bdp.circle.assign": PLATFORM_OPS,
  "connect_bdp.target.read.own": ["connect_bdp", ...PLATFORM_OPS, "finance_admin"],
  "connect_bdp.commission.read.own": ["connect_bdp", ...PLATFORM_OPS],
  "connect_bdp.commission.read.finance": ["finance_admin", ...PLATFORM_OPS],
  "connect_bdp.recovery.apply": ["finance_admin", "platform_admin"],
  "connect_bdp.dispute.manage.own": [
    "connect_bdp",
    "platform_relationship_manager",
    ...PLATFORM_OPS,
  ],
  "connect_bdp.dispute.escalate": [
    "connect_bdp",
    "platform_relationship_manager",
    "relationship_manager",
    ...PLATFORM_OPS,
  ],
  "connect_bdp.handover.manage": PLATFORM_OPS,
  "connect_bdp.suspend": PLATFORM_OPS,
};

export function actorHasConnectBdpPermission(
  assignments: RoleAssignment[],
  permission: Phase6ConnectBdpPermission
): boolean {
  const allowed = CONNECT_BDP_PERMISSION_ROLES[permission];
  return assignments.some(
    (a) =>
      a.status === "active" &&
      (allowed as readonly string[]).includes(a.roleKey)
  );
}
