import { StatusBadge } from "@/components/states/StatusBadge";
import { Timeline, type TimelineItem } from "@/components/partner";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  formatMinorInr,
  milestoneStatusLabel,
} from "@/lib/frontend/enterprise/format";
import { cn } from "@/lib/utils";

export function ProjectComponentCard({
  name,
  componentType,
  sourcingVertical,
  amountMinor,
  status,
  revenueComponentKey,
  className,
}: {
  name: string;
  componentType?: string | null;
  sourcingVertical?: string | null;
  amountMinor?: number | null;
  status?: string | null;
  revenueComponentKey?: string | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {[componentType, sourcingVertical].filter(Boolean).join(" · ") ||
              "Component"}
          </p>
        </div>
        {status ? (
          <StatusBadge label={String(status).replace(/_/g, " ")} tone="neutral" />
        ) : null}
      </div>
      {typeof amountMinor === "number" ? (
        <p className="mt-3 text-sm font-medium tabular-nums">
          {formatMinorInr(amountMinor)}
        </p>
      ) : null}
      {revenueComponentKey ? (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Revenue component: {revenueComponentKey} (no double commission on the same
          component)
        </p>
      ) : (
        <p className="mt-2 text-[11px] text-muted-foreground">
          Component identity preserved for no-double-commission settlement.
        </p>
      )}
    </article>
  );
}

export function MilestoneList({
  milestones,
  className,
}: {
  milestones: Array<{
    id: string;
    name: string;
    status: string;
    dueOn?: string | null;
    amountMinor?: number | null;
  }>;
  className?: string;
}) {
  if (milestones.length === 0) {
    return (
      <p className={cn("text-sm text-muted-foreground", className)}>
        No milestones yet. Milestones are project-specific — there is no fixed 30/40/30
        schedule.
      </p>
    );
  }

  const items: TimelineItem[] = milestones.map((m) => ({
    id: m.id,
    title: m.name,
    description: [
      milestoneStatusLabel(m.status),
      m.dueOn ? `Due ${m.dueOn}` : null,
      typeof m.amountMinor === "number" ? formatMinorInr(m.amountMinor) : null,
    ]
      .filter(Boolean)
      .join(" · "),
    at: m.dueOn ?? null,
  }));

  return (
    <div className={className}>
      <p className="mb-3 text-xs text-muted-foreground">
        Project-specific milestones from backend — not a universal payment split.
      </p>
      <Timeline items={items} />
    </div>
  );
}

export function ChangeOrderCard({
  title,
  status,
  requestedChange,
  commercialImpactMinor,
  className,
}: {
  title: string;
  status: string;
  requestedChange?: string | null;
  commercialImpactMinor?: number | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <StatusBadge label={status.replace(/_/g, " ")} tone="warning" />
      </div>
      {requestedChange ? (
        <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
          {requestedChange}
        </p>
      ) : null}
      {typeof commercialImpactMinor === "number" ? (
        <p className="mt-3 text-sm tabular-nums">
          Commercial impact: {formatMinorInr(commercialImpactMinor)}
        </p>
      ) : null}
    </article>
  );
}

export function VendorRecordCard({
  businessName,
  category,
  status,
  className,
}: {
  businessName: string;
  category?: string | null;
  status?: string | null;
  className?: string;
}) {
  return (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{businessName}</h3>
          {category ? (
            <p className="mt-1 text-xs text-muted-foreground">{category}</p>
          ) : null}
        </div>
        {status ? (
          <StatusBadge label={String(status).replace(/_/g, " ")} tone="neutral" />
        ) : null}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Managed vendor record — no vendor self-service portal.
      </p>
    </article>
  );
}
