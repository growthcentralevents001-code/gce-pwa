"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGated } from "@/components/states/FeatureGated";
import { extractApiError } from "@/lib/frontend/customer/format";

type Eligibility = {
  eligible: boolean;
  reason: string;
  cutoffAt: string;
};

export function BookingActions({
  bookingId,
  bookingStatus,
  eventStartsAt,
  cancelCutoffHours,
}: {
  bookingId: string;
  bookingStatus: string;
  eventStartsAt?: string | null;
  cancelCutoffHours?: number | null;
}) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [eligibility, setEligibility] = useState<Eligibility | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!eventStartsAt || cancelCutoffHours == null) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "evaluate_cancel",
            eventStartsAt,
            cancelCutoffHours,
            bookingStatus,
          }),
        });
        const json = await res.json();
        if (!cancelled && res.ok) {
          setEligibility(json.eligibility ?? null);
        }
      } catch {
        // ignore — cancel button still available; server re-checks
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [eventStartsAt, cancelCutoffHours, bookingStatus]);

  const runCancel = () => {
    if (!reason.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "cancel_booking",
            bookingId,
            reason: reason.trim(),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(extractApiError(json, "Cancellation failed"));
        }
        setCancelOpen(false);
        setMessage("Cancellation submitted. Status updated from the server.");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Cancellation failed");
      }
    });
  };

  const runRefund = () => {
    if (!reason.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "request_refund",
            bookingId,
            reason: reason.trim(),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(extractApiError(json, "Refund request failed"));
        }
        setRefundOpen(false);
        setMessage(
          "Refund request submitted — under review. No refund amount or timeline is promised here."
        );
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Refund request failed");
      }
    });
  };

  const canAttemptCancel = ["confirmed", "paid", "pending_payment"].includes(
    bookingStatus
  );

  return (
    <div className="space-y-3">
      {message ? (
        <p className="rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
          {message}
        </p>
      ) : null}

      {eligibility ? (
        <p className="text-xs text-muted-foreground">
          Cancellation eligibility (server):{" "}
          {eligibility.eligible ? "eligible" : "not eligible"} ·{" "}
          {eligibility.reason.replaceAll("_", " ")} · cutoff{" "}
          {new Date(eligibility.cutoffAt).toLocaleString("en-IN")}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {canAttemptCancel ? (
          <Button
            type="button"
            variant="outline"
            className="min-h-11 touch-manipulation"
            onClick={() => {
              setReason("");
              setError(null);
              setCancelOpen(true);
            }}
          >
            Request cancellation
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="min-h-11 touch-manipulation"
          onClick={() => {
            setReason("");
            setError(null);
            setRefundOpen(true);
          }}
        >
          Request refund review
        </Button>
      </div>

      <Sheet open={cancelOpen} onOpenChange={setCancelOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle>Cancel booking</SheetTitle>
          </SheetHeader>
          <p className="mt-2 text-sm text-muted-foreground">
            Eligibility is re-checked by the server. Cutoff follows this
            event&apos;s policy — not a hardcoded frontend rule.
          </p>
          <div className="mt-4 space-y-2">
            <Label htmlFor="cancel-reason">Reason</Label>
            <Textarea
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="min-h-24"
            />
          </div>
          {error ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            className="mt-4 w-full min-h-11"
            disabled={pending || !reason.trim()}
            onClick={runCancel}
          >
            {pending ? "Submitting…" : "Submit cancellation"}
          </Button>
        </SheetContent>
      </Sheet>

      <Sheet open={refundOpen} onOpenChange={setRefundOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle>Refund request</SheetTitle>
          </SheetHeader>
          <FeatureGated
            className="mt-3"
            mode="unavailable"
            title="Refund economics unresolved"
            description="Submitting a request places it under review. Exact percentage, days, or fee refunds are not calculated or promised in this UI."
          />
          <div className="mt-4 space-y-2">
            <Label htmlFor="refund-reason">Reason</Label>
            <Textarea
              id="refund-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
          {error ? (
            <p className="mt-2 text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button
            className="mt-4 w-full min-h-11"
            disabled={pending || !reason.trim()}
            onClick={runRefund}
          >
            {pending ? "Submitting…" : "Submit for review"}
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}
