import {
  ASSOCIATE_PRICE_MINOR,
  INCLUDED_TAG_SLOTS,
  MAX_TAGS,
  PRICING_RULE_VERSION,
  TAG_SURCHARGE_BPS,
  type CircleConstitutionStatus,
  type CircleLifecycleStatus,
} from "./types";
import { AppError } from "../errors";
import { StateMachine } from "../state-machine/machine";
import type { MembershipStatus } from "./types";

export function circleStatusesForCount(count: number): {
  lifecycle: CircleLifecycleStatus;
  constitution: CircleConstitutionStatus;
} {
  if (count < 0) throw new AppError("VALIDATION_ERROR", "Negative seat count");
  if (count <= 14) {
    return { lifecycle: "formation", constitution: "formation_circle" };
  }
  if (count <= 19) {
    return { lifecycle: "active_growth", constitution: "formation_circle" };
  }
  if (count <= 39) {
    return {
      lifecycle: "active_growth",
      constitution: "provisionally_active_circle",
    };
  }
  return {
    lifecycle: "full_capacity",
    constitution: "fully_constituted_circle",
  };
}

/** Tag slot pricing: 1–2 included; 3 and 4 each +25% of base (not +50% for tag 4). */
export function tagSurchargeForSlot(
  slot: number,
  baseMinor = ASSOCIATE_PRICE_MINOR
): { isIncluded: boolean; surchargeBps: number; surchargeMinor: number } {
  if (slot < 1 || slot > MAX_TAGS) {
    throw new AppError("VALIDATION_ERROR", `Tag slot must be 1–${MAX_TAGS}`, {
      status: 400,
    });
  }
  if (slot <= INCLUDED_TAG_SLOTS) {
    return { isIncluded: true, surchargeBps: 0, surchargeMinor: 0 };
  }
  const surchargeMinor = Math.round((baseMinor * TAG_SURCHARGE_BPS) / 10_000);
  return {
    isIncluded: false,
    surchargeBps: TAG_SURCHARGE_BPS,
    surchargeMinor,
  };
}

export function calculateTagsTotalSurcharge(
  slots: number[],
  baseMinor = ASSOCIATE_PRICE_MINOR
): { totalSurchargeMinor: number; pricingRuleVersion: string } {
  const unique = Array.from(new Set(slots)).sort((a, b) => a - b);
  if (unique.length > MAX_TAGS) {
    throw new AppError("VALIDATION_ERROR", "Maximum 4 Tags", { status: 400 });
  }
  let total = 0;
  for (const slot of unique) {
    total += tagSurchargeForSlot(slot, baseMinor).surchargeMinor;
  }
  return { totalSurchargeMinor: total, pricingRuleVersion: PRICING_RULE_VERSION };
}

export const membershipMachine = new StateMachine<MembershipStatus>({
  name: "connect_membership",
  initial: "draft",
  terminal: ["archived"],
  transitions: [
    { from: "draft", to: "applied", name: "submit" },
    { from: "applied", to: "pending_payment", name: "require_payment" },
    { from: "pending_payment", to: "pending_verification", name: "payment_succeeded" },
    { from: "pending_payment", to: "terminated", name: "abandon" },
    { from: "pending_verification", to: "pending_approval", name: "verification_cleared" },
    { from: "pending_approval", to: "active", name: "activate" },
    { from: "active", to: "grace_period", name: "enter_grace" },
    { from: "grace_period", to: "active", name: "renew" },
    { from: "grace_period", to: "expired", name: "expire" },
    { from: "active", to: "frozen", name: "freeze" },
    { from: "frozen", to: "active", name: "unfreeze" },
    { from: "active", to: "restricted", name: "restrict" },
    { from: "restricted", to: "active", name: "lift_restriction" },
    { from: ["active", "grace_period", "frozen", "restricted"], to: "suspended", name: "suspend" },
    { from: "suspended", to: "active", name: "reinstate" },
    { from: ["active", "expired", "suspended"], to: "terminated", name: "terminate" },
    { from: ["terminated", "expired"], to: "rejoining_review", name: "rejoin" },
    { from: ["terminated", "expired", "rejoining_review"], to: "archived", name: "archive" },
  ],
});

/** Hard invariant helpers */
export function assertPaymentDoesNotActivate(status: MembershipStatus): void {
  if (status === "active") {
    throw new AppError(
      "INVALID_TRANSITION",
      "Payment success must not alone set membership active",
      { status: 409 }
    );
  }
}

export function isCircleCountingSeat(status: string, counts: boolean): boolean {
  return counts && (status === "allocated" || status === "protected_grace");
}
