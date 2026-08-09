"use client";

import { motion, useReducedMotion } from "motion/react";
import { Progress } from "@/components/ui/progress";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * Target progress module — displays backend-provided credited/target values.
 * Does not calculate Circle credit eligibility.
 */
export function TargetProgressCard({
  title = "Circle target",
  credited,
  target,
  monthsElapsed,
  targetMonths,
  achievedAt,
  creditNote = "Formal target credit occurs once at 15 approved + paid members. Not again at 20 or 40.",
  className,
}: {
  title?: string;
  credited: number;
  target: number;
  monthsElapsed?: number | null;
  targetMonths?: number;
  achievedAt?: string | null;
  creditNote?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const safeTarget = Math.max(target, 1);
  const pct = Math.min(100, Math.round((credited / safeTarget) * 100));

  return (
    <motion.section
      className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: GCE_MOTION.entranceMs / 1000 }}
      aria-labelledby="target-progress-title"
    >
      <h2 id="target-progress-title" className="text-base font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {credited} of {target} credited Circles
        {typeof targetMonths === "number" ? ` · ${targetMonths}-month window` : null}
        {typeof monthsElapsed === "number" ? ` · ${monthsElapsed} months elapsed` : null}
      </p>
      <div className="mt-4">
        <Progress value={pct} aria-label={`Target progress ${pct}%`} className="h-2.5" />
        <p className="mt-2 text-xs tabular-nums text-muted-foreground">{pct}%</p>
      </div>
      {achievedAt ? (
        <p className="mt-3 text-sm text-success">
          Target achieved {new Date(achievedAt).toLocaleDateString("en-IN")}
        </p>
      ) : null}
      <p className="mt-3 text-[11px] text-muted-foreground">{creditNote}</p>
    </motion.section>
  );
}
