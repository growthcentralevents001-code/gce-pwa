"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export function KpiCard({
  label,
  value,
  href,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: string;
  href?: string;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {Icon ? <Icon className="h-4 w-4 text-primary" aria-hidden /> : null}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </>
  );

  const body = (
    <motion.div
      className={cn(GCE_RADIUS.card, GCE_SURFACE.cardInteractive, "p-4", className)}
      whileHover={reduce || !href ? undefined : { y: GCE_MOTION.hoverY }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      {inner}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {body}
      </Link>
    );
  }
  return body;
}
