import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { getCircle } from "./circles";

export const CIRCLE_MEETING_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
] as const;

export type CircleMeetingStatus = (typeof CIRCLE_MEETING_STATUSES)[number];

export const CIRCLE_MEETING_CADENCE_DAYS = 15;

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

  return meeting;
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
