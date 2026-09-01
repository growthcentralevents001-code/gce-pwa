import { describe, expect, it } from "vitest";
import { deriveClaimTimeline } from "@/lib/architecture/customer-cx/claim-timeline";

describe("offer claim timeline", () => {
  const now = Date.parse("2026-09-01T12:00:00Z");

  it("shows visited only when visit timestamp exists", () => {
    const steps = deriveClaimTimeline({
      status: "claimed",
      claimedAt: "2026-09-01T10:00:00Z",
      expiresAt: "2026-09-04T10:00:00Z",
      visitedAt: "2026-09-01T11:00:00Z",
      nowMs: now,
    });
    const visited = steps.find((s) => s.stage === "visited");
    expect(visited?.done).toBe(true);
    expect(visited?.current).toBe(true);
  });

  it("does not show visited without a visit record", () => {
    const steps = deriveClaimTimeline({
      status: "claimed",
      claimedAt: "2026-09-01T10:00:00Z",
      expiresAt: "2026-09-04T10:00:00Z",
      nowMs: now,
    });
    expect(steps.find((s) => s.stage === "visited")?.done).toBe(false);
  });

  it("ends at expired without visited or redeemed", () => {
    const steps = deriveClaimTimeline({
      status: "claimed",
      claimedAt: "2026-08-28T10:00:00Z",
      expiresAt: "2026-08-31T10:00:00Z",
      expired: true,
      nowMs: now,
    });
    expect(steps.some((s) => s.stage === "expired" && s.current)).toBe(true);
    expect(steps.some((s) => s.stage === "visited")).toBe(false);
  });

  it("shows redeemed after visit without merging visit into redemption", () => {
    const steps = deriveClaimTimeline({
      status: "redeemed",
      claimedAt: "2026-09-01T10:00:00Z",
      expiresAt: "2026-09-04T10:00:00Z",
      visitedAt: "2026-09-01T11:00:00Z",
      redeemedAt: "2026-09-01T11:30:00Z",
      nowMs: now,
    });
    expect(steps.find((s) => s.stage === "visited")?.done).toBe(true);
    expect(steps.find((s) => s.stage === "redeemed")?.done).toBe(true);
  });
});
