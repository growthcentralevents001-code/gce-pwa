import { describe, expect, it } from "vitest";
import {
  buildVenueBusinessInsightsFromTouchpoints,
  buildVenueInsightsPeriod,
  computeVenueCustomerMetrics,
  dedupeVenueTouchpoints,
  type VenueQualifyingTouchpoint,
} from "@/lib/architecture/marketplace/insights";

const VENUE_A = "11111111-1111-4111-8111-111111111111";
const VENUE_B = "22222222-2222-4222-8222-222222222222";
const USER_1 = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const USER_2 = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function tp(
  partial: Omit<VenueQualifyingTouchpoint, "venueId"> & { venueId?: string }
): VenueQualifyingTouchpoint {
  return {
    venueId: partial.venueId ?? VENUE_A,
    customerUserId: partial.customerUserId,
    activityType: partial.activityType,
    sourceRecordId: partial.sourceRecordId,
    occurredAt: partial.occurredAt,
    eventId: partial.eventId,
    offerId: partial.offerId,
  };
}

describe("venue business insights", () => {
  const period = buildVenueInsightsPeriod(
    30,
    new Date("2026-09-15T12:00:00Z")
  );

  it("counts one unique customer across booking and offer visit at same venue", () => {
    const touchpoints = [
      tp({
        customerUserId: USER_1,
        activityType: "event_booking",
        sourceRecordId: "booking:1",
        occurredAt: "2026-09-10T10:00:00Z",
        eventId: "e1",
      }),
      tp({
        customerUserId: USER_1,
        activityType: "offer_visit",
        sourceRecordId: "visit:1",
        occurredAt: "2026-09-12T10:00:00Z",
        offerId: "o1",
      }),
    ];
    const metrics = computeVenueCustomerMetrics(touchpoints, period);
    expect(metrics.uniqueAllTime).toBe(1);
    expect(metrics.uniqueInPeriod).toBe(1);
    expect(metrics.repeatAllTime).toBe(1);
    expect(metrics.qualifyingActivitiesInPeriod).toBe(2);
  });

  it("isolates customer counts per venue", () => {
    const touchpoints = [
      tp({
        venueId: VENUE_A,
        customerUserId: USER_1,
        activityType: "event_booking",
        sourceRecordId: "booking:a",
        occurredAt: "2026-09-10T10:00:00Z",
      }),
      tp({
        venueId: VENUE_B,
        customerUserId: USER_1,
        activityType: "event_booking",
        sourceRecordId: "booking:b",
        occurredAt: "2026-09-10T11:00:00Z",
      }),
    ];
    const venueAOnly = touchpoints.filter((t) => t.venueId === VENUE_A);
    const venueBOnly = touchpoints.filter((t) => t.venueId === VENUE_B);
    expect(computeVenueCustomerMetrics(venueAOnly, period).uniqueAllTime).toBe(
      1
    );
    expect(computeVenueCustomerMetrics(venueBOnly, period).uniqueAllTime).toBe(
      1
    );
  });

  it("dedupes duplicate source processing", () => {
    const touchpoints = [
      tp({
        customerUserId: USER_1,
        activityType: "event_booking",
        sourceRecordId: "booking:dup",
        occurredAt: "2026-09-10T10:00:00Z",
      }),
      tp({
        customerUserId: USER_1,
        activityType: "event_booking",
        sourceRecordId: "booking:dup",
        occurredAt: "2026-09-10T10:00:00Z",
      }),
    ];
    const deduped = dedupeVenueTouchpoints(touchpoints);
    expect(deduped).toHaveLength(1);
    expect(
      computeVenueCustomerMetrics(deduped, period).qualifyingActivitiesInPeriod
    ).toBe(1);
  });

  it("classifies first-time vs returning customers in period", () => {
    const touchpoints = [
      tp({
        customerUserId: USER_1,
        activityType: "event_booking",
        sourceRecordId: "booking:old",
        occurredAt: "2026-08-01T10:00:00Z",
      }),
      tp({
        customerUserId: USER_1,
        activityType: "offer_visit",
        sourceRecordId: "visit:new",
        occurredAt: "2026-09-10T10:00:00Z",
      }),
      tp({
        customerUserId: USER_2,
        activityType: "offer_redemption",
        sourceRecordId: "redemption:1",
        occurredAt: "2026-09-11T10:00:00Z",
      }),
    ];
    const metrics = computeVenueCustomerMetrics(touchpoints, period);
    expect(metrics.uniqueInPeriod).toBe(2);
    expect(metrics.firstTimeInPeriod).toBe(1);
    expect(metrics.returningInPeriod).toBe(1);
  });

  it("builds aggregate insights without fabricating trends when empty", () => {
    const insights = buildVenueBusinessInsightsFromTouchpoints({
      touchpoints: [],
      period,
      visibility: {
        venueViewsAllTime: 0,
        eventViewsAllTime: 0,
        offerViewsAllTime: 0,
        venueViewsInPeriod: 0,
        eventViewsInPeriod: 0,
        offerViewsInPeriod: 0,
      },
      events: [],
      offers: [],
    });
    expect(insights.hasQualifyingActivity).toBe(false);
    expect(insights.customers.uniqueInPeriod).toBe(0);
    expect(insights.observations[0]).toContain("No qualifying customer activity");
  });

  it("separates visibility from engagement in composed insights", () => {
    const insights = buildVenueBusinessInsightsFromTouchpoints({
      touchpoints: [
        tp({
          customerUserId: USER_1,
          activityType: "event_booking",
          sourceRecordId: "booking:1",
          occurredAt: "2026-09-10T10:00:00Z",
        }),
      ],
      period,
      visibility: {
        venueViewsAllTime: 40,
        eventViewsAllTime: 10,
        offerViewsAllTime: 5,
        venueViewsInPeriod: 12,
        eventViewsInPeriod: 4,
        offerViewsInPeriod: 1,
      },
      events: [{ id: "e1", title: "Launch Night" }],
      offers: [],
    });
    expect(insights.visibility.venueViewsInPeriod).toBe(12);
    expect(insights.engagement.bookingsInPeriod).toBe(1);
    expect(insights.customers.uniqueInPeriod).toBe(1);
  });
});
