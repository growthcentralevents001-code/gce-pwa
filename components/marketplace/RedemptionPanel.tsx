"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * Redemption panel — claim/redemption ≠ revenue unless saleConfirmed + backend.
 */
export function RedemptionPanel({ className }: { className?: string }) {
  const [claimId, setClaimId] = useState("");
  const [token, setToken] = useState("");
  const [saleConfirmed, setSaleConfirmed] = useState(false);
  const [saleReference, setSaleReference] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "redeem_offer",
            claimId,
            presentedToken: token,
            saleConfirmed,
            saleReference: saleReference || undefined,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            json?.error?.message || json?.message || "Redemption failed"
          );
        }
        setMessage(
          saleConfirmed
            ? "Redemption recorded. Sale confirmation sent to server — not automatic revenue."
            : "Claim redeemed. Conversion/sale remains separate unless confirmed."
        );
        setToken("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Redemption failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h2 className="text-base font-semibold">Offer redemption</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Keep Claim, Redemption, Conversion/Sale, and Revenue distinct. Server
        validates the presented token.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="claimId">Claim ID</Label>
          <Input
            id="claimId"
            className="mt-1 min-h-11"
            value={claimId}
            onChange={(e) => setClaimId(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="redeemToken">Presented token</Label>
          <Input
            id="redeemToken"
            className="mt-1 min-h-11"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={saleConfirmed}
            onCheckedChange={(v) => setSaleConfirmed(v === true)}
          />
          Confirm conversion / sale separately
        </label>
        {saleConfirmed ? (
          <div>
            <Label htmlFor="saleRef">Sale reference (optional)</Label>
            <Input
              id="saleRef"
              className="mt-1 min-h-11"
              value={saleReference}
              onChange={(e) => setSaleReference(e.target.value)}
            />
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-3 text-sm text-success" role="status">
          {message}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4 min-h-12"
        disabled={pending || claimId.length < 8 || token.length < 8}
        onClick={submit}
      >
        {pending ? "Redeeming…" : "Redeem claim"}
      </Button>
    </div>
  );
}
