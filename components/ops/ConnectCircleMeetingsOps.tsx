"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/states/StatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import type { ConnectCircleMeeting } from "@/lib/architecture/connect/meetings";
import { extractApiError } from "@/lib/frontend/connect/format";

type CircleOption = {
  id: string;
  name: string;
  city: string;
  lifecycleStatus: string;
};

export function ConnectCircleMeetingsOps({
  circles,
}: {
  circles: CircleOption[];
}) {
  const [circleId, setCircleId] = useState(circles[0]?.id ?? "");
  const [meetings, setMeetings] = useState<ConnectCircleMeeting[]>([]);
  const [upcoming, setUpcoming] = useState<ConnectCircleMeeting | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisory, setAdvisory] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [title, setTitle] = useState("Circle meeting");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadMeetings = useCallback(async () => {
    if (!circleId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/connect/circle-meetings?circleId=${encodeURIComponent(circleId)}`
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(extractApiError(json, "Failed to load meetings"));
      }
      setMeetings(json.meetings ?? []);
      setUpcoming(json.upcoming ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load meetings");
      setMeetings([]);
      setUpcoming(null);
    } finally {
      setLoading(false);
    }
  }, [circleId]);

  useEffect(() => {
    void loadMeetings();
  }, [loadMeetings]);

  async function scheduleMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!circleId || !scheduledAt) return;
    setSubmitting(true);
    setError(null);
    setAdvisory(null);
    try {
      const res = await fetch("/api/connect/circle-meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "schedule",
          circleId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          title,
          location: location || null,
          notes: notes || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(extractApiError(json, "Failed to schedule meeting"));
      }
      setAdvisory(json.cadenceAdvisory ?? null);
      setScheduledAt("");
      setNotes("");
      await loadMeetings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Schedule failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateStatus(
    meetingId: string,
    status: ConnectCircleMeeting["status"]
  ) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/connect/circle-meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", meetingId, status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(extractApiError(json, "Failed to update meeting"));
      }
      await loadMeetings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (circles.length === 0) {
    return (
      <EmptyState
        title="No Circles available"
        description="Create or activate a Circle before scheduling meetings."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <label className="text-xs font-medium text-muted-foreground">
          Circle
        </label>
        <select
          value={circleId}
          onChange={(e) => setCircleId(e.target.value)}
          className="mt-2 h-11 w-full max-w-md rounded-md border border-input bg-background px-3 text-sm"
        >
          {circles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.city} ({c.lifecycleStatus.replaceAll("_", " ")})
            </option>
          ))}
        </select>
        <p className="mt-2 text-xs text-muted-foreground">
          Standard cadence: every 15 days (FD-030). Scheduling assistance warns
          when the gap is shorter — Ops may still proceed.
        </p>
      </div>

      <form
        onSubmit={scheduleMeeting}
        className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} grid gap-3 p-5 md:grid-cols-2`}
      >
        <h2 className="md:col-span-2 text-sm font-semibold">Schedule meeting</h2>
        <div>
          <label className="text-xs text-muted-foreground">Date & time</label>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
            className="mt-1 h-11"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 h-11"
            maxLength={200}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Location</label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 h-11"
            maxLength={300}
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Notes (optional)</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 h-11"
            maxLength={2000}
          />
        </div>
        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={submitting} className="min-h-11">
            {submitting ? "Saving…" : "Schedule meeting"}
          </Button>
          {advisory ? (
            <p className="text-xs text-amber-700 dark:text-amber-300">{advisory}</p>
          ) : null}
        </div>
      </form>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold">Circle meeting schedule</h2>
          {upcoming ? (
            <StatusBadge label="Upcoming scheduled" tone="pending" />
          ) : (
            <StatusBadge label="No upcoming" tone="neutral" />
          )}
        </div>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        ) : meetings.length === 0 ? (
          <EmptyState
            title="No meetings yet"
            description="Schedule the first meeting for this Circle."
          />
        ) : (
          <ul className="mt-4 space-y-2">
            {meetings.map((m) => (
              <li
                key={m.id}
                className="flex flex-col gap-2 rounded-lg border border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="text-sm">
                  <p className="font-medium">{m.title || "Circle meeting"}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {new Date(m.scheduledAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {m.location ? ` · ${m.location}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={m.status} tone="neutral" />
                  {m.status === "scheduled" ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={submitting}
                        onClick={() => void updateStatus(m.id, "completed")}
                      >
                        Mark completed
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={submitting}
                        onClick={() => void updateStatus(m.id, "cancelled")}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
