import type { GceRoleKey, RoleAssignment } from "../types";

export const PHASE7_MARKETPLACE_PERMISSIONS = [
  "marketplace_bdp.unit.read.own",
  "marketplace_bdp.unit.approve",
  "marketplace.venue.create",
  "marketplace.venue.approve",
  "marketplace.attribution.propose",
  "marketplace.attribution.approve",
  "marketplace.event.manage",
  "marketplace.event.approve",
  "marketplace.offer.manage",
  "marketplace.offer.approve",
  "marketplace.entitlement.read",
  "marketplace.entitlement.finance",
  "marketplace.handover.manage",
] as const;

export type Phase7MarketplacePermission =
  (typeof PHASE7_MARKETPLACE_PERMISSIONS)[number];

const OPS: GceRoleKey[] = [
  "platform_admin",
  "support_admin",
  "compliance_admin",
];

export const MARKETPLACE_PERMISSION_ROLES: Record<
  Phase7MarketplacePermission,
  readonly GceRoleKey[]
> = {
  "marketplace_bdp.unit.read.own": ["marketplace_bdp", ...OPS],
  "marketplace_bdp.unit.approve": OPS,
  "marketplace.venue.create": [
    "marketplace_bdp",
    "venue_representative",
    ...OPS,
  ],
  "marketplace.venue.approve": OPS,
  "marketplace.attribution.propose": ["marketplace_bdp", ...OPS],
  "marketplace.attribution.approve": OPS,
  "marketplace.event.manage": ["venue_representative", ...OPS],
  "marketplace.event.approve": OPS,
  "marketplace.offer.manage": ["venue_representative", ...OPS],
  "marketplace.offer.approve": OPS,
  "marketplace.entitlement.read": [
    "marketplace_bdp",
    "venue_representative",
    "finance_admin",
    ...OPS,
  ],
  "marketplace.entitlement.finance": ["finance_admin", "platform_admin"],
  "marketplace.handover.manage": OPS,
};

export function actorHasMarketplacePermission(
  assignments: RoleAssignment[],
  permission: Phase7MarketplacePermission
): boolean {
  const allowed = MARKETPLACE_PERMISSION_ROLES[permission];
  return assignments.some(
    (a) =>
      a.status === "active" &&
      (allowed as readonly string[]).includes(a.roleKey)
  );
}
