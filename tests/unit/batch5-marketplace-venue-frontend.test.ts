import { describe, expect, it } from "vitest";
import {
  ATTRIBUTED_SPLIT_COPY,
  UNATTRIBUTED_SPLIT_COPY,
  MARKETPLACE_BDP_ROLE_LABEL,
  MBDP_PERSON_MAX_UNITS,
  MBDP_STANDARD_MAX_VENUES,
  MBDP_VENUES_PER_UNIT,
  OFFER_CLAIM_VALIDITY_HOURS,
  OFFER_CUSTOMER_CAP,
  OFFER_MAX_CAMPAIGN_DAYS,
  OFFER_MIN_PLANNED_VALUE_MINOR,
  VENUE_MBDP_RELATIONSHIP_COPY,
  attributionStatusLabel,
  containsStaleMarketplaceTerm,
  mbdpPackageOptionLabel,
  plannedSaleValueNote,
  unitVenueCapacityLabel,
} from "@/lib/frontend/marketplace/format";
import {
  calculateMarketplaceSplit,
  MBDP_COMMISSION_BPS,
} from "@/lib/architecture/marketplace/constants";
import { workspaceNavSections, WORKSPACE_LEGACY_QUARANTINE } from "@/lib/frontend/navigation/workspace";

describe("Batch 5 Marketplace BDP + Venue presentation", () => {
  it("presents unit capacity 20 and person max 2 / 40", () => {
    expect(MBDP_VENUES_PER_UNIT).toBe(20);
    expect(MBDP_PERSON_MAX_UNITS).toBe(2);
    expect(MBDP_STANDARD_MAX_VENUES).toBe(40);
    expect(unitVenueCapacityLabel(5)).toBe("5 / 20");
    expect(unitVenueCapacityLabel(25)).toBe("20 / 20");
  });

  it("uses 10% attributed MBDP commission — not client inventing pending 10% when unattributed", () => {
    expect(MBDP_COMMISSION_BPS).toBe(1000);
    const attributed = calculateMarketplaceSplit(10_000_00, true);
    expect(attributed.mbdpShareMinor).toBeGreaterThan(0);
    const unattributed = calculateMarketplaceSplit(10_000_00, false);
    expect(unattributed.mbdpShareMinor).toBe(0);
    expect(UNATTRIBUTED_SPLIT_COPY.toLowerCase()).toMatch(/0%/);
    expect(UNATTRIBUTED_SPLIT_COPY.toLowerCase()).toMatch(/not pending/);
    expect(ATTRIBUTED_SPLIT_COPY).toMatch(/80%/);
    expect(ATTRIBUTED_SPLIT_COPY).toMatch(/10%/);
  });

  it("labels Marketplace BDP and rejects Affiliate/ZBP in role label", () => {
    expect(MARKETPLACE_BDP_ROLE_LABEL).toBe("Marketplace BDP");
    expect(MARKETPLACE_BDP_ROLE_LABEL).not.toMatch(/Affiliate|ZBP/i);
  });

  it("treats organic/unattributed as valid", () => {
    expect(attributionStatusLabel("unattributed").toLowerCase()).toMatch(/valid|organic/);
  });

  it("presents Offer campaign rules from canonical constants", () => {
    expect(OFFER_MIN_PLANNED_VALUE_MINOR).toBe(5_000_000);
    expect(OFFER_MAX_CAMPAIGN_DAYS).toBe(15);
    expect(OFFER_CUSTOMER_CAP).toBe(100);
    expect(OFFER_CLAIM_VALIDITY_HOURS).toBe(72);
    expect(plannedSaleValueNote().toLowerCase()).toMatch(/not a fee/);
    expect(plannedSaleValueNote().toLowerCase()).toMatch(/not a fee, deposit, or guaranteed revenue/);
  });

  it("uses Marketplace BDP as Venue relationship manager — no second generic RM", () => {
    expect(VENUE_MBDP_RELATIONSHIP_COPY).toMatch(/Marketplace BDP/);
    expect(VENUE_MBDP_RELATIONSHIP_COPY.toLowerCase()).toMatch(/no separate generic/);
    expect(containsStaleMarketplaceTerm("Dedicated Relationship Manager")).toBe(true);
    expect(containsStaleMarketplaceTerm("Venue RM")).toBe(true);
  });

  it("detects stale Marketplace terms", () => {
    expect(containsStaleMarketplaceTerm("Marketplace Affiliate")).toBe(true);
    expect(containsStaleMarketplaceTerm("₹30,000 minimum")).toBe(true);
    expect(containsStaleMarketplaceTerm("24h claim")).toBe(true);
    expect(containsStaleMarketplaceTerm("Marketplace BDP 10%")).toBe(false);
  });

  it("exposes MBDP and Venue nav without Affiliate/ZBP", () => {
    const mbdp = workspaceNavSections("marketplace-bdp")
      .flatMap((s) => s.items.map((i) => i.label))
      .join(" ");
    const venue = workspaceNavSections("venue")
      .flatMap((s) => s.items.map((i) => i.label))
      .join(" ");
    expect(mbdp).toMatch(/Venues|Attribution|Entitlements/);
    expect(venue).toMatch(/Events|Check-in|Offers/);
    expect(mbdp + venue).not.toMatch(/Affiliate|ZBP|franchisee/i);
    expect(WORKSPACE_LEGACY_QUARANTINE.some((q) => q.id === "zbp")).toBe(true);
  });

  it("package labels use current Direct/Finance values", () => {
    expect(mbdpPackageOptionLabel("direct_50000")).toContain("50,000");
    expect(mbdpPackageOptionLabel("finance_recovery_60000")).toContain("60,000");
  });

  it("avoids decorative blue tokens in presentation strings", () => {
    const blob = [
      MARKETPLACE_BDP_ROLE_LABEL,
      ATTRIBUTED_SPLIT_COPY,
      UNATTRIBUTED_SPLIT_COPY,
      plannedSaleValueNote(),
    ].join(" ");
    expect(blob).not.toMatch(/blue-|#2563EB|sky-/i);
  });
});
