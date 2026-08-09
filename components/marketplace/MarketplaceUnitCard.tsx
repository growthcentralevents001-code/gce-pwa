import Link from "next/link";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Progress } from "@/components/ui/progress";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  MBDP_PERSON_MAX_UNITS,
  MBDP_STANDARD_MAX_VENUES,
  unitVenueCapacityLabel,
} from "@/lib/frontend/marketplace/format";
import { cn } from "@/lib/utils";

export function MarketplaceUnitCard({
  unitLabel,
  status,
  activeVenues,
  capacity,
  unitIndex,
  totalUnits,
  href,
  className,
}: {
  unitLabel: string;
  status: string;
  activeVenues: number;
  capacity: number;
  unitIndex?: number;
  totalUnits?: number;
  href?: string;
  className?: string;
}) {
  const pct = Math.min(
    100,
    Math.round((activeVenues / Math.max(capacity, 1)) * 100)
  );
  const body = (
    <article className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{unitLabel}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Capacity {unitVenueCapacityLabel(activeVenues, capacity)} · Max{" "}
            {MBDP_PERSON_MAX_UNITS} units / {MBDP_STANDARD_MAX_VENUES} venues per
            person
            {typeof unitIndex === "number" && typeof totalUnits === "number"
              ? ` · Unit ${unitIndex} of ${totalUnits}`
              : null}
          </p>
        </div>
        <StatusBadge label={status.replace(/_/g, " ")} tone="pending" />
      </div>
      <div className="mt-4">
        <Progress value={pct} aria-label={`Venue capacity ${pct}%`} className="h-2.5" />
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        Venue-attribution model — no city or territory ownership.
      </p>
    </article>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {body}
      </Link>
    );
  }
  return body;
}
