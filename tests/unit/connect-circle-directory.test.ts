import { describe, expect, it } from "vitest";
import {
  countMembersByPowerSector,
  circleRemainingSeatsLabel,
  formatPowerSectorLabel,
  normalizePowerSectorKey,
  type CircleDirectoryCard,
} from "@/lib/frontend/connect/format";
import { parseCircleMeetingFromMetadata } from "@/lib/frontend/connect/reads";

describe("Connect Circle directory helpers", () => {
  it("maps legacy sector keys to canonical GC Power Sector ids", () => {
    expect(normalizePowerSectorKey("sector_a")).toBe("real_estate");
    expect(normalizePowerSectorKey("sector_d")).toBe("consumer");
    expect(formatPowerSectorLabel("sector_b")).toBe("Industrial & Logistics");
  });

  it("counts members per sector from directory cards", () => {
    const members: CircleDirectoryCard[] = [
      {
        id: "1",
        name: "A",
        specialisation: "General",
        sectorLabel: "Real Estate & Construction",
        tagLabels: [],
        status: "active",
      },
      {
        id: "2",
        name: "B",
        specialisation: "Tech",
        sectorLabel: "Industrial & Logistics",
        tagLabels: [],
        status: "active",
      },
      {
        id: "3",
        name: "C",
        specialisation: "Legal",
        sectorLabel: "Industrial & Logistics",
        tagLabels: [],
        status: "active",
      },
    ];
    const counts = countMembersByPowerSector(members);
    expect(counts.real_estate).toBe(1);
    expect(counts.industrial).toBe(2);
    expect(counts.professional).toBe(0);
  });

  it("describes remaining seats without implying full capacity", () => {
    expect(circleRemainingSeatsLabel(12, 40)).toBe("28 seats remaining");
    expect(circleRemainingSeatsLabel(39, 40)).toBe("1 seat remaining");
    expect(circleRemainingSeatsLabel(40, 40)).toBe(
      "Circle full — no seats remaining"
    );
  });

  it("parses optional meeting metadata without inventing dates", () => {
    expect(parseCircleMeetingFromMetadata(null)).toEqual({
      nextMeetingAt: null,
      nextMeetingLocation: null,
    });
    expect(
      parseCircleMeetingFromMetadata({
        nextMeetingAt: "2026-09-15T10:00:00.000Z",
        nextMeetingLocation: "Hyderabad",
      })
    ).toEqual({
      nextMeetingAt: "2026-09-15T10:00:00.000Z",
      nextMeetingLocation: "Hyderabad",
    });
  });
});
