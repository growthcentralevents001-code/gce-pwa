import type { RoleAssignment } from "../types";
import { isAssignmentActive } from "../rbac/permissions";

export const LEAD_ASSIST_PERMISSIONS = [
  "lead.create.own",
  "lead.read.own_sent",
  "lead.read.assigned",
  "lead.accept_decline",
  "lead.reveal_contact",
  "lead.outcome.submit",
  "lead.desk.review",
  "lead.desk.assign",
  "lead.desk.reassign",
] as const;

export type LeadAssistPermission = (typeof LEAD_ASSIST_PERMISSIONS)[number];

export function actorHasLeadPermission(
  assignments: RoleAssignment[],
  permission: LeadAssistPermission
): boolean {
  const active = assignments.filter((a) => isAssignmentActive(a));
  const roles = new Set(active.map((a) => a.roleKey));

  const isMember =
    roles.has("circle_member") ||
    roles.has("governing_body_member") ||
    roles.has("circle_finance_coordinator") ||
    roles.has("sergeant_at_arms") ||
    roles.has("platform_user");
  const isDesk =
    roles.has("opportunity_desk") ||
    roles.has("platform_admin") ||
    roles.has("platform_relationship_manager");
  const isOps = roles.has("platform_admin") || roles.has("support_admin");

  switch (permission) {
    case "lead.create.own":
    case "lead.read.own_sent":
    case "lead.read.assigned":
    case "lead.accept_decline":
    case "lead.reveal_contact":
    case "lead.outcome.submit":
      return isMember || isDesk || isOps;
    case "lead.desk.review":
    case "lead.desk.assign":
    case "lead.desk.reassign":
      return isDesk || isOps;
    default:
      return false;
  }
}

export function isOpportunityDeskActor(assignments: RoleAssignment[]): boolean {
  return actorHasLeadPermission(assignments, "lead.desk.review");
}
