import { describe, expect, it } from "vitest";
import { connectMembershipApplicationSchema } from "@/lib/architecture/connect/application";
import { membershipStatusLabel } from "@/lib/frontend/connect/format";

const validApplication = {
  memberName: "Priya Sharma",
  businessName: "Sharma Consulting",
  businessDescription:
    "Management consulting for SME growth and operational efficiency across Karnataka.",
  phone: "+919876543210",
  email: "priya@example.com",
  businessAddress: "Indiranagar, Bengaluru",
  websiteOrSocial: "https://example.com",
  consentAccepted: true as const,
};

describe("Connect membership application schema", () => {
  it("accepts a complete application payload", () => {
    const parsed = connectMembershipApplicationSchema.parse(validApplication);
    expect(parsed.businessName).toBe("Sharma Consulting");
    expect(parsed.consentAccepted).toBe(true);
  });

  it("rejects missing consent", () => {
    const result = connectMembershipApplicationSchema.safeParse({
      ...validApplication,
      consentAccepted: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("Connect membership status labels", () => {
  it("labels applied state for review queue", () => {
    expect(membershipStatusLabel("applied")).toMatch(/applied/i);
    expect(membershipStatusLabel("draft")).toBe("Draft");
  });
});
