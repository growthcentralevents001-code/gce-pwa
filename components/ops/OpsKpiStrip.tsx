"use client";

import { KpiCard, type KpiIconName } from "@/components/connect/KpiCard";
import { cn } from "@/lib/utils";

export type OpsKpiItem = {
  label: string;
  value: number | string;
  href?: string;
  icon?: KpiIconName;
  hint?: string;
};

/** Dense actionable KPI strip — no fake growth/GMV metrics. */
export function OpsKpiStrip({
  items,
  className,
}: {
  items: OpsKpiItem[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      {items.map((item) => (
        <KpiCard
          key={item.label}
          label={item.label}
          value={String(item.value)}
          href={item.href}
          icon={item.icon}
          hint={item.hint}
        />
      ))}
    </div>
  );
}
