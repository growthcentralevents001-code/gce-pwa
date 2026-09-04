import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/architecture/audit/write", () => ({
  writeAuditEvent: vi.fn().mockResolvedValue(undefined),
}));

import {
  calculateMarketplaceSplit,
  MARKETPLACE_RULE_VERSION,
} from "@/lib/architecture/marketplace/constants";
import {
  isEligibleMarketplaceBookingStatus,
  marketplaceBookingEarningEventKey,
  resolveMarketplaceAttribution,
} from "@/lib/architecture/marketplace/allocation";
import { calculateMarketplaceSplit as financeMarketplaceSplit } from "@/lib/architecture/finance/constants";

describe("marketplace revenue allocation", () => {
  it("defines eligible booking statuses excluding draft and claims", () => {
    expect(isEligibleMarketplaceBookingStatus("paid")).toBe(true);
    expect(isEligibleMarketplaceBookingStatus("confirmed")).toBe(true);
    expect(isEligibleMarketplaceBookingStatus("pending_payment")).toBe(false);
    expect(isEligibleMarketplaceBookingStatus("cancelled")).toBe(false);
    expect(isEligibleMarketplaceBookingStatus("refunded")).toBe(false);
  });

  it("uses stable idempotent earning event keys per booking", () => {
    const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    expect(marketplaceBookingEarningEventKey(id)).toBe(`mkt:booking:${id}`);
  });

  describe("split precision (canonical source)", () => {
    it("balances attributed 80/10/10 exactly", () => {
      const gross = 100_000_00;
      const s = calculateMarketplaceSplit(gross, true);
      expect(s.venueShareMinor + s.mbdpShareMinor + s.gceShareMinor).toBe(gross);
      expect(s.venueShareMinor).toBe(80_000_00);
      expect(s.mbdpShareMinor).toBe(10_000_00);
      expect(s.gceShareMinor).toBe(10_000_00);
    });

    it("balances unattributed 80/0/20 with zero MBDP", () => {
      const gross = 100_000_00;
      const s = calculateMarketplaceSplit(gross, false);
      expect(s.venueShareMinor + s.mbdpShareMinor + s.gceShareMinor).toBe(gross);
      expect(s.mbdpShareMinor).toBe(0);
      expect(s.gceShareMinor).toBe(20_000_00);
      expect(s.entitledMbdp).toBe(false);
    });

    it("balances odd minor-unit amounts deterministically", () => {
      for (const gross of [1, 7, 99, 1001, 33333]) {
        for (const attributed of [true, false]) {
          const s = calculateMarketplaceSplit(gross, attributed);
          expect(s.venueShareMinor + s.mbdpShareMinor + s.gceShareMinor).toBe(
            gross
          );
        }
      }
    });

    it("keeps finance wrapper aligned with marketplace canonical split", () => {
      const gross = 12_345_67;
      const core = calculateMarketplaceSplit(gross, true);
      const finance = financeMarketplaceSplit({
        eligibleEventRevenueMinor: gross,
        hasValidMbdpAttribution: true,
      });
      expect(finance).toMatchObject({
        venueShareMinor: core.venueShareMinor,
        mbdpShareMinor: core.mbdpShareMinor,
        gceShareMinor: core.gceShareMinor,
        entitledMbdp: core.entitledMbdp,
        ruleVersion: MARKETPLACE_RULE_VERSION,
      });
    });
  });

  describe("resolveMarketplaceAttribution", () => {
    const venueId = "11111111-1111-4111-8111-111111111111";
    const attrId = "22222222-2222-4222-8222-222222222222";

    function mockClient(row: Record<string, unknown> | null) {
      return {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: row, error: null }),
            }),
          }),
        }),
      } as never;
    }

    it("returns unattributed when no snapshot exists", async () => {
      const result = await resolveMarketplaceAttribution(mockClient(null), {
        venueId,
        snapshotAttributionId: null,
      });
      expect(result.hasValidAttribution).toBe(false);
      expect(result.unitId).toBeNull();
    });

    it("returns attributed only for active snapshot on same venue", async () => {
      const result = await resolveMarketplaceAttribution(
        mockClient({
          id: attrId,
          venue_id: venueId,
          unit_id: "33333333-3333-4333-8333-333333333333",
          bdp_user_id: "44444444-4444-4444-8444-444444444444",
          status: "active",
          provenance: "sourced",
          basis: "fixture",
        }),
        { venueId, snapshotAttributionId: attrId }
      );
      expect(result.hasValidAttribution).toBe(true);
      expect(result.unitId).toBeTruthy();
    });

    it("does not attribute inactive snapshots (no pending MBDP)", async () => {
      const result = await resolveMarketplaceAttribution(
        mockClient({
          id: attrId,
          venue_id: venueId,
          status: "reassigned_closed",
        }),
        { venueId, snapshotAttributionId: attrId }
      );
      expect(result.hasValidAttribution).toBe(false);
    });
  });

  describe("cancellation vs reversal semantics", () => {
    it("holds allocation on refund pending instead of reversing", async () => {
      const bookingId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
      const existing = {
        id: "ent-1",
        state: "earned",
        metadata: {},
        earning_event_key: `mkt:booking:${bookingId}`,
      };
      const updated = { ...existing, state: "on_hold" };

      const updateChain = {
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: updated, error: null }),
          }),
        }),
      };
      const client = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi
                .fn()
                .mockResolvedValue({ data: existing, error: null }),
            }),
          }),
          update: vi.fn().mockReturnValue(updateChain),
        }),
      } as never;

      const { holdMarketplaceBookingAllocationForRefundPending } = await import(
        "@/lib/architecture/marketplace/allocation"
      );

      const result = await holdMarketplaceBookingAllocationForRefundPending(
        client,
        {
          bookingId,
          actorUserId: "user-1",
          reason: "customer cancel within cutoff",
        }
      );

      expect(result?.state).toBe("on_hold");
      expect(result?.state).not.toBe("reversed");
    });
  });
});
