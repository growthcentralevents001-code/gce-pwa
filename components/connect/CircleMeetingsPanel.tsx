"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { CalendarDays, Smartphone } from "lucide-react";
import { StatusBadge } from "@/components/states/StatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import type {
  CircleMeetingAttendance,
  ConnectCircleMeeting,
} from "@/lib/architecture/connect/meetings";
import { CIRCLE_MEETING_CADENCE_DAYS } from "@/lib/architecture/connect/meetings";
import { extractApiError } from "@/lib/frontend/connect/format";

function formatMeetingWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function meetingStatusTone(
  status: ConnectCircleMeeting["status"]
): "pending" | "success" | "inactive" {
  switch (status) {
    case "scheduled":
      return "pending";
    case "completed":
      return "success";
    case "cancelled":
      return "inactive";
    default:
      return "pending";
  }
}

export function CircleMeetingsPanel({
  upcoming,
  previous,
  myAttendance = null,
  allowRsvp = false,
  compact = false,
  className,
}: {
  upcoming: ConnectCircleMeeting | null;
  previous: ConnectCircleMeeting[];
  myAttendance?: CircleMeetingAttendance | null;
  allowRsvp?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const pastVisible = useMemo(() => previous.slice(0, 8), [previous]);
  const [attendance, setAttendance] = useState(myAttendance);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function rsvp(status: "scheduled" | "excused") {
    if (!upcoming || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/connect/circle-meetings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "rsvp",
          meetingId: upcoming.id,
          status,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(extractApiError(json, "Could not save attendance"));
        return;
      }
      setAttendance(json.attendance ?? null);
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <div className="flex items-start gap-3">
        <CalendarDays
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Circle meetings</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            GCE Connect Circles meet every{" "}
            <strong>{CIRCLE_MEETING_CADENCE_DAYS} days</strong> for structured
            business discussions. Dates below are scheduled by platform Ops —
            not estimated from policy.
          </p>

          {upcoming ? (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Upcoming meeting
              </p>
              <p className="mt-1 text-sm font-semibold">
                {upcoming.title?.trim() || "Circle meeting"}
              </p>
              <p className="mt-1 text-sm tabular-nums">
                {formatMeetingWhen(upcoming.scheduledAt)}
              </p>
              {upcoming.location ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {upcoming.location}
                </p>
              ) : null}
              <div className="mt-2">
                <StatusBadge
                  label={upcoming.status.replaceAll("_", " ")}
                  tone={meetingStatusTone(upcoming.status)}
                />
              </div>
              {attendance ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Your attendance:{" "}
                  <span className="font-medium text-foreground">
                    {attendance.status.replaceAll("_", " ")}
                  </span>
                </p>
              ) : null}
              {upcoming.notes ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {upcoming.notes}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" className="min-h-11">
                  <Link href={`/connect/leads?meetingId=${upcoming.id}`}>
                    Create referral
                  </Link>
                </Button>
                {allowRsvp ? (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="min-h-11"
                      disabled={pending}
                      onClick={() => rsvp("scheduled")}
                    >
                      I will attend
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="min-h-11"
                      disabled={pending}
                      onClick={() => rsvp("excused")}
                    >
                      Request excuse
                    </Button>
                  </>
                ) : null}
              </div>
              {error ? (
                <p className="mt-2 text-xs text-destructive">{error}</p>
              ) : null}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                title="No meeting scheduled"
                description="Your Circle's next meeting will appear here once platform Ops schedules it."
              />
            </div>
          )}
        </div>
      </div>

      {compact ? null : pastVisible.length > 0 ? (
        <section className="mt-5 border-t border-border pt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Previous meetings
          </h3>
          <ul className="mt-3 space-y-2">
            {pastVisible.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-medium">
                    {m.title?.trim() || "Circle meeting"}
                  </p>
                  <p className="text-muted-foreground tabular-nums">
                    {formatMeetingWhen(m.scheduledAt)}
                  </p>
                </div>
                <StatusBadge
                  label={m.status.replaceAll("_", " ")}
                  tone={meetingStatusTone(m.status)}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
        <Smartphone
          className="mt-0.5 h-5 w-5 shrink-0 text-primary"
          aria-hidden
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">
            Referrals stay in the app.
          </strong>{" "}
          Official business referrals are created and managed through GCE Lead
          Assist — not exchanged verbally in meetings or via WhatsApp.
        </p>
      </div>
    </div>
  );
}
