"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NON_PURCHASE_REASON_CODES } from "@/lib/architecture/customer-cx/constants";
import { extractApiError } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

const LABELS: Record<(typeof NON_PURCHASE_REASON_CODES)[number], string> = {
  out_of_stock: "Out of stock",
  price_too_high: "Price too high",
  quality_issue: "Quality issue",
  changed_mind: "Changed mind",
  timing: "Timing",
  other: "Other",
};

/** Submits canonical reason codes only — no client-side rank/penalty math. */
export function NonPurchaseFeedback({
  offerEventId,
  claimId,
  className,
}: {
  offerEventId?: string | null;
  claimId?: string | null;
  className?: string;
}) {
  const [reasonCode, setReasonCode] =
    useState<(typeof NON_PURCHASE_REASON_CODES)[number]>("changed_mind");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const onSubmit = () => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "non_purchase_reason",
            contextType: "offer_claim",
            contextId: claimId ?? null,
            offerEventId: offerEventId ?? null,
            reasonCode,
            note: note.trim() || null,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(extractApiError(json, "Could not submit feedback"));
        }
        setDone(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Submit failed");
      }
    });
  };

  if (done) {
    return (
      <p className={cn("rounded-lg border border-border bg-muted/40 p-3 text-sm", className)}>
        Thanks — feedback recorded. Any rank effects are decided by the server.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3 rounded-xl border border-border p-4", className)}>
      <h3 className="text-sm font-semibold">Didn&apos;t purchase?</h3>
      <p className="text-xs text-muted-foreground">
        Optional feedback for this offer visit. Rank impact is not calculated here.
      </p>
      <fieldset className="space-y-2">
        <legend className="sr-only">Reason</legend>
        {NON_PURCHASE_REASON_CODES.map((code) => (
          <label
            key={code}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-transparent px-2 hover:bg-muted/50 touch-manipulation"
          >
            <input
              type="radio"
              name="reason"
              value={code}
              checked={reasonCode === code}
              onChange={() => setReasonCode(code)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm">{LABELS[code]}</span>
          </label>
        ))}
      </fieldset>
      <div>
        <Label htmlFor="np-note">Note (optional)</Label>
        <Textarea
          id="np-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mt-1"
          rows={2}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        variant="secondary"
        className="min-h-11 w-full"
        disabled={pending}
        onClick={onSubmit}
      >
        {pending ? "Sending…" : "Submit reason"}
      </Button>
    </div>
  );
}
