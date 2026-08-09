"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusBadge } from "@/components/states/StatusBadge";
import {
  circleCapacityLabel,
  formatConstitutionLabel,
  formatLifecycleLabel,
} from "@/lib/frontend/connect/format";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function CircleCard({
  name,
  city,
  lifecycleStatus,
  constitutionStatus,
  activeSeatCount,
  capacityMax,
  href = "/connect/circle",
  className,
}: {
  name: string;
  city?: string | null;
  lifecycleStatus: string;
  constitutionStatus: string;
  activeSeatCount: number;
  capacityMax: number;
  href?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const cap = circleCapacityLabel(activeSeatCount, capacityMax);
  const pct = Math.min(100, Math.round((activeSeatCount / Math.max(capacityMax, 1)) * 100));

  return (
    <motion.article
      className={cn(GCE_RADIUS.card, GCE_SURFACE.cardInteractive, className)}
      whileHover={reduce ? undefined : { y: GCE_MOTION.hoverY }}
    >
      <Link
        href={href}
        className="block p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <h2 className="text-lg font-semibold">{name}</h2>
        {city ? (
          <p className="mt-1 text-sm text-muted-foreground">{city}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge
            label={formatLifecycleLabel(lifecycleStatus)}
            tone="pending"
          />
          <StatusBadge
            label={formatConstitutionLabel(constitutionStatus)}
            tone="neutral"
          />
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs">
            <span className="text-muted-foreground">Capacity</span>
            <span className="font-medium tabular-nums">{cap}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={activeSeatCount}
              aria-valuemin={0}
              aria-valuemax={capacityMax}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Dual status model · max 40 · no seat 41
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
