import { describe, expect, it } from "vitest";
import {
  VENUE_DOC_ALLOWED_MIME,
  VENUE_DOC_MAX_BYTES,
  buildVenueDocumentStoragePath,
  assertVenueDocumentMime,
} from "@/lib/architecture/marketplace/documents";

describe("venue onboarding documents", () => {
  it("builds canonical private storage paths", () => {
    const path = buildVenueDocumentStoragePath({
      venueId: "11111111-1111-4111-8111-111111111111",
      documentId: "22222222-2222-4222-8222-222222222222",
      fileName: "GST Certificate.pdf",
    });
    expect(path).toBe(
      "venues/11111111-1111-4111-8111-111111111111/onboarding/22222222-2222-4222-8222-222222222222/GST_Certificate.pdf"
    );
  });

  it("allows only governed mime types", () => {
    expect(() => assertVenueDocumentMime("application/pdf")).not.toThrow();
    expect(() => assertVenueDocumentMime("application/x-msdownload")).toThrow();
    expect(VENUE_DOC_ALLOWED_MIME.has("image/png")).toBe(true);
    expect(VENUE_DOC_MAX_BYTES).toBe(10 * 1024 * 1024);
  });
});
