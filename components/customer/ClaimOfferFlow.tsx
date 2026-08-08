"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { QrDisplay } from "@/components/customer/QrDisplay";
import { ExpiryCountdown } from "@/components/customer/ExpiryCountdown";
import { Button } from "@/components/ui/button";
import {
  extractApiError,
  stashClaimToken,
} from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

export function ClaimOfferFlow({
  offerEventId,
  className,
}: {
  offerEventId: string;
  className?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClaim = () => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "claim_offer",
            offerEventId,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(extractApiError(json, "Claim failed"));
        }
        const raw = (json.rawClaimToken as string | undefined) ?? null;
        const id = (json.claim?.id as string | undefined) ?? null;
        const exp = (json.claim?.expires_at as string | undefined) ?? null;
        setToken(raw);
        setClaimId(id);
        setExpiresAt(exp);
        if (id && raw) stashClaimToken(id, raw, exp);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Claim failed");
      }
    });
  };

  if (token) {
    return (
      <motion.div
        className={cn("space-y-4 rounded-2xl border border-success/30 bg-success/5 p-4", className)}
        initial={reduce ? false : { scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            Claim issued
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Not a purchase · not recognised revenue. Show this code at the venue.
            Venue staff complete redemption.
          </p>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="text-muted-foreground">Expires</span>
          <ExpiryCountdown expiresAt={expiresAt} />
        </div>
        <QrDisplay value={token} label="Present to venue for redemption" />
        <Button asChild variant="outline" className="w-full min-h-11">
          <a href={claimId ? `/customer/claims?focus=${claimId}` : "/customer/claims"}>
            View my claims
          </a>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Button
        type="button"
        className="min-h-12 w-full touch-manipulation"
        disabled={pending}
        onClick={onClaim}
      >
        {pending ? "Claiming…" : "Claim offer"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
