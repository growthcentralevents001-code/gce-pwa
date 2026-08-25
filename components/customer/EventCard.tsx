"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { CalendarDays, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/states/StatusBadge";
import {
  formatInrMinor,
  formatWhen,
  venueDisplayName,
} from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

export type EventCardModel = {
  id: string;
  title: string;
  category?: string | null;
  startsAt?: string | null;
  priceMinor?: number | null;
  currency?: string | null;
  venue?: unknown;
};

/**
 * GCE EventCard — inspired by 21st.dev hover reveal / image cards (1816, 2830)
 * adapted to MASTER tokens + mobile-first (no hover required).
 */
export function EventCard({
  event,
  href,
  className,
}: {
  event: EventCardModel;
  href?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const venue = venueDisplayName(event.venue);
  const price = formatInrMinor(event.priceMinor, event.currency ?? "INR");
  const to = href ?? `/customer/events/${event.id}`;

  return (
    <motion.article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm",
        "transition-[box-shadow,transform] duration-300",
        "hover:shadow-lg hover:shadow-orange-950/10",
        "active:scale-[0.99] touch-manipulation",
        className
      )}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <Link
        href={to}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 dark:from-orange-950/40 dark:via-neutral-900 dark:to-orange-950/20">
          <div
            className={cn(
              "absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,88,12,0.25),transparent_55%)]",
              !reduce &&
                "transition-transform duration-500 group-hover:scale-105"
            )}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10">
            {event.category ? (
              <StatusBadge label={event.category} tone="info" className="mb-1" />
            ) : null}
            <h2 className="line-clamp-2 text-base font-semibold text-white drop-shadow-sm">
              {event.title}
            </h2>
          </div>
        </div>
        <div className="space-y-2 p-3.5">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{formatWhen(event.startsAt)}</span>
          </div>
          {venue ? (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="line-clamp-1">{venue}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-foreground">{price}</span>
            <span className="text-xs font-medium text-primary opacity-90 transition-opacity group-hover:opacity-100">
              View →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
