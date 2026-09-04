import { describe, expect, it, vi, beforeEach } from "vitest";
import { AppError } from "@/lib/errors";

vi.mock("@/lib/architecture/marketplace/reporting", () => ({
  buildVenueDashboard: vi.fn(),
}));

vi.mock("@/lib/architecture/organisations/memberships", () => ({
  listUserOrganisations: vi.fn(),
}));

vi.mock("@/lib/architecture/marketplace/units", () => ({
  listMbdpUnitsForUser: vi.fn(),
}));

vi.mock("@/lib/architecture/marketplace/permissions", () => ({
  actorHasMarketplacePermission: vi.fn(),
}));

import { assertVenueInsightsAccess } from "@/lib/architecture/marketplace/insights";
import { buildVenueDashboard } from "@/lib/architecture/marketplace/reporting";
import { listUserOrganisations } from "@/lib/architecture/organisations/memberships";
import { listMbdpUnitsForUser } from "@/lib/architecture/marketplace/units";
import { actorHasMarketplacePermission } from "@/lib/architecture/marketplace/permissions";

const VENUE_A = "11111111-1111-4111-8111-111111111111";
const VENUE_B = "22222222-2222-4222-8222-222222222222";
const USER_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ORG_A = "33333333-3333-4333-8333-333333333333";
const UNIT_A = "44444444-4444-4444-8444-444444444444";

const adminClient = {} as never;
const userClient = {} as never;

function venueReport(overrides: {
  venueId: string;
  organisationId: string;
  submittedBy?: string | null;
  attributedUnitId?: string | null;
}) {
  return {
    venueId: overrides.venueId,
    organisationId: overrides.organisationId,
    submittedBy: overrides.submittedBy ?? null,
    attributedUnitId: overrides.attributedUnitId ?? null,
    displayName: "Fixture Venue",
    status: "active",
    city: "Pune",
    attributedMbdpUserId: null,
    eventCount: 0,
    offerCount: 0,
    relationshipNote: "",
  };
}

describe("assertVenueInsightsAccess", () => {
  beforeEach(() => {
    vi.mocked(buildVenueDashboard).mockReset();
    vi.mocked(listUserOrganisations).mockReset();
    vi.mocked(listMbdpUnitsForUser).mockReset();
    vi.mocked(actorHasMarketplacePermission).mockReset();
    vi.mocked(actorHasMarketplacePermission).mockReturnValue(false);
  });

  it("allows organisation member for own Venue", async () => {
    vi.mocked(buildVenueDashboard).mockResolvedValue(
      venueReport({ venueId: VENUE_A, organisationId: ORG_A })
    );
    vi.mocked(listUserOrganisations).mockResolvedValue([
      { organisation_id: ORG_A },
    ] as never);
    vi.mocked(listMbdpUnitsForUser).mockResolvedValue([]);

    await expect(
      assertVenueInsightsAccess({
        userClient,
        adminClient,
        userId: USER_A,
        venueId: VENUE_A,
        assignments: [],
      })
    ).resolves.toBeUndefined();
  });

  it("denies organisation member requesting another Venue (IDOR)", async () => {
    vi.mocked(buildVenueDashboard).mockResolvedValue(
      venueReport({ venueId: VENUE_B, organisationId: "other-org" })
    );
    vi.mocked(listUserOrganisations).mockResolvedValue([
      { organisation_id: ORG_A },
    ] as never);
    vi.mocked(listMbdpUnitsForUser).mockResolvedValue([]);

    await expect(
      assertVenueInsightsAccess({
        userClient,
        adminClient,
        userId: USER_A,
        venueId: VENUE_B,
        assignments: [],
      })
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
  });

  it("allows platform ops with marketplace.venue.approve", async () => {
    vi.mocked(buildVenueDashboard).mockResolvedValue(
      venueReport({ venueId: VENUE_B, organisationId: "other-org" })
    );
    vi.mocked(actorHasMarketplacePermission).mockReturnValue(true);

    await expect(
      assertVenueInsightsAccess({
        userClient,
        adminClient,
        userId: USER_A,
        venueId: VENUE_B,
        assignments: [{ roleKey: "platform_admin", status: "active" } as never],
      })
    ).resolves.toBeUndefined();
  });

  it("allows attributed MBDP unit owner", async () => {
    vi.mocked(buildVenueDashboard).mockResolvedValue(
      venueReport({
        venueId: VENUE_B,
        organisationId: "other-org",
        attributedUnitId: UNIT_A,
      })
    );
    vi.mocked(listUserOrganisations).mockResolvedValue([]);
    vi.mocked(listMbdpUnitsForUser).mockResolvedValue([{ id: UNIT_A }] as never);

    await expect(
      assertVenueInsightsAccess({
        userClient,
        adminClient,
        userId: USER_A,
        venueId: VENUE_B,
        assignments: [],
      })
    ).resolves.toBeUndefined();
  });

  it("returns NOT_FOUND when Venue does not exist", async () => {
    vi.mocked(buildVenueDashboard).mockResolvedValue(null);

    await expect(
      assertVenueInsightsAccess({
        userClient,
        adminClient,
        userId: USER_A,
        venueId: VENUE_B,
        assignments: [],
      })
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("forbidden errors do not carry insight payload fields", async () => {
    vi.mocked(buildVenueDashboard).mockResolvedValue(
      venueReport({ venueId: VENUE_B, organisationId: "other-org" })
    );
    vi.mocked(listUserOrganisations).mockResolvedValue([]);
    vi.mocked(listMbdpUnitsForUser).mockResolvedValue([]);

    try {
      await assertVenueInsightsAccess({
        userClient,
        adminClient,
        userId: USER_A,
        venueId: VENUE_B,
        assignments: [],
      });
      expect.fail("expected forbidden");
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      const blob = JSON.stringify(err);
      expect(blob).not.toMatch(/uniqueInPeriod|uniqueAllTime|listingPerformance/i);
    }
  });
});
