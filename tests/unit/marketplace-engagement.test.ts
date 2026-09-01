import { describe, expect, it } from "vitest";
import {
  recordEngagementSchema,
  MARKETPLACE_ENGAGEMENT_TYPES,
  classifyOfferClaimCounts,
} from "@/lib/architecture/marketplace/engagement";

describe("marketplace engagement", () => {
  it("accepts governed engagement types", () => {
    for (const t of MARKETPLACE_ENGAGEMENT_TYPES) {
      const ok = recordEngagementSchema.safeParse({
        engagementType: t,
        subjectId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(ok.success).toBe(true);
    }
  });

  it("rejects unknown engagement type", () => {
    const res = recordEngagementSchema.safeParse({
      engagementType: "page_view",
      subjectId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(res.success).toBe(false);
  });

  it("classifies offer claim buckets from persisted status", () => {
    const now = Date.parse("2026-09-01T12:00:00Z");
    const counts = classifyOfferClaimCounts(
      [
        { status: "claimed", expires_at: "2026-09-02T12:00:00Z" },
        { status: "claimed", expires_at: "2026-08-31T12:00:00Z" },
        { status: "expired", expires_at: "2026-08-30T12:00:00Z" },
        { status: "redeemed", expires_at: "2026-09-01T10:00:00Z" },
      ],
      now
    );
    expect(counts).toEqual({
      total: 4,
      active: 1,
      expired: 2,
      redeemed: 1,
    });
  });
});
