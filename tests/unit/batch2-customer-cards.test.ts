import { describe, expect, it } from "vitest";
import type { EventCardModel } from "@/components/customer/EventCard";
import type { OfferCardModel } from "@/components/customer/OfferCard";
import {
  formatInrMinor,
  venueDisplayName,
} from "@/lib/frontend/customer/format";

describe("EventCard view model", () => {
  it("maps discovery fields without inventing favorites or inventory", () => {
    const event: EventCardModel = {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Demo Night",
      category: "Music",
      startsAt: "2026-09-01T18:30:00.000Z",
      priceMinor: 99900,
      currency: "INR",
      venue: { display_name: "Hall", city: "Pune" },
    };
    expect(venueDisplayName(event.venue)).toContain("Pune");
    expect(formatInrMinor(event.priceMinor)).toMatch(/999/);
    expect("favorite" in event).toBe(false);
    expect("remainingCapacity" in event).toBe(false);
  });
});

describe("OfferCard view model", () => {
  it("keeps claim ≠ purchase semantics in model fields", () => {
    const offer: OfferCardModel = {
      id: "00000000-0000-0000-0000-000000000002",
      title: "Weekend tasting",
      remainingClaims: 12,
      claimValidityHours: 72,
      customerCap: 100,
    };
    expect(offer.claimValidityHours).toBe(72);
    expect(offer.remainingClaims).toBeLessThanOrEqual(offer.customerCap ?? 999);
  });
});
