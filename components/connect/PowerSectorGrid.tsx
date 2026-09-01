import { Building2, Factory, Briefcase, HeartHandshake } from "lucide-react";
import {
  GC_POWER_SECTORS,
  GCE_RADIUS,
  GCE_SURFACE,
  type GcPowerSectorId,
} from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

const ICONS = [Building2, Factory, Briefcase, HeartHandshake] as const;

/**
 * GC Power Sectors — four fixed sectors (FD-030).
 * Differentiation via icon + typography + orange tonal borders — not rainbow.
 */
export function PowerSectorGrid({
  className,
  memberCounts,
  specialisationsBySector,
}: {
  className?: string;
  /** Backend-derived member counts per sector id — omit to hide counts. */
  memberCounts?: Partial<Record<GcPowerSectorId, number>>;
  /** Backend-derived specialisation labels per sector — omit to hide. */
  specialisationsBySector?: Partial<Record<GcPowerSectorId, string[]>>;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {GC_POWER_SECTORS.map((sector, i) => {
        const Icon = ICONS[i] ?? Building2;
        const count = memberCounts?.[sector.id];
        return (
          <article
            key={sector.id}
            className={cn(
              GCE_RADIUS.card,
              GCE_SURFACE.card,
              "border-l-4 border-l-primary p-4"
            )}
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold">{sector.shortLabel}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{sector.label}</p>
            {memberCounts ? (
              <p className="mt-2 text-xs font-medium tabular-nums text-foreground">
                {count ?? 0} member{(count ?? 0) === 1 ? "" : "s"}
              </p>
            ) : null}
            {specialisationsBySector?.[sector.id]?.length ? (
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                {specialisationsBySector[sector.id]!.join(" · ")}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
