import { describe, expect, it } from "vitest";
import {
  circleCapacityLabel,
  displayStatusesForCount,
  isPaidLeadAssistExposed,
  membershipStatusTone,
  tagSlotCommercialNote,
  waitlistCopy,
  CIRCLE_CAPACITY_MAX,
  MAX_TAGS,
} from "@/lib/frontend/connect/format";
import { tagSurchargeForSlot } from "@/lib/architecture/connect/rules";
import { ASSOCIATE_PRICE_MINOR } from "@/lib/architecture/connect/types";
import { GC_POWER_SECTORS } from "@/lib/frontend/design-language";

describe("Batch 3 Connect presentation", () => {
  it("maps dual Circle statuses without merging", () => {
    expect(displayStatusesForCount(10)).toEqual({
      lifecycle: "formation",
      constitution: "formation_circle",
    });
    expect(displayStatusesForCount(15)).toEqual({
      lifecycle: "active_growth",
      constitution: "formation_circle",
    });
    expect(displayStatusesForCount(25)).toEqual({
      lifecycle: "active_growth",
      constitution: "provisionally_active_circle",
    });
    expect(displayStatusesForCount(40)).toEqual({
      lifecycle: "full_capacity",
      constitution: "fully_constituted_circle",
    });
  });

  it("caps capacity display at 40", () => {
    expect(CIRCLE_CAPACITY_MAX).toBe(40);
    expect(circleCapacityLabel(12, 40)).toBe("12 / 40");
    expect(circleCapacityLabel(40, 40)).toBe("40 / 40");
    expect(circleCapacityLabel(41, 40)).toBe("40 / 40");
  });

  it("presents Tag pricing as +25% for slots 3 and 4 (not +50%)", () => {
    expect(MAX_TAGS).toBe(4);
    expect(tagSurchargeForSlot(1).isIncluded).toBe(true);
    expect(tagSurchargeForSlot(3).surchargeBps).toBe(2500);
    expect(tagSurchargeForSlot(4).surchargeBps).toBe(2500);
    expect(tagSurchargeForSlot(3).surchargeMinor).toBe(
      Math.round((ASSOCIATE_PRICE_MINOR * 2500) / 10_000)
    );
    expect(tagSlotCommercialNote(4)).toContain("25%");
    expect(tagSlotCommercialNote(4)).not.toContain("50%");
  });

  it("does not invent waitlist queue positions", () => {
    const copy = waitlistCopy("waitlisted");
    expect(copy.description.toLowerCase()).not.toMatch(/#\d/);
    expect(copy.description).toMatch(/not shown/i);
  });

  it("keeps paid Lead Assist gated when flags are off", () => {
    expect(
      isPaidLeadAssistExposed({
        paid_lead_assist: false,
        lead_escrow: false,
      })
    ).toBe(false);
    expect(
      isPaidLeadAssistExposed({
        paid_lead_assist: true,
        lead_escrow: false,
      })
    ).toBe(true);
  });

  it("exposes four fixed GC Power Sectors", () => {
    expect(GC_POWER_SECTORS).toHaveLength(4);
    expect(GC_POWER_SECTORS.map((s) => s.id)).toEqual([
      "real_estate",
      "industrial",
      "professional",
      "consumer",
    ]);
  });

  it("maps membership statuses without inventing activation from payment", () => {
    expect(membershipStatusTone("pending_payment")).toBe("pending");
    expect(membershipStatusTone("active")).toBe("success");
  });
});

describe("Batch 3 design language — no decorative blue", () => {
  it("warm hero recipe does not include sky/blue tokens", async () => {
    const { GCE_SURFACE } = await import("@/lib/frontend/design-language");
    expect(GCE_SURFACE.warmHero).not.toMatch(/sky|blue/i);
    expect(GCE_SURFACE.glassLight).not.toMatch(/blue/i);
  });
});
