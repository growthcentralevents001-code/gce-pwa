import { describe, expect, it } from "vitest";
import {
  cadenceAdvisoryForSchedule,
  partitionCircleMeetings,
  CIRCLE_MEETING_CADENCE_DAYS,
  type ConnectCircleMeeting,
} from "@/lib/architecture/connect/meetings";

function meeting(
  partial: Partial<ConnectCircleMeeting> & Pick<ConnectCircleMeeting, "id" | "scheduledAt" | "status">
): ConnectCircleMeeting {
  return {
    circleId: "circle-1",
    title: "Circle meeting",
    location: null,
    notes: null,
    createdBy: null,
    updatedBy: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...partial,
  };
}

describe("Connect Circle meetings", () => {
  it("uses 15-day cadence constant", () => {
    expect(CIRCLE_MEETING_CADENCE_DAYS).toBe(15);
  });

  it("advises when scheduling sooner than 15 days after previous meeting", () => {
    const advisory = cadenceAdvisoryForSchedule(
      "2026-09-01T10:00:00.000Z",
      new Date("2026-09-10T10:00:00.000Z")
    );
    expect(advisory).toMatch(/9 days/i);
    expect(advisory).toMatch(/15 days/i);
  });

  it("does not advise when gap meets cadence", () => {
    const advisory = cadenceAdvisoryForSchedule(
      "2026-09-01T10:00:00.000Z",
      new Date("2026-09-16T10:00:00.000Z")
    );
    expect(advisory).toBeNull();
  });

  it("partitions upcoming vs previous without fabricating dates", () => {
    const now = new Date("2026-09-15T12:00:00.000Z");
    const meetings = [
      meeting({
        id: "future",
        scheduledAt: "2026-09-20T10:00:00.000Z",
        status: "scheduled",
      }),
      meeting({
        id: "past-scheduled",
        scheduledAt: "2026-09-01T10:00:00.000Z",
        status: "scheduled",
      }),
      meeting({
        id: "completed",
        scheduledAt: "2026-08-15T10:00:00.000Z",
        status: "completed",
      }),
    ];
    const { upcoming, previous } = partitionCircleMeetings(meetings, now);
    expect(upcoming?.id).toBe("future");
    expect(previous.map((m) => m.id)).toEqual(["past-scheduled", "completed"]);
  });

  it("returns null upcoming when no scheduled future meeting exists", () => {
    const now = new Date("2026-10-01T00:00:00.000Z");
    const { upcoming } = partitionCircleMeetings(
      [
        meeting({
          id: "done",
          scheduledAt: "2026-09-01T10:00:00.000Z",
          status: "completed",
        }),
      ],
      now
    );
    expect(upcoming).toBeNull();
  });
});
