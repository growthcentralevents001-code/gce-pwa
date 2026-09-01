import { describe, expect, it } from "vitest";
import {
  recordEngagementSchema,
  MARKETPLACE_ENGAGEMENT_TYPES,
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
});
