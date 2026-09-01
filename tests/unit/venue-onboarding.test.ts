import { describe, expect, it } from "vitest";
import {
  buildOnboardingProgress,
  isVenueOperational,
  mergeVenueOnboardingMetadata,
  parseVenueOnboarding,
} from "@/lib/architecture/marketplace/onboarding";

describe("venue onboarding metadata", () => {
  it("parses nested onboarding metadata", () => {
    const meta = mergeVenueOnboardingMetadata({}, {
      business: { ownerContactName: "Asha Rao" },
      eligibility: {
        result: "eligible",
        verifiedByUserId: "u1",
        verifiedAt: "2026-01-01T00:00:00.000Z",
      },
    });
    const onboarding = parseVenueOnboarding(meta);
    expect(onboarding.business?.ownerContactName).toBe("Asha Rao");
    expect(onboarding.eligibility?.result).toBe("eligible");
  });

  it("builds progress with recommendation and platform review", () => {
    const steps = buildOnboardingProgress({
      status: "pending_platform_approval",
      onboarding: {
        business: { ownerContactName: "Contact" },
        eligibility: {
          result: "eligible",
          verifiedByUserId: "u1",
          verifiedAt: "2026-01-01T00:00:00.000Z",
        },
        documents: [
          {
            id: "d1",
            label: "GST",
            referenceNote: "case-123",
            submittedAt: "2026-01-01T00:00:00.000Z",
            submittedByUserId: "u1",
            reviewStatus: "pending",
          },
        ],
      },
      hasRecommendation: true,
    });
    expect(steps.find((s) => s.id === "recommendation")?.state).toBe("complete");
    expect(steps.find((s) => s.id === "platform")?.state).toBe("current");
  });

  it("treats only active/temporarily_inactive venues as operational", () => {
    expect(isVenueOperational("active")).toBe(true);
    expect(isVenueOperational("temporarily_inactive")).toBe(true);
    expect(isVenueOperational("submitted")).toBe(false);
    expect(isVenueOperational("pending_platform_approval")).toBe(false);
  });
});
