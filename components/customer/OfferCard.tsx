"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Clock, Store } from "lucide-react";
import { StatusBadge } from "@/components/states/StatusBadge";
import { venueDisplayName } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

export type OfferCardModel = {
  id: string;
  title: string;
  remainingClaims?: number | null;
  claimValidityHours?: number | null;
  customerCap?: number | null;
  venue?: unknown;
  campaignEndsAt?: string | null;
};

/**
 * GCE OfferCard — inspired by 21st.dev Offer/Promo cards (7960, 7941, 8442)
 * Claim ≠ purchase/revenue messaging preserved.
 */
export function OfferCard({
  offer,
  className,
}: {
  offer: OfferCardModel;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const venue = venueDisplayName(offer.venue);
  const remaining = offer.remainingClaims;

  return (
    <motion.article
      className={cn(
        "group overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-orange-50/60 shadow-sm",
        "dark:to-orange-950/20",
        "transition-[box-shadow,transform] duration-300 hover:shadow-lg hover:shadow-orange-950/10",
        "active:scale-[0.99] touch-manipulation",
        className
      )}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <Link
        href={`/customer/offers/${offer.id}`}
        className="block p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <StatusBadge label="Offer" tone="warning" />
          <StatusBadge label="Not a purchase" tone="neutral" />
        </div>
        <h2 className="line-clamp-2 text-base font-semibold text-foreground">
          {offer.title}
        </h2>
        {venue ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Store className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{venue}</span>
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs">
          <span className="font-medium text-foreground">
            {remaining != null
              ? `${remaining} claim${remaining === 1 ? "" : "s"} left`
              : "Limited claims"}
          </span>
          {offer.claimValidityHours != null ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {offer.claimValidityHours}h claim window
            </span>
          ) : null}
        </div>
      </Link>
    </motion.article>
  );
}
