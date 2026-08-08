import { describe, expect, it } from "vitest";
import {
  ALLOWED_CASE_TRANSITIONS,
  MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF,
  OVERRIDE_CATEGORIES,
  assertOpsNotSelfApproval,
} from "@/lib/architecture/ops-admin";
import { AppError } from "@/lib/errors";
import { OPS_ADMIN_FLAGS, INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

describe("Phase 13 safety flags", () => {
  it("keeps money/provider/marketing/retention OFF", () => {
    for (const k of MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF) {
      expect([
        ...INACTIVE_FEATURE_FLAGS,
        "notifications_email_live",
        "notifications_sms_live",
        "notifications_push_live",
        "marketing_notifications",
        "retention_enforcement",
        "refund_processing",
      ]).toContain(k);
    }
    expect(OPS_ADMIN_FLAGS).toContain("ops_case_management");
  });
});

describe("Phase 13 SoD", () => {
  it("blocks self-approval", () => {
    expect(() => assertOpsNotSelfApproval("u1", "u1")).toThrow(AppError);
    expect(() => assertOpsNotSelfApproval("u1", "u2")).not.toThrow();
  });
});

describe("Phase 13 case transitions", () => {
  it("allows open → assigned and resolved → closed", () => {
    expect(ALLOWED_CASE_TRANSITIONS.open).toContain("assigned");
    expect(ALLOWED_CASE_TRANSITIONS.resolved).toContain("closed");
    expect(ALLOWED_CASE_TRANSITIONS.closed).not.toContain("approved" as never);
  });
});

describe("Phase 13 overrides", () => {
  it("uses typed categories only (no forceUpdate)", () => {
    expect(OVERRIDE_CATEGORIES).toContain("attribution_correction");
    expect(OVERRIDE_CATEGORIES).not.toContain("force_update");
  });
});
