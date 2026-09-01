"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { extractApiError } from "@/lib/frontend/connect/format";

export function LeadActions({
  leadId,
  workStatus,
  contactAvailable,
  role,
  outcome,
}: {
  leadId: string;
  workStatus: string;
  contactAvailable?: boolean;
  role: "receiver" | "giver" | "both";
  outcome?: {
    status: string;
    giverStatus: string | null;
    receiverStatus: string | null;
  } | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, unknown> | null>(
    null
  );
  const [outcomeOpen, setOutcomeOpen] = useState(false);
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const run = (action: string, body: Record<string, unknown> = {}) => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/lead-assist", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action, leadId, ...body }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(extractApiError(json, "Action failed"));
        }
        if (action === "reveal_contact") {
          setRevealed(json.revealed ?? json);
          setMessage("Contact revealed by server authorization.");
        } else if (action === "submit_outcome") {
          setMessage(
            "Outcome submitted — awaiting dual confirmation. This does not create platform revenue."
          );
          setOutcomeOpen(false);
        } else if (action === "confirm_outcome") {
          setMessage(
            "Outcome confirmed. Closed-business record is not commission, settlement, or payout."
          );
        } else {
          setMessage("Updated.");
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  };

  const receiverActions = role === "receiver" || role === "both";
  const giverActions = role === "giver" || role === "both";

  return (
    <div className="space-y-3">
      {message ? (
        <p className="rounded-xl border border-success/30 bg-success/5 p-3 text-sm">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      {outcome && workStatus === "outcome_pending" ? (
        <p className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          Giver: {outcome.giverStatus ?? "pending"} · Receiver:{" "}
          {outcome.receiverStatus ?? "pending"} — both must confirm before final
          close.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {receiverActions && workStatus === "offered" ? (
          <>
            <Button
              className="min-h-11"
              disabled={pending}
              onClick={() => run("accept")}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              className="min-h-11"
              disabled={pending}
              onClick={() => run("decline", { reason: "Declined by member" })}
            >
              Decline
            </Button>
          </>
        ) : null}
        {receiverActions &&
        ["accepted", "contact_revealed", "in_follow_up"].includes(workStatus) &&
        !contactAvailable ? (
          <Button
            className="min-h-11"
            disabled={pending}
            onClick={() => run("reveal_contact", { reason: "Follow-up" })}
          >
            Request contact reveal
          </Button>
        ) : null}
        {receiverActions &&
        ["accepted", "contact_revealed", "in_follow_up"].includes(workStatus) ? (
          <Button
            variant="secondary"
            className="min-h-11"
            onClick={() => setOutcomeOpen(true)}
          >
            Record outcome
          </Button>
        ) : null}
        {giverActions && workStatus === "outcome_pending" ? (
          <Button
            className="min-h-11"
            disabled={pending}
            onClick={() => run("confirm_outcome", { amountMinor: 0 })}
          >
            Confirm outcome
          </Button>
        ) : null}
      </div>

      {revealed ? (
        <div className="rounded-xl border border-border bg-muted/40 p-3 text-sm">
          <p className="font-medium">Server-authorized contact</p>
          <pre className="mt-2 overflow-x-auto text-xs">
            {JSON.stringify(revealed, null, 2)}
          </pre>
        </div>
      ) : null}

      <Sheet open={outcomeOpen} onOpenChange={setOutcomeOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle>Closed business / outcome</SheetTitle>
          </SheetHeader>
          <p className="mt-2 text-xs text-muted-foreground">
            Dual confirmation may be required. Recording an outcome does not create
            platform revenue, commission, settlement, or payout.
          </p>
          <div className="mt-4 space-y-2">
            <Label htmlFor="outcome-note">Notes</Label>
            <Textarea
              id="outcome-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
          <Button
            className="mt-4 w-full min-h-11"
            disabled={pending}
            onClick={() =>
              run("submit_outcome", {
                amountMinor: 0,
                notes: note.trim() || undefined,
              })
            }
          >
            {pending ? "Submitting…" : "Submit outcome"}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
