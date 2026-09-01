"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * Venue staff confirms customer presence at the venue — separate from redemption.
 */
export function VisitConfirmationPanel({ className }: { className?: string }) {
  const [claimId, setClaimId] = useState("");
  const [token, setToken] = useState("");
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
            action: "confirm_offer_visit",
            claimId,
            presentedToken: token,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            json?.error?.message || json?.message || "Visit confirmation failed"
          );
        }
        setMessage(
          json?.idempotent || json?.data?.idempotent
            ? "Visit already confirmed for this claim (idempotent)."
            : "Customer visit confirmed. Redemption remains a separate step."
        );
        setToken("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Visit confirmation failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h2 className="text-base font-semibold">Confirm visit / presence</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Claim ≠ visit ≠ redemption. Confirm presence only when the customer is at
        your venue with a valid claim token.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="visitClaimId">Claim ID</Label>
          <Input
            id="visitClaimId"
            className="mt-1 min-h-11"
            value={claimId}
            onChange={(e) => setClaimId(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="visitToken">Presented token</Label>
          <Input
            id="visitToken"
            className="mt-1 min-h-11"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
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
        variant="outline"
        disabled={pending || claimId.length < 8 || token.length < 8}
        onClick={submit}
      >
        {pending ? "Confirming…" : "Confirm visit"}
      </Button>
    </div>
  );
}
