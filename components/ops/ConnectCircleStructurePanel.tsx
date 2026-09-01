import { CircleCard } from "@/components/connect/CircleCard";
import { PowerSectorGrid } from "@/components/connect/PowerSectorGrid";
import {
  circleRemainingSeatsLabel,
  CIRCLE_CAPACITY_MAX,
} from "@/lib/frontend/connect/format";
import type { GcPowerSectorId } from "@/lib/frontend/design-language";

export type CircleStructureSummary = {
  id: string;
  name: string;
  city: string;
  activeSeats: number;
  capacityMax: number;
  remaining: number;
  lifecycleStatus: string;
  constitutionStatus: string;
  sectorCounts: Partial<Record<GcPowerSectorId, number>>;
  sectorSpecs: Partial<Record<GcPowerSectorId, string[]>>;
};

/**
 * Read-only Circle capacity + four-sector distribution (Ops / Connect BDP).
 */
export function ConnectCircleStructurePanel({
  circles,
}: {
  circles: CircleStructureSummary[];
}) {
  if (circles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No Circles to display in this scope.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {circles.map((circle) => {
        const capacityMax = Math.min(circle.capacityMax, CIRCLE_CAPACITY_MAX);
        const isFull = circle.remaining <= 0;
        return (
          <section
            key={circle.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <CircleCard
                name={circle.name}
                city={circle.city}
                lifecycleStatus={circle.lifecycleStatus}
                constitutionStatus={circle.constitutionStatus}
                activeSeatCount={circle.activeSeats}
                capacityMax={capacityMax}
                href="#"
                className="pointer-events-none"
              />
              <div>
                <h3 className="text-sm font-semibold">Capacity</h3>
                <p className="mt-2 text-sm tabular-nums">
                  {circle.activeSeats} / {capacityMax} members ·{" "}
                  {circleRemainingSeatsLabel(circle.activeSeats, capacityMax)}
                </p>
                {isFull ? (
                  <p className="mt-2 text-xs font-medium text-warning">
                    Circle full — seat 41 blocked server-side
                  </p>
                ) : null}
                <p className="mt-3 text-xs text-muted-foreground">
                  Four fixed GC Power Sectors — flexible distribution, not equal
                  10/10/10/10.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold">Sector balance</h3>
              <PowerSectorGrid
                memberCounts={circle.sectorCounts}
                specialisationsBySector={circle.sectorSpecs}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
