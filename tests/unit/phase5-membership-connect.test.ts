import { describe, expect, it } from "vitest";
import {
  calculateTagsTotalSurcharge,
  circleStatusesForCount,
  membershipMachine,
  tagSurchargeForSlot,
} from "@/lib/architecture/connect/rules";
import {
  ASSOCIATE_PRICE_MINOR,
  CIRCLE_CAPACITY_MAX,
} from "@/lib/architecture/connect/types";
import { rankCirclesByGeography } from "@/lib/architecture/connect/circles";
import { AppError } from "@/lib/architecture/errors";

describe("Phase 5 Tag pricing (FD-027)", () => {
  it("includes Tag 1 and Tag 2", () => {
    expect(tagSurchargeForSlot(1).isIncluded).toBe(true);
    expect(tagSurchargeForSlot(1).surchargeMinor).toBe(0);
    expect(tagSurchargeForSlot(2).surchargeMinor).toBe(0);
  });

  it("charges +25% for Tag 3 and Tag 4 each (not +50% for Tag 4)", () => {
    const t3 = tagSurchargeForSlot(3);
    const t4 = tagSurchargeForSlot(4);
    expect(t3.surchargeMinor).toBe(150_000);
    expect(t4.surchargeMinor).toBe(150_000);
    expect(t3.surchargeBps).toBe(2500);
    expect(t4.surchargeBps).toBe(2500);
  });

  it("rejects 5th tag slot", () => {
    expect(() => tagSurchargeForSlot(5)).toThrow(AppError);
  });

  it("totals associate + tags to ₹9,000 before tax", () => {
    const { totalSurchargeMinor } = calculateTagsTotalSurcharge([1, 2, 3, 4]);
    expect(ASSOCIATE_PRICE_MINOR + totalSurchargeMinor).toBe(900_000);
  });
});

describe("Phase 5 Circle dual status mapping (FD-032)", () => {
  it("maps 0–14 / 15–19 / 20–39 / 40 correctly", () => {
    expect(circleStatusesForCount(0)).toEqual({
      lifecycle: "formation",
      constitution: "formation_circle",
    });
    expect(circleStatusesForCount(14)).toEqual({
      lifecycle: "formation",
      constitution: "formation_circle",
    });
    expect(circleStatusesForCount(15)).toEqual({
      lifecycle: "active_growth",
      constitution: "formation_circle",
    });
    expect(circleStatusesForCount(19)).toEqual({
      lifecycle: "active_growth",
      constitution: "formation_circle",
    });
    expect(circleStatusesForCount(20)).toEqual({
      lifecycle: "active_growth",
      constitution: "provisionally_active_circle",
    });
    expect(circleStatusesForCount(39)).toEqual({
      lifecycle: "active_growth",
      constitution: "provisionally_active_circle",
    });
    expect(circleStatusesForCount(40)).toEqual({
      lifecycle: "full_capacity",
      constitution: "fully_constituted_circle",
    });
  });

  it("enforces max capacity constant 40", () => {
    expect(CIRCLE_CAPACITY_MAX).toBe(40);
  });
});

describe("Phase 5 membership lifecycle invariants", () => {
  it("payment_succeeded lands in pending_verification not active", async () => {
    const next = await membershipMachine.transition(
      "pending_payment",
      "payment_succeeded"
    );
    expect(next).toBe("pending_verification");
    expect(next).not.toBe("active");
  });

  it("activate requires pending_approval path", async () => {
    await expect(
      membershipMachine.transition("pending_payment", "activate")
    ).rejects.toBeInstanceOf(AppError);
    const cleared = await membershipMachine.transition(
      "pending_verification",
      "verification_cleared"
    );
    expect(cleared).toBe("pending_approval");
    const active = await membershipMachine.transition(cleared, "activate");
    expect(active).toBe("active");
  });
});

describe("Phase 5 geography ranking", () => {
  it("prefers city match over state-only", () => {
    const ranked = rankCirclesByGeography(
      [
        {
          id: "a",
          city: "Pune",
          state: "MH",
          district: null,
          locality: null,
          activeSeatCount: 5,
        },
        {
          id: "b",
          city: "Mumbai",
          state: "MH",
          district: null,
          locality: null,
          activeSeatCount: 5,
        },
      ],
      { city: "Pune", state: "MH" }
    );
    expect(ranked[0]?.id).toBe("a");
    expect(ranked[0]!.score).toBeGreaterThan(ranked[1]!.score);
  });
});
