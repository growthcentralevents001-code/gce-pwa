import { describe, expect, it } from "vitest";
import {
  evaluateCancellationEligibility,
  MONEY_FLAGS_MUST_STAY_OFF,
  NON_PURCHASE_REASON_CODES,
  DEFAULT_TRUST_SCORE,
} from "@/lib/architecture/customer-cx";
import {
  EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
  OFFER_CLAIM_VALIDITY_HOURS,
  OFFER_CUSTOMER_CAP,
  claimExpiresAt,
} from "@/lib/architecture/marketplace/constants";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

describe("Phase 11 money flags", () => {
  it("keeps ticket payment / settlement / payout / auto-refund OFF in inactive set", () => {
    expect(INACTIVE_FEATURE_FLAGS).toContain("marketplace_ticket_payments");
    expect(INACTIVE_FEATURE_FLAGS).toContain("settlement_execution");
    expect(INACTIVE_FEATURE_FLAGS).toContain("payout_execution");
    expect(MONEY_FLAGS_MUST_STAY_OFF).toEqual(
      expect.arrayContaining([
        "marketplace_ticket_payments",
        "settlement_execution",
        "payout_execution",
        "refund_processing",
      ])
    );
  });
});

describe("Phase 11 cancellation (FD-039 48h default)", () => {
  const starts = new Date("2026-09-01T18:00:00+05:30");

  it("allows cancel more than 48h before start", () => {
    const now = new Date(starts.getTime() - 49 * 60 * 60 * 1000);
    const e = evaluateCancellationEligibility({
      eventStartsAt: starts.toISOString(),
      cancelCutoffHours: EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
      bookingStatus: "confirmed",
      now,
    });
    expect(e.eligible).toBe(true);
  });

  it("denies cancel after cutoff", () => {
    const now = new Date(starts.getTime() - 47 * 60 * 60 * 1000);
    const e = evaluateCancellationEligibility({
      eventStartsAt: starts.toISOString(),
      cancelCutoffHours: EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
      bookingStatus: "confirmed",
      now,
    });
    expect(e.eligible).toBe(false);
    expect(e.reason).toBe("after_cutoff");
  });

  it("supports event-specific cutoff hours", () => {
    const now = new Date(starts.getTime() - 25 * 60 * 60 * 1000);
    const e = evaluateCancellationEligibility({
      eventStartsAt: starts.toISOString(),
      cancelCutoffHours: 24,
      bookingStatus: "confirmed",
      now,
    });
    expect(e.eligible).toBe(true);
  });
});

describe("Phase 11 Offer constants (FD-037)", () => {
  it("keeps 72h claim validity and cap 100", () => {
    expect(OFFER_CLAIM_VALIDITY_HOURS).toBe(72);
    expect(OFFER_CUSTOMER_CAP).toBe(100);
    const exp = claimExpiresAt(new Date("2026-08-08T00:00:00Z"));
    expect(exp.toISOString()).toBe("2026-08-11T00:00:00.000Z");
  });
});

describe("Phase 11 Trust Rank foundation", () => {
  it("does not invent Starter/Elite levels as Founder law", () => {
    expect(DEFAULT_TRUST_SCORE).toBe(50);
    // Levels remain unresolved in product code
  });
});

describe("Phase 11 non-purchase reasons", () => {
  it("includes approved reason codes without inventing penalties", () => {
    expect(NON_PURCHASE_REASON_CODES).toContain("out_of_stock");
    expect(NON_PURCHASE_REASON_CODES).toContain("price_too_high");
    expect(NON_PURCHASE_REASON_CODES).toContain("quality_issue");
  });
});
