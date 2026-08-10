"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DESK_COPY } from "@/lib/frontend/ops/format";

/**
 * Desk actions — assignment is explicit; candidate ≠ assignment.
 * Contact reveal stays on dedicated server-authorized path.
 */
export function DeskReviewActions({
  queueId,
  leadTitle,
}: {
  queueId: string;
  leadTitle: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState("");
  const [receiverUserId, setReceiverUserId] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function review(opts: { resolve: boolean; assign: boolean }) {
    startTransition(async () => {
      setMsg(null);
      const body: Record<string, unknown> = {
        action: "review_desk",
        queueId,
        notes: notes || undefined,
        resolve: opts.resolve,
      };
      if (opts.assign && receiverUserId.trim()) {
        body.assignReceiverUserId = receiverUserId.trim();
      }
      const res = await fetch("/api/lead-assist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      setMsg(
        res.ok
          ? opts.assign
            ? "Assignment requested via backend eligibility"
            : "Desk review recorded"
          : "Failed — check desk permission / eligibility"
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs text-muted-foreground">{DESK_COPY.candidateNotAssignment}</p>
      <div className="space-y-1.5">
        <Label htmlFor={`notes-${queueId}`}>Review notes</Label>
        <Input
          id={`notes-${queueId}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`recv-${queueId}`}>
          Assign receiver user id (optional — eligibility enforced server-side)
        </Label>
        <Input
          id={`recv-${queueId}`}
          value={receiverUserId}
          onChange={(e) => setReceiverUserId(e.target.value)}
          placeholder="UUID — leave blank to close without assign"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type="button" size="sm" disabled={pending}>
              Resolve without assign
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Resolve desk item</AlertDialogTitle>
              <AlertDialogDescription>
                Close review for “{leadTitle}” without assigning. Circle-first
                routing remains canonical for new leads.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => review({ resolve: true, assign: false })}>
                Confirm resolve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={pending || !receiverUserId.trim()}
            >
              Assign via backend
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Assign opportunity</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Lead: {leadTitle}</p>
                  <p>
                    Assignment goes through backend eligibility. Desk cannot
                    bypass deterministic routing rules.
                  </p>
                  <p className="text-xs">{DESK_COPY.paidOff}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => review({ resolve: true, assign: true })}>
                Confirm assign
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
