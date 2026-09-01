import { describe, expect, it } from "vitest";
import { publicContactSchema } from "@/lib/architecture/customer-cx/contact";
import {
  parseVenueRelationship,
  venueRelationshipUpdateSchema,
  VENUE_RELATIONSHIP_STATUSES,
} from "@/lib/architecture/marketplace/relationship";

describe("public contact schema", () => {
  it("requires name, email, and message with length bounds", () => {
    const ok = publicContactSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello GCE team — I have a question about Connect.",
    });
    expect(ok.success).toBe(true);

    const short = publicContactSchema.safeParse({
      name: "A",
      email: "not-an-email",
      message: "short",
    });
    expect(short.success).toBe(false);
  });

  it("rejects oversized message", () => {
    const res = publicContactSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      message: "x".repeat(4001),
    });
    expect(res.success).toBe(false);
  });
});

describe("venue relationship metadata", () => {
  it("parses relationship from attribution metadata", () => {
    const rel = parseVenueRelationship({
      relationship: {
        relationshipStatus: "engaged",
        lastInteractionAt: "2026-09-01T10:00:00.000Z",
        supportRequired: true,
      },
    });
    expect(rel.relationshipStatus).toBe("engaged");
    expect(rel.supportRequired).toBe(true);
  });

  it("returns empty object when metadata missing", () => {
    expect(parseVenueRelationship(null)).toEqual({});
    expect(parseVenueRelationship({})).toEqual({});
  });

  it("validates relationship update payload", () => {
    const ok = venueRelationshipUpdateSchema.safeParse({
      attributionId: "550e8400-e29b-41d4-a716-446655440000",
      relationshipStatus: VENUE_RELATIONSHIP_STATUSES[0],
      supportRequired: false,
    });
    expect(ok.success).toBe(true);
  });
});
