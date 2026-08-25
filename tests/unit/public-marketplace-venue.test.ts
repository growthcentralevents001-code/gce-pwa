import { describe, expect, it, vi } from "vitest";
import {
  getPublicMarketplaceVenue,
  isPublicVenueId,
} from "@/lib/architecture/customer-cx";
import { AppError } from "@/lib/architecture/errors";

function mockVenueClient(result: { data: unknown; error: unknown }) {
  const chain = {
    from: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    maybeSingle: vi.fn(async () => result),
  };
  chain.from.mockReturnValue(chain);
  chain.select.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  return chain;
}

describe("public Marketplace venue identity", () => {
  it("accepts canonical UUID ids", () => {
    expect(isPublicVenueId("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });

  it("rejects non-UUID slugs and empty ids", () => {
    expect(isPublicVenueId("amritsar")).toBe(false);
    expect(isPublicVenueId("")).toBe(false);
    expect(isPublicVenueId("not-a-uuid")).toBe(false);
  });
});

describe("getPublicMarketplaceVenue", () => {
  const id = "550e8400-e29b-41d4-a716-446655440000";

  it("returns public fields for an active venue", async () => {
    const client = mockVenueClient({
      data: {
        id,
        display_name: "Town Hall",
        city: "Amritsar",
        state: "Punjab",
        address: "Mall Road",
        category: "Banquet",
        status: "active",
        payout_details_ref: "secret",
      },
      error: null,
    });
    const venue = await getPublicMarketplaceVenue(client as never, id);
    expect(venue).toEqual({
      id,
      displayName: "Town Hall",
      city: "Amritsar",
      state: "Punjab",
      address: "Mall Road",
      category: "Banquet",
    });
    expect(venue).not.toHaveProperty("payout_details_ref");
    expect(venue).not.toHaveProperty("status");
  });

  it("hides inactive venues as not found", async () => {
    const client = mockVenueClient({
      data: {
        id,
        display_name: "Hidden",
        city: "Amritsar",
        state: null,
        address: null,
        category: null,
        status: "inactive",
      },
      error: null,
    });
    await expect(
      getPublicMarketplaceVenue(client as never, id),
    ).rejects.toMatchObject({ code: "NOT_FOUND" } satisfies Partial<AppError>);
  });

  it("hides missing venues as not found", async () => {
    const client = mockVenueClient({ data: null, error: null });
    await expect(
      getPublicMarketplaceVenue(client as never, id),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("does not query for invalid ids", async () => {
    const client = mockVenueClient({ data: null, error: null });
    await expect(
      getPublicMarketplaceVenue(client as never, "legacy-slug"),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(client.from).not.toHaveBeenCalled();
  });
});
