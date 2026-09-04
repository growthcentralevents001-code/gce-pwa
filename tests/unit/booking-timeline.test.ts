import { describe, expect, it } from "vitest";
import { deriveBookingTimeline } from "@/lib/architecture/customer-cx/booking-timeline";

describe("booking timeline", () => {
  it("shows checked in only when ticket evidence exists", () => {
    const steps = deriveBookingTimeline({
      bookingStatus: "confirmed",
      bookedAt: "2026-09-01T10:00:00Z",
      confirmedAt: "2026-09-01T10:05:00Z",
      ticketIssuedAt: "2026-09-01T10:06:00Z",
      checkedInAt: "2026-09-01T12:00:00Z",
    });
    const checkedIn = steps.find((s) => s.stage === "checked_in");
    expect(checkedIn?.done).toBe(true);
    expect(checkedIn?.current).toBe(true);
  });

  it("does not show checked in without ticket check-in timestamp", () => {
    const steps = deriveBookingTimeline({
      bookingStatus: "confirmed",
      bookedAt: "2026-09-01T10:00:00Z",
      ticketIssuedAt: "2026-09-01T10:06:00Z",
    });
    expect(steps.find((s) => s.stage === "checked_in")?.done).toBe(false);
  });

  it("ends at refund pending without inventing check-in", () => {
    const steps = deriveBookingTimeline({
      bookingStatus: "refund_pending",
      bookedAt: "2026-09-01T10:00:00Z",
      confirmedAt: "2026-09-01T10:05:00Z",
      cancelledAt: "2026-09-01T11:00:00Z",
    });
    expect(steps.some((s) => s.stage === "refund_pending" && s.current)).toBe(
      true
    );
    expect(steps.some((s) => s.stage === "checked_in")).toBe(false);
  });

  it("ends at cancelled without check-in", () => {
    const steps = deriveBookingTimeline({
      bookingStatus: "cancelled",
      bookedAt: "2026-09-01T10:00:00Z",
      cancelledAt: "2026-09-01T11:00:00Z",
    });
    expect(steps.some((s) => s.stage === "cancelled" && s.current)).toBe(true);
    expect(steps.some((s) => s.stage === "checked_in")).toBe(false);
  });
});
