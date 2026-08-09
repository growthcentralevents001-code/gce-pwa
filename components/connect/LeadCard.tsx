"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusBadge } from "@/components/states/StatusBadge";
import { leadStatusTone } from "@/lib/frontend/connect/format";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * LeadCard — CRM inspiration filtered to GCE card language (no blue CRM theme).
 */
export function LeadCard({
  id,
  title,
  workStatus,
  city,
  urgency,
  href,
  className,
}: {
  id: string;
  title: string;
  workStatus: string;
  city?: string | null;
  urgency?: string | null;
  href?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const to = href ?? `/connect/leads/${id}`;

  return (
    <motion.article
      className={cn(GCE_RADIUS.card, GCE_SURFACE.cardInteractive, className)}
      whileHover={reduce ? undefined : { y: GCE_MOTION.hoverY }}
    >
      <Link
        href={to}
        className="block p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-sm font-semibold">{title}</h3>
          <StatusBadge
            label={workStatus.replaceAll("_", " ")}
            tone={leadStatusTone(workStatus)}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {[city, urgency].filter(Boolean).join(" · ") || "Lead Assist"}
        </p>
      </Link>
    </motion.article>
  );
}
