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
 * Canonical partner status strip — Checkpoint C.
 * Compact operational state row under PageHeader.
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
        GCE_RADIUS.card,
        GCE_SURFACE.glassLight,
        "mb-6 flex flex-wrap gap-3 p-3 sm:p-4",
        className
      )}
      role="list"
      aria-label="Operational status"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          className="flex min-w-0 flex-1 flex-col gap-1 rounded-xl border border-border/60 bg-background/70 px-3 py-2"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <StatusBadge label={item.value} tone={item.tone ?? "neutral"} />
        </div>
      ))}
    </div>
  );
}
