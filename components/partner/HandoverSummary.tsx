import { StatusBadge } from "@/components/states/StatusBadge";
import { Timeline, type TimelineItem } from "@/components/connect/Timeline";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function HandoverSummary({
  status,
  fromUnitId,
  toUnitId,
  notes,
  effectiveAt,
  timeline,
  className,
}: {
  status: string;
  fromUnitId?: string | null;
  toUnitId?: string | null;
  notes?: string | null;
  effectiveAt?: string | null;
  timeline?: TimelineItem[];
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">Handover</h3>
        <StatusBadge label={status.replace(/_/g, " ")} tone="pending" />
      </div>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Outgoing unit</dt>
          <dd className="mt-0.5 font-medium tabular-nums">
            {fromUnitId ? fromUnitId.slice(0, 8) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Incoming unit</dt>
          <dd className="mt-0.5 font-medium tabular-nums">
            {toUnitId ? toUnitId.slice(0, 8) : "—"}
          </dd>
        </div>
        {effectiveAt ? (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Effective</dt>
            <dd className="mt-0.5">
              {new Date(effectiveAt).toLocaleString("en-IN")}
            </dd>
          </div>
        ) : null}
      </dl>
      {notes ? (
        <p className="mt-3 text-sm text-muted-foreground">{notes}</p>
      ) : null}
      {timeline && timeline.length > 0 ? (
        <div className="mt-4">
          <Timeline items={timeline} />
        </div>
      ) : null}
      <p className="mt-4 text-[11px] text-muted-foreground">
        Handover is prospective by default. Historical attribution and commission are
        not rewritten client-side. Platform approval is required.
      </p>
    </article>
  );
}
