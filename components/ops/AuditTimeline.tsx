import { Timeline, type TimelineItem } from "@/components/connect/Timeline";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export type AuditEventRow = {
  id?: string;
  action?: string;
  event_type?: string;
  actor_user_id?: string | null;
  resource_type?: string | null;
  resource_id?: string | null;
  created_at?: string;
  summary?: string | null;
  from_status?: string | null;
  to_status?: string | null;
};

/**
 * Reusable audit / activity presentation.
 * Does not fabricate entries; avoids dumping sensitive payloads.
 */
export function AuditTimeline({
  events,
  title = "Activity",
  className,
}: {
  events: AuditEventRow[];
  title?: string;
  className?: string;
}) {
  const items: TimelineItem[] = events.map((e, i) => {
    const action = e.action ?? e.event_type ?? "event";
    const transition =
      e.from_status || e.to_status
        ? `${e.from_status ?? "—"} → ${e.to_status ?? "—"}`
        : null;
    return {
      id: e.id ?? `evt-${i}`,
      title: action,
      description: [e.summary, transition, e.resource_type]
        .filter(Boolean)
        .join(" · "),
      at: e.created_at ?? undefined,
    };
  });

  return (
    <section
      className={cn(
        GCE_RADIUS.card,
        GCE_SURFACE.card,
        GCE_SPACING.cardPad,
        className
      )}
    >
      <h2 className="text-sm font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          No audit events for this view.
        </p>
      ) : (
        <div className="mt-3">
          <Timeline items={items} />
        </div>
      )}
    </section>
  );
}
