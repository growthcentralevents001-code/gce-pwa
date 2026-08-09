"use client";

import { motion, useReducedMotion } from "motion/react";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GCE_MOTION, GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * MemberCard — same family as EventCard/OfferCard (radius, border, shadow, motion).
 * Inspired by 21st.dev profile cards (2593, 5629) without neon/glow.
 */
export function MemberCard({
  name,
  specialisation,
  sectorLabel,
  tagLabels,
  status,
  className,
}: {
  name: string;
  specialisation?: string | null;
  sectorLabel?: string | null;
  tagLabels?: string[];
  status?: string | null;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <motion.article
      className={cn(GCE_RADIUS.card, GCE_SURFACE.cardInteractive, "p-4", className)}
      whileHover={reduce ? undefined : { y: GCE_MOTION.hoverY }}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11 border border-border">
          <AvatarFallback className="bg-orange-100 text-sm font-semibold text-primary dark:bg-orange-950">
            {initials || "M"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">{name}</h3>
          {specialisation ? (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {specialisation}
            </p>
          ) : null}
          {sectorLabel ? (
            <p className="mt-1 text-[11px] text-muted-foreground">{sectorLabel}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {status ? <StatusBadge label={status} tone="neutral" /> : null}
            {(tagLabels ?? []).slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
