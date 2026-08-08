"use client";

import { useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { QuantityStepper } from "@/components/customer/QuantityStepper";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  extractApiError,
  formatInrMinor,
  stashBookingQrTokens,
} from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

/**
 * Canonical booking flow — create_booking → confirm_booking_sandbox.
 * Never fakes paid success; never trusts client inventory.
 */
export function BookingFlow({
  eventId,
  eventTitle,
  policyVersion,
  policyNote,
  cutoffHours,
  priceMinor,
  currency = "INR",
  maxQuantity = 10,
  className,
}: {
  eventId: string;
  eventTitle: string;
  policyVersion: string;
  policyNote?: string;
  cutoffHours?: number | null;
  priceMinor?: number | null;
  currency?: string;
  maxQuantity?: number;
  className?: string;
}) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const policyId = useId();
  const [qty, setQty] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const submitting = useRef(false);

  const unit = Number(priceMinor ?? 0);
  const totalLabel = formatInrMinor(unit * qty, currency);

  const onSubmit = () => {
    if (submitting.current || pending) return;
    if (!accepted) {
      setError("Please acknowledge the cancellation policy to continue.");
      return;
    }
    setError(null);
    submitting.current = true;
    startTransition(async () => {
      try {
        const createRes = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "create_booking",
            eventId,
            quantity: qty,
            acceptPolicyVersion: policyVersion,
            idempotencyKey: `cx-${eventId}-${crypto.randomUUID()}`,
          }),
        });
        const createJson = await createRes.json();
        if (!createRes.ok) {
          throw new Error(
            extractApiError(createJson, "Booking could not be created")
          );
        }
        const bookingId = createJson.booking?.id as string | undefined;
        if (!bookingId) throw new Error("Booking reference missing");

        const confirmRes = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "confirm_booking_sandbox",
            bookingId,
          }),
        });
        const confirmJson = await confirmRes.json();
        if (!confirmRes.ok) {
          throw new Error(
            extractApiError(confirmJson, "Could not confirm booking")
          );
        }
        const tokens = Array.isArray(confirmJson.qrTokens)
          ? (confirmJson.qrTokens as string[])
          : [];
        stashBookingQrTokens(bookingId, tokens);
        router.push(`/customer/bookings/${bookingId}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Booking failed");
      } finally {
        submitting.current = false;
      }
    });
  };

  return (
    <motion.div
      className={cn("space-y-6", className)}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="text-lg font-semibold">{eventTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatInrMinor(priceMinor, currency)} each · total {totalLabel}
        </p>
      </div>

      <div>
        <Label className="mb-2 block">Quantity</Label>
        <QuantityStepper
          value={qty}
          onChange={setQty}
          min={1}
          max={Math.min(20, maxQuantity)}
          disabled={pending}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Availability is confirmed by the server when you submit.
        </p>
      </div>

      <FeatureGated
        mode="disabled_in_environment"
        title="Ticket payments gated"
        description="Live Marketplace ticket payments remain OFF. Eligible bookings use sandbox confirmation — not a paid capture."
      />

      <div className="rounded-xl border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        Cancellation cutoff: {cutoffHours != null ? `${cutoffHours}h` : "per event"}{" "}
        before start (policy {policyVersion}). {policyNote}
      </div>

      <div className="flex items-start gap-3">
        <Checkbox
          id={policyId}
          checked={accepted}
          onCheckedChange={(v) => setAccepted(v === true)}
          disabled={pending}
          className="mt-1"
        />
        <Label htmlFor={policyId} className="text-sm font-normal leading-snug">
          I acknowledge the cancellation policy shown for this event.
        </Label>
      </div>

      <Button
        type="button"
        className="min-h-12 w-full touch-manipulation"
        disabled={pending || !accepted}
        onClick={onSubmit}
      >
        {pending ? "Confirming…" : "Confirm booking (sandbox)"}
      </Button>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}
