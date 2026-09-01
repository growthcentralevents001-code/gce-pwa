import { describe, expect, it } from "vitest";
import { matchesLeadFilter } from "@/components/connect/LeadListFilters";

describe("lead list filters", () => {
  it("filters active referrals", () => {
    expect(matchesLeadFilter("offered", "active")).toBe(true);
    expect(matchesLeadFilter("declined", "active")).toBe(false);
  });

  it("filters confirmed referrals", () => {
    expect(matchesLeadFilter("closed_dual_confirmed", "confirmed")).toBe(true);
    expect(matchesLeadFilter("outcome_pending", "confirmed")).toBe(false);
  });

  it("filters declined referrals", () => {
    expect(matchesLeadFilter("declined", "declined")).toBe(true);
    expect(matchesLeadFilter("offered", "declined")).toBe(false);
  });
});
