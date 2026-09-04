import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { getCircle } from "./circles";
import { createNotificationIntent } from "../ops-governance/operations";

export const CIRCLE_MEETING_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
] as const;

export type CircleMeetingStatus = (typeof CIRCLE_MEETING_STATUSES)[number];

export const CIRCLE_MEETING_CADENCE_DAYS = 15;

export const CIRCLE_MEETING_ATTENDANCE_STATUSES = [
  "scheduled",
  "attended",
  "absent",
  "excused",
] as const;

export type CircleMeetingAttendanceStatus =
  (typeof CIRCLE_MEETING_ATTENDANCE_STATUSES)[number];

export const MEMBER_RSVP_STATUSES = ["scheduled", "excused"] as const;

export type CircleMeetingAttendance = {
  id: string;
  meetingId: string;
  userId: string;
  membershipId: string | null;
  status: CircleMeetingAttendanceStatus;
  recordedBy: string | null;
  updatedAt: string;
};

export type ConnectCircleMeeting = {
  id: string;
  circleId: string;
  scheduledAt: string;
  status: CircleMeetingStatus;
  title: string | null;
  location: string | null;
  notes: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapMeeting(row: Record<string, unknown>): ConnectCircleMeeting {
  return {
    id: String(row.id),
    circleId: String(row.circle_id),
    scheduledAt: String(row.scheduled_at),
    status: row.status as CircleMeetingStatus,
    title: (row.title as string | null) ?? null,
    location: (row.location as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    createdBy: (row.created_by as string | null) ?? null,
    updatedBy: (row.updated_by as string | null) ?? null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listCircleMeetings(
  client: SupabaseClient,
  circleId: string,
  limit = 50
): Promise<ConnectCircleMeeting[]> {
  const { data, error } = await client
    .from("connect_circle_meetings")
    .select("*")
    .eq("circle_id", circleId)
    .order("scheduled_at", { ascending: false })
    .limit(limit);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load Circle meetings", {
      cause: error,
    });
  }
  return (data ?? []).map((row) => mapMeeting(row as Record<string, unknown>));
}

export function partitionCircleMeetings(
  meetings: ConnectCircleMeeting[],
  now: Date = new Date()
): {
  upcoming: ConnectCircleMeeting | null;
  upcomingAll: ConnectCircleMeeting[];
  previous: ConnectCircleMeeting[];
} {
  const upcomingAll = meetings
    .filter(
      (m) =>
        m.status === "scheduled" && new Date(m.scheduledAt).getTime() >= now.getTime()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  const previous = meetings
    .filter((m) => {
      if (m.status === "completed" || m.status === "cancelled") return true;
      return (
        m.status === "scheduled" &&
        new Date(m.scheduledAt).getTime() < now.getTime()
      );
    })
    .sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );
  return {
    upcoming: upcomingAll[0] ?? null,
    upcomingAll,
    previous,
  };
}

export function cadenceAdvisoryForSchedule(
  previousScheduledAt: string | null,
  newScheduledAt: Date
): string | null {
  if (!previousScheduledAt) return null;
  const prev = new Date(previousScheduledAt);
  if (Number.isNaN(prev.getTime())) return null;
  const diffDays =
    (newScheduledAt.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays < CIRCLE_MEETING_CADENCE_DAYS) {
    const rounded = Math.max(0, Math.floor(diffDays));
    return `Scheduled ${rounded} day${rounded === 1 ? "" : "s"} after the previous meeting. GCE policy is every ${CIRCLE_MEETING_CADENCE_DAYS} days — Ops may proceed with documented reason.`;
  }
  return null;
}

async function latestScheduledMeetingAt(
  client: SupabaseClient,
  circleId: string
): Promise<string | null> {
  const { data } = await client
    .from("connect_circle_meetings")
    .select("scheduled_at")
    .eq("circle_id", circleId)
    .neq("status", "cancelled")
    .order("scheduled_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.scheduled_at ? String(data.scheduled_at) : null;
}

export async function scheduleCircleMeeting(
  client: SupabaseClient,
  input: {
    circleId: string;
    scheduledAt: string;
    title?: string | null;
    location?: string | null;
    notes?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<{ meeting: ConnectCircleMeeting; cadenceAdvisory: string | null }> {
  const circle = await getCircle(client, input.circleId);
  if (!circle) {
    throw new AppError("NOT_FOUND", "Circle not found", { status: 404 });
  }

  const scheduledDate = new Date(input.scheduledAt);
  if (Number.isNaN(scheduledDate.getTime())) {
    throw new AppError("VALIDATION_ERROR", "Invalid scheduled date/time", {
      status: 400,
    });
  }

  const previousAt = await latestScheduledMeetingAt(client, input.circleId);
  const cadenceAdvisory = cadenceAdvisoryForSchedule(previousAt, scheduledDate);

  const { data, error } = await client
    .from("connect_circle_meetings")
    .insert({
      circle_id: input.circleId,
      scheduled_at: scheduledDate.toISOString(),
      status: "scheduled",
      title: input.title?.trim() || "Circle meeting",
      location: input.location?.trim() || null,
      notes: input.notes?.trim() || null,
      created_by: input.actorUserId,
      updated_by: input.actorUserId,
    })
    .select("*")
    .single();

  if (error || !data) {
    if (error?.code === "23505") {
      throw new AppError(
        "VALIDATION_ERROR",
        "A meeting is already scheduled for this Circle at that time",
        { status: 409 }
      );
    }
    throw new AppError("INTERNAL_ERROR", "Failed to schedule Circle meeting", {
      cause: error,
    });
  }

  const meeting = mapMeeting(data as Record<string, unknown>);
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "circle_meeting.schedule",
    resourceType: "connect_circle_meeting",
    resourceId: meeting.id,
    after: meeting,
    correlationId: input.correlationId,
    metadata: { cadenceAdvisory },
  });

  await notifyCircleMeetingSeats(client, {
    circleId: meeting.circleId,
    meetingId: meeting.id,
    summary: `A Circle meeting is scheduled for ${meeting.scheduledAt}.`,
    correlationId: input.correlationId,
  });

  return { meeting, cadenceAdvisory };
}

export async function updateCircleMeetingStatus(
  client: SupabaseClient,
  input: {
    meetingId: string;
    status: CircleMeetingStatus;
    notes?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<ConnectCircleMeeting> {
  const { data: existing, error: readErr } = await client
    .from("connect_circle_meetings")
    .select("*")
    .eq("id", input.meetingId)
    .maybeSingle();
  if (readErr || !existing) {
    throw new AppError("NOT_FOUND", "Circle meeting not found", { status: 404 });
  }

  const patch: Record<string, unknown> = {
    status: input.status,
    updated_by: input.actorUserId,
  };
  if (input.notes !== undefined) {
    patch.notes = input.notes?.trim() || null;
  }

  const { data, error } = await client
    .from("connect_circle_meetings")
    .update(patch)
    .eq("id", input.meetingId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to update Circle meeting", {
      cause: error,
    });
  }

  const meeting = mapMeeting(data as Record<string, unknown>);
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "circle_meeting.update_status",
    resourceType: "connect_circle_meeting",
    resourceId: meeting.id,
    before: existing,
    after: meeting,
    correlationId: input.correlationId,
  });

  if (input.status === "cancelled") {
    await notifyCircleMeetingSeats(client, {
      circleId: meeting.circleId,
      meetingId: meeting.id,
      summary: "A Circle meeting was cancelled.",
      correlationId: input.correlationId,
    });
  }

  return meeting;
}

function mapAttendance(row: Record<string, unknown>): CircleMeetingAttendance {
  return {
    id: String(row.id),
    meetingId: String(row.meeting_id),
    userId: String(row.user_id),
    membershipId: (row.membership_id as string | null) ?? null,
    status: row.status as CircleMeetingAttendanceStatus,
    recordedBy: (row.recorded_by as string | null) ?? null,
    updatedAt: String(row.updated_at),
  };
}

export async function getCircleMeeting(
  client: SupabaseClient,
  meetingId: string
): Promise<ConnectCircleMeeting | null> {
  const { data, error } = await client
    .from("connect_circle_meetings")
    .select("*")
    .eq("id", meetingId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load Circle meeting", {
      cause: error,
    });
  }
  return data ? mapMeeting(data as Record<string, unknown>) : null;
}

export async function listCircleSeatUserIds(
  client: SupabaseClient,
  circleId: string
): Promise<Array<{ userId: string; membershipId: string }>> {
  const { data, error } = await client
    .from("connect_circle_seats")
    .select("membership_id, connect_memberships!inner(user_id)")
    .eq("circle_id", circleId)
    .in("status", ["allocated", "reserved", "protected_grace"]);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list Circle seats", {
      cause: error,
    });
  }
  const out: Array<{ userId: string; membershipId: string }> = [];
  for (const row of data ?? []) {
    const membership = row.connect_memberships as
      | { user_id?: string }
      | { user_id?: string }[]
      | null;
    const nested = Array.isArray(membership) ? membership[0] : membership;
    const userId = nested?.user_id;
    if (userId && row.membership_id) {
      out.push({
        userId: String(userId),
        membershipId: String(row.membership_id),
      });
    }
  }
  return out;
}

export async function listMeetingAttendance(
  client: SupabaseClient,
  meetingId: string
): Promise<CircleMeetingAttendance[]> {
  const { data, error } = await client
    .from("connect_circle_meeting_attendance")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("updated_at", { ascending: false });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load attendance", {
      cause: error,
    });
  }
  return (data ?? []).map((row) => mapAttendance(row as Record<string, unknown>));
}

export async function getMyMeetingAttendance(
  client: SupabaseClient,
  meetingId: string,
  userId: string
): Promise<CircleMeetingAttendance | null> {
  const { data, error } = await client
    .from("connect_circle_meeting_attendance")
    .select("*")
    .eq("meeting_id", meetingId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load own attendance", {
      cause: error,
    });
  }
  return data ? mapAttendance(data as Record<string, unknown>) : null;
}

export function attendanceCounts(
  rows: CircleMeetingAttendance[]
): Record<CircleMeetingAttendanceStatus, number> {
  const counts: Record<CircleMeetingAttendanceStatus, number> = {
    scheduled: 0,
    attended: 0,
    absent: 0,
    excused: 0,
  };
  for (const row of rows) {
    counts[row.status] += 1;
  }
  return counts;
}

export async function upsertMeetingAttendance(
  client: SupabaseClient,
  input: {
    meetingId: string;
    userId: string;
    membershipId?: string | null;
    status: CircleMeetingAttendanceStatus;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<CircleMeetingAttendance> {
  const meeting = await getCircleMeeting(client, input.meetingId);
  if (!meeting) {
    throw new AppError("NOT_FOUND", "Circle meeting not found", { status: 404 });
  }

  const { data, error } = await client
    .from("connect_circle_meeting_attendance")
    .upsert(
      {
        meeting_id: input.meetingId,
        user_id: input.userId,
        membership_id: input.membershipId ?? null,
        status: input.status,
        recorded_by: input.actorUserId,
      },
      { onConflict: "meeting_id,user_id" }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to save attendance", {
      cause: error,
    });
  }

  const attendance = mapAttendance(data as Record<string, unknown>);
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "circle_meeting.attendance",
    resourceType: "connect_circle_meeting_attendance",
    resourceId: attendance.id,
    after: attendance,
    correlationId: input.correlationId,
    metadata: { meetingId: input.meetingId, status: input.status },
  });
  return attendance;
}

export async function notifyCircleMeetingSeats(
  client: SupabaseClient,
  input: {
    circleId: string;
    meetingId: string;
    summary: string;
    correlationId?: string;
  }
): Promise<void> {
  const seats = await listCircleSeatUserIds(client, input.circleId);
  for (const seat of seats) {
    try {
      await createNotificationIntent(client, {
        recipientUserId: seat.userId,
        templateKey: "connect.circle_meeting",
        channel: "in_app",
        category: "operational",
        payload: { summary: input.summary },
        deepLink: "/connect/circle",
        sourceEventId: input.meetingId,
        sourceDomain: "connect_circle_meeting",
        idempotencyKey: `connect.meeting:${input.meetingId}:${seat.userId}:${input.summary.slice(0, 40)}`,
        correlationId: input.correlationId,
      });
    } catch {
      // Notification flags may suppress; meeting write remains canonical.
    }
  }
}

export async function listCirclesForOps(
  client: SupabaseClient,
  limit = 100
): Promise<
  Array<{
    id: string;
    name: string;
    city: string;
    lifecycleStatus: string;
  }>
> {
  const { data, error } = await client
    .from("connect_circles")
    .select("id,name,city,lifecycle_status")
    .not("lifecycle_status", "eq", "draft")
    .order("name")
    .limit(limit);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list Circles", {
      cause: error,
    });
  }
  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    city: String(row.city),
    lifecycleStatus: String(row.lifecycle_status),
  }));
}
