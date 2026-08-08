"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusBadge } from "@/components/states/StatusBadge";
import { ExpiryCountdown } from "@/components/customer/ExpiryCountdown";
import { claimStatusTone } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ActiveClaimCardModel = {
  id: string;
  status: string;
  expiresAt?: string | null;
  offerTitle?: string | null;
  expired?: boolean;
};

/**
 * ActiveClaimCard — countdown from backend expires_at only.
 * Inspired by 21st.dev reward/redeem surfaces (5247, 7767).
 */
export function ActiveClaimCard({
  claim,
  className,
}: {
  claim: ActiveClaimCardModel;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const expired = Boolean(claim.expired);

  return (
    <motion.article
      className={cn(
        "rounded-2xl border border-border bg-card/90 p-4 shadow-sm backdrop-blur-sm",
        !expired && "border-warning/40 bg-warning/5",
        className
      )}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">
            {claim.offerTitle ?? "Offer claim"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Claim is not a purchase · not revenue
          </p>
        </div>
        <StatusBadge
          label={expired ? "expired" : claim.status}
          tone={claimStatusTone(claim.status, expired)}
        />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Time remaining
          </p>
          <ExpiryCountdown expiresAt={claim.expiresAt} />
        </div>
        <Button asChild size="sm" className="min-h-11 touch-manipulation">
          <Link href={`/customer/claims?focus=${claim.id}`}>Open claim</Link>
        </Button>
      </div>
    </motion.article>
  );
}
