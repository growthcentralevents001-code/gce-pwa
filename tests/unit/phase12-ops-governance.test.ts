import { describe, expect, it } from "vitest";
import {
  LIVE_PROVIDER_FLAGS_MUST_STAY_OFF,
  MAX_NOTIFICATION_ATTEMPTS,
  NON_OPTIONAL_CATEGORIES,
  minimiseAnalyticsPayload,
} from "@/lib/architecture/ops-governance";
import { redactSensitive } from "@/lib/architecture/logging";
import { INACTIVE_FEATURE_FLAGS, OPS_GOVERNANCE_FLAGS } from "@/lib/architecture/types";

describe("Phase 12 provider / money safety", () => {
  it("keeps live providers, marketing, retention enforcement OFF by convention", () => {
    expect(LIVE_PROVIDER_FLAGS_MUST_STAY_OFF).toEqual(
      expect.arrayContaining([
        "notifications_email_live",
        "notifications_sms_live",
        "notifications_push_live",
        "marketing_notifications",
        "retention_enforcement",
      ])
    );
    for (const k of LIVE_PROVIDER_FLAGS_MUST_STAY_OFF) {
      expect(OPS_GOVERNANCE_FLAGS).toContain(k);
    }
    expect(INACTIVE_FEATURE_FLAGS).toContain("settlement_execution");
    expect(INACTIVE_FEATURE_FLAGS).toContain("payout_execution");
  });

  it("bounds notification retries", () => {
    expect(MAX_NOTIFICATION_ATTEMPTS).toBe(5);
  });
});

describe("Phase 12 analytics minimisation", () => {
  it("strips PII-like keys from analytics payloads", () => {
    const out = minimiseAnalyticsPayload({
      booking_id: "b1",
      status: "confirmed",
      email: "a@b.com",
      phone: "999",
      aadhaar: "1234",
      nested: { token: "x", count: 2 },
    });
    expect(out.booking_id).toBe("b1");
    expect(out.status).toBe("confirmed");
    expect(out.email).toBeUndefined();
    expect(out.phone).toBeUndefined();
    expect(out.aadhaar).toBeUndefined();
    expect((out.nested as Record<string, unknown>).token).toBeUndefined();
    expect((out.nested as Record<string, unknown>).count).toBe(2);
  });
});

describe("Phase 12 consent categories", () => {
  it("treats security and transactional as non-optional vs marketing", () => {
    expect(NON_OPTIONAL_CATEGORIES).toContain("security");
    expect(NON_OPTIONAL_CATEGORIES).toContain("transactional");
    expect(NON_OPTIONAL_CATEGORIES).not.toContain("marketing");
  });
});

describe("Phase 12 observability redaction", () => {
  it("redacts extended sensitive keys", () => {
    const out = redactSensitive({
      email: "a@b.com",
      otp: "123456",
      bookingId: "b1",
    });
    expect(out?.email).toBe("[REDACTED]");
    expect(out?.otp).toBe("[REDACTED]");
    expect(out?.bookingId).toBe("b1");
  });
});
