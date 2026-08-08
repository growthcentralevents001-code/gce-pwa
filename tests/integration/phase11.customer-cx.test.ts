import { describe, expect, it } from "vitest";
import {
  EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
  OFFER_CLAIM_VALIDITY_HOURS,
} from "@/lib/architecture/marketplace/constants";
import { MONEY_FLAGS_MUST_STAY_OFF } from "@/lib/architecture/customer-cx";

describe("Phase 11 Phase-7/9 reuse contract", () => {
  it("reuses Phase 7 cancel/claim constants", () => {
    expect(EVENT_DEFAULT_CANCEL_CUTOFF_HOURS).toBe(48);
    expect(OFFER_CLAIM_VALIDITY_HOURS).toBe(72);
  });

  it("documents money execution remains off", () => {
    expect(MONEY_FLAGS_MUST_STAY_OFF).toContain("marketplace_ticket_payments");
  });
});
