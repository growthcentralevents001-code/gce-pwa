import { describe, expect, it } from "vitest";
import {
  bookingStatusTone,
  claimStatusTone,
  extractApiError,
  formatInrMinor,
  formatTimeRemaining,
  ticketStatusTone,
} from "@/lib/frontend/customer/format";
import { sanitizeAuthRedirect } from "@/lib/frontend/auth/redirect";
import { evaluateCancellationEligibility } from "@/lib/architecture/customer-cx";

describe("customer format helpers", () => {
  it("formats INR minor units", () => {
    expect(formatInrMinor(49900)).toMatch(/499/);
    expect(formatInrMinor(null)).toBe("—");
  });

  it("maps booking/ticket/claim statuses without inventing economics", () => {
    expect(bookingStatusTone("confirmed")).toBe("success");
    expect(bookingStatusTone("refund_pending")).toBe("warning");
    expect(ticketStatusTone("issued")).toBe("success");
    expect(claimStatusTone("claimed")).toBe("warning");
    expect(claimStatusTone("claimed", true)).toBe("inactive");
  });

  it("formats countdown from server expiry only", () => {
    const future = new Date(Date.now() + 2 * 3_600_000).toISOString();
    const past = new Date(Date.now() - 60_000).toISOString();
    expect(formatTimeRemaining(future).expired).toBe(false);
    expect(formatTimeRemaining(past).expired).toBe(true);
    expect(formatTimeRemaining(past).label).toBe("Expired");
  });

  it("extracts API errors without inventing refund percentages", () => {
    expect(
      extractApiError({ error: { message: "capacity exhausted" } }, "fallback")
    ).toBe("capacity exhausted");
    expect(extractApiError({}, "fallback")).toBe("fallback");
  });
});

describe("cancellation eligibility presentation", () => {
  it("uses backend evaluator result — frontend must not hardcode sole truth", () => {
    const starts = new Date(Date.now() + 72 * 3_600_000).toISOString();
    const ok = evaluateCancellationEligibility({
      eventStartsAt: starts,
      cancelCutoffHours: 48,
      bookingStatus: "confirmed",
    });
    expect(ok.eligible).toBe(true);
    expect(ok.reason).toBe("within_cutoff");

    const late = evaluateCancellationEligibility({
      eventStartsAt: new Date(Date.now() + 2 * 3_600_000).toISOString(),
      cancelCutoffHours: 48,
      bookingStatus: "confirmed",
    });
    expect(late.eligible).toBe(false);
    expect(late.reason).toBe("after_cutoff");
  });
});

describe("auth redirect safety", () => {
  it("blocks open redirects for customer return paths", () => {
    expect(sanitizeAuthRedirect("/customer/events")).toBe("/customer/events");
    expect(sanitizeAuthRedirect("https://evil.test")).toBe("/");
    expect(sanitizeAuthRedirect("//evil.test")).toBe("/");
  });
});

describe("refund display contract", () => {
  it("does not encode refund percentage helpers in format module", async () => {
    const mod = await import("@/lib/frontend/customer/format");
    expect("getRefundAmount" in mod).toBe(false);
    expect("calculateCommission" in mod).toBe(false);
    expect("trustRankDelta" in mod).toBe(false);
  });
});
