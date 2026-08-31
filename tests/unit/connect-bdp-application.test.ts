import { describe, expect, it } from "vitest";
import {
  connectBdpApplicationFieldsSchema,
  CONNECT_BDP_APPLICATION_JOURNEY,
} from "@/lib/architecture/connect-bdp/application";
import { CONNECT_BDP_EARNINGS_DISCLAIMER } from "@/lib/frontend/partner/format";

const validApplication = {
  fullName: "Priya Sharma",
  mobile: "+919876543210",
  email: "priya@example.com",
  city: "Bengaluru",
  professionalBackground:
    "Ten years in B2B sales and community building for professional networks.",
  currentOccupation: "Independent business consultant",
  experience: "12 years across finance and SaaS partnerships",
  reasonForApplying:
    "I want to build structured Connect Circles in my city with platform support.",
  communityBuildingAbility:
    "Led three professional chapters with 200+ verified members each.",
  consentAccepted: true as const,
};

describe("Connect BDP application schema", () => {
  it("accepts a complete application payload", () => {
    const parsed = connectBdpApplicationFieldsSchema.parse(validApplication);
    expect(parsed.city).toBe("Bengaluru");
    expect(parsed.consentAccepted).toBe(true);
  });

  it("rejects missing consent", () => {
    const result = connectBdpApplicationFieldsSchema.safeParse({
      ...validApplication,
      consentAccepted: false,
    });
    expect(result.success).toBe(false);
  });

  it("defines canonical journey stages ending in active", () => {
    expect(CONNECT_BDP_APPLICATION_JOURNEY).toEqual([
      "submitted",
      "pending_verification",
      "pending_payment",
      "pending_approval",
      "active",
    ]);
  });
});

describe("Connect BDP earnings disclaimer", () => {
  it("states performance-based and not guaranteed", () => {
    expect(CONNECT_BDP_EARNINGS_DISCLAIMER.toLowerCase()).toMatch(
      /performance-based/
    );
    expect(CONNECT_BDP_EARNINGS_DISCLAIMER.toLowerCase()).toMatch(
      /not a salary|not guaranteed/
    );
  });
});
