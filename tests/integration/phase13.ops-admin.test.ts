import { describe, expect, it } from "vitest";
import {
  MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF,
  PHASE13_RULE_VERSION,
} from "@/lib/architecture/ops-admin";

describe("Phase 13 Phase 4–12 reuse contract", () => {
  it("documents finance immutability / provider gate posture", () => {
    expect(PHASE13_RULE_VERSION).toContain("phase13");
    expect(MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF).toEqual(
      expect.arrayContaining([
        "settlement_execution",
        "payout_execution",
        "retention_enforcement",
        "notifications_email_live",
      ])
    );
  });
});
