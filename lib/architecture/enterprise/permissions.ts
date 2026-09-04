import type { RoleAssignment } from "../types";

export const ENTERPRISE_PERMISSIONS = [
  "enterprise.client.read",
  "enterprise.client.write",
  "enterprise.opportunity.read",
  "enterprise.opportunity.write",
  "enterprise.requirement.submit",
  "enterprise.requirement.respond",
  "enterprise.requirement.structure",
  "enterprise.proposal.draft",
  "enterprise.quote.create",
  "enterprise.quote.issue",
  "enterprise.quote.accept",
  "enterprise.quote.finance_cosign",
  "enterprise.project.read",
  "enterprise.project.write",
  "enterprise.vendor.manage",
  "enterprise.attribution.manage",
  "enterprise.entitlement.read",
  "enterprise.dispute.open",
] as const;

export type EnterprisePermission = (typeof ENTERPRISE_PERMISSIONS)[number];

const ROLE_PERMS: Record<string, readonly EnterprisePermission[]> = {
  enterprise_client_representative: [
    "enterprise.client.read",
    "enterprise.opportunity.read",
    "enterprise.requirement.submit",
    "enterprise.requirement.respond",
    "enterprise.quote.accept",
    "enterprise.project.read",
    "enterprise.dispute.open",
  ],
  enterprise_bdp: [
    "enterprise.client.read",
    "enterprise.opportunity.read",
    "enterprise.opportunity.write",
    "enterprise.project.read",
    "enterprise.entitlement.read",
    "enterprise.dispute.open",
  ],
  enterprise_platform_expert: [
    "enterprise.client.read",
    "enterprise.client.write",
    "enterprise.opportunity.read",
    "enterprise.opportunity.write",
    "enterprise.requirement.structure",
    "enterprise.proposal.draft",
    "enterprise.quote.create",
    "enterprise.quote.issue",
    "enterprise.project.read",
    "enterprise.project.write",
    "enterprise.vendor.manage",
    "enterprise.dispute.open",
  ],
  finance_admin: [
    "enterprise.quote.finance_cosign",
    "enterprise.entitlement.read",
    "enterprise.project.read",
    "enterprise.quote.create",
  ],
  platform_admin: ENTERPRISE_PERMISSIONS,
  opportunity_desk: [
    "enterprise.client.write",
    "enterprise.attribution.manage",
    "enterprise.quote.issue",
    "enterprise.project.write",
    "enterprise.vendor.manage",
  ],
};

export function actorHasEnterprisePermission(
  assignments: RoleAssignment[],
  permission: EnterprisePermission
): boolean {
  return assignments.some((a) => {
    if (a.status !== "active") return false;
    const perms = ROLE_PERMS[a.roleKey] ?? [];
    return perms.includes(permission);
  });
}

export function actorIsEnterpriseBdp(assignments: RoleAssignment[]): boolean {
  return assignments.some(
    (a) => a.status === "active" && a.roleKey === "enterprise_bdp"
  );
}
