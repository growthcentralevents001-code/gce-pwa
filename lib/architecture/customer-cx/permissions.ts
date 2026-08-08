import type { RoleAssignment } from "../types";
import { isAssignmentActive } from "../rbac/permissions";

export const CUSTOMER_CX_PERMISSIONS = [
  "cx.discover",
  "cx.book",
  "cx.booking.read_own",
  "cx.ticket.read_own",
  "cx.cancel_own",
  "cx.refund_request",
  "cx.offer_claim",
  "cx.redeem_own",
  "cx.feedback",
  "cx.rank.read_own",
  "cx.check_in.venue",
  "cx.redeem.venue",
] as const;

export type CustomerCxPermission = (typeof CUSTOMER_CX_PERMISSIONS)[number];

export function actorHasCxPermission(
  assignments: RoleAssignment[],
  permission: CustomerCxPermission
): boolean {
  const roles = new Set(
    assignments.filter((a) => isAssignmentActive(a)).map((a) => a.roleKey)
  );
  const isCustomer =
    roles.size === 0 ||
    roles.has("platform_user") ||
    roles.has("circle_member") ||
    roles.has("governing_body_member");
  const isVenue = roles.has("venue_representative");
  const isOps =
    roles.has("platform_admin") ||
    roles.has("support_admin") ||
    roles.has("finance_admin");

  switch (permission) {
    case "cx.discover":
    case "cx.book":
    case "cx.booking.read_own":
    case "cx.ticket.read_own":
    case "cx.cancel_own":
    case "cx.refund_request":
    case "cx.offer_claim":
    case "cx.redeem_own":
    case "cx.feedback":
    case "cx.rank.read_own":
      return isCustomer || isOps || isVenue;
    case "cx.check_in.venue":
    case "cx.redeem.venue":
      return isVenue || isOps;
    default:
      return false;
  }
}
