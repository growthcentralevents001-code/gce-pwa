"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusBadge } from "@/components/states/StatusBadge";
import {
  associatePlanLabel,
  membershipStatusTone,
  allocationStatusTone,
} from "@/lib/frontend/connect/format";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * MembershipCard — 21st.dev community/KPI inspiration adapted to GCE orange language.
 */
export function MembershipCard({
  status,
  allocationStatus,
  tagCount,
  businessName,
  specialisationLabel,
  href = "/connect/membership",
  className,
}: {
  status: string;
  allocationStatus: string;
  tagCount?: number;
  businessName?: string | null;
  specialisationLabel?: string | null;
  href?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={cn(GCE_RADIUS.card, GCE_SURFACE.cardInteractive, "overflow-hidden", className)}
      whileHover={reduce ? undefined : { y: GCE_MOTION.hoverY }}
    >
      <Link
        href={href}
        className="block p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className={cn("mb-4 h-1.5 w-16 rounded-full bg-primary", GCE_RADIUS.chip)} />
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          GCE Connect
        </p>
        <h2 className="mt-1 text-lg font-semibold">{associatePlanLabel()}</h2>
        {businessName ? (
          <p className="mt-1 text-sm text-foreground">{businessName}</p>
        ) : null}
        {specialisationLabel ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{specialisationLabel}</p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge label={status} tone={membershipStatusTone(status)} />
          <StatusBadge
            label={allocationStatus.replaceAll("_", " ")}
            tone={allocationStatusTone(allocationStatus)}
          />
        </div>
        {tagCount != null ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Active Tags · {tagCount} / 4
          </p>
        ) : null}
        <p className="mt-4 text-xs text-muted-foreground">
          Payment does not equal activation · activation does not equal Circle
          allocation
        </p>
      </Link>
    </motion.article>
  );
}
