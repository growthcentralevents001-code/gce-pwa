import { Building2, Factory, Briefcase, HeartHandshake } from "lucide-react";
import { GC_POWER_SECTORS } from "@/lib/frontend/design-language";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

const ICONS = [Building2, Factory, Briefcase, HeartHandshake] as const;

/**
 * GC Power Sectors — four fixed sectors (FD-030).
 * Differentiation via icon + typography + orange tonal borders — not rainbow.
 */
export function PowerSectorGrid({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {GC_POWER_SECTORS.map((sector, i) => {
        const Icon = ICONS[i] ?? Building2;
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
          </article>
        );
      })}
    </div>
  );
}
