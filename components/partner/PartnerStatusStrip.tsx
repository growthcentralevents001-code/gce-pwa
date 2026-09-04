import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export type PartnerStatusItem = {
  id: string;
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning" | "pending" | "error" | "info";
};

/**
 * Compact operational status — wraps at 390, never equal-width colliding cells.
 */
export function PartnerStatusStrip({
  items,
  className,
}: {
  items: PartnerStatusItem[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div
      className={cn(
        GCE_RADIUS.panel,
        GCE_SURFACE.muted,
        "mb-6 grid grid-cols-2 gap-px overflow-hidden sm:flex sm:flex-wrap sm:gap-0 sm:bg-transparent sm:overflow-visible",
        className
      )}
      role="list"
      aria-label="Operational status"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          className="min-w-0 bg-background/80 px-3 py-2 sm:mr-6 sm:bg-transparent sm:px-0 sm:py-0"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <div className="mt-1">
            <StatusBadge label={item.value} tone={item.tone ?? "neutral"} />
          </div>
        </div>
      ))}
    </div>
  );
}
