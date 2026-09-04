import { describe, expect, it } from "vitest";
import {
  cadenceAdvisoryForSchedule,
  partitionCircleMeetings,
  attendanceCounts,
  CIRCLE_MEETING_CADENCE_DAYS,
  type CircleMeetingAttendance,
  type ConnectCircleMeeting,
} from "@/lib/architecture/connect/meetings";
import { CreateLeadInputSchema } from "@/lib/architecture/lead-assist/schemas";
import { CIRCLE_CAPACITY_MAX } from "@/lib/architecture/connect/types";
import { ASSOCIATE_TAG_CATALOG, findAssociateTag } from "@/lib/architecture/connect/tagCatalog";

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

  it("counts attendance statuses without inventing a second engine", () => {
    const rows: CircleMeetingAttendance[] = [
      {
        id: "1",
        meetingId: "m",
        userId: "a",
        membershipId: null,
        status: "scheduled",
        recordedBy: null,
        updatedAt: "2026-09-04T00:00:00.000Z",
      },
      {
        id: "2",
        meetingId: "m",
        userId: "b",
        membershipId: null,
        status: "excused",
        recordedBy: null,
        updatedAt: "2026-09-04T00:00:00.000Z",
      },
      {
        id: "3",
        meetingId: "m",
        userId: "c",
        membershipId: null,
        status: "attended",
        recordedBy: null,
        updatedAt: "2026-09-04T00:00:00.000Z",
      },
    ];
    expect(attendanceCounts(rows)).toEqual({
      scheduled: 1,
      attended: 1,
      absent: 0,
      excused: 1,
    });
  });

  it("keeps Circle capacity at 40", () => {
    expect(CIRCLE_CAPACITY_MAX).toBe(40);
  });

  it("accepts meetingId on Lead Assist create without a parallel referral schema", () => {
    const parsed = CreateLeadInputSchema.parse({
      title: "Circle meeting follow-up",
      requirementSummary: "Need a CA in Bengaluru after the Circle meeting.",
      meetingId: "913f0c95-deeb-4c2a-8b07-791a068f2cd5",
    });
    expect(parsed.meetingId).toBe("913f0c95-deeb-4c2a-8b07-791a068f2cd5");
  });

  it("rejects unknown Tag keys from the Associate catalog", () => {
    expect(findAssociateTag("networking")).toBeTruthy();
    expect(findAssociateTag("not_a_real_tag")).toBeUndefined();
    expect(ASSOCIATE_TAG_CATALOG.length).toBeGreaterThan(0);
  });
});
