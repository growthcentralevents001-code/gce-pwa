import { CalendarDays, Smartphone } from "lucide-react";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import type { CircleMeetingSnapshot } from "@/lib/frontend/connect/reads";

/**
 * Circle meeting cadence — FD-030 Phygital framework.
 * Shows governed copy; optional next meeting only when Ops persisted metadata exists.
 */
export function CircleMeetingCadence({
  meeting,
  className,
}: {
  meeting?: CircleMeetingSnapshot | null;
  className?: string;
}) {
  const nextAt = meeting?.nextMeetingAt
    ? new Date(meeting.nextMeetingAt)
    : null;
  const nextValid = nextAt && !Number.isNaN(nextAt.getTime());

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <div className="flex items-start gap-3">
        <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold">Structured Circle meetings</h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            GCE Connect Circles meet every <strong>15 days</strong> for structured
            business discussions and relationship-building. Digital tools support
            preparation and follow-up — they do not replace in-person Circle meetings.
          </p>
          {nextValid ? (
            <p className="mt-3 text-xs font-medium text-foreground">
              Next scheduled meeting:{" "}
              {nextAt.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
              {meeting?.nextMeetingLocation
                ? ` · ${meeting.nextMeetingLocation}`
                : null}
            </p>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              Your Circle&apos;s next meeting date will appear here once scheduled
              by platform Ops.
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
        <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Referrals stay in the app.</strong>{" "}
          Official business referrals are created and managed through GCE Lead Assist —
          not exchanged verbally in meetings or via WhatsApp.
        </p>
      </div>
    </div>
  );
}
