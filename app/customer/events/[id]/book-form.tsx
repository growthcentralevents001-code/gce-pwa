"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function BookEventForm({
  eventId,
  policyVersion,
}: {
  eventId: string;
  policyVersion: string;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<string[] | null>(null);
  const [pending, startTransition] = useTransition();

  const onBook = () => {
    setError(null);
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
            idempotencyKey: `cx-${eventId}-${Date.now()}`,
          }),
        });
        const createJson = await createRes.json();
        if (!createRes.ok) {
          throw new Error(createJson?.error?.message ?? "Booking failed");
        }
        const bookingId = createJson.booking.id as string;
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
          throw new Error(confirmJson?.error?.message ?? "Confirm failed");
        }
        setTokens(confirmJson.qrTokens ?? []);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Booking failed");
      }
    });
  };

  return (
    <div className="mt-6 space-y-3">
      <label className="block text-sm">
        Quantity
        <input
          type="number"
          min={1}
          max={10}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value) || 1)}
          className="mt-1 w-24 rounded border border-neutral-300 px-2 py-1"
        />
      </label>
      <p className="text-xs text-neutral-500">
        By booking you accept the cancellation policy shown above. Sandbox
        confirmation is used while live ticket payments remain OFF.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={onBook}
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Booking…" : "Book (sandbox confirm)"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {tokens && tokens.length > 0 ? (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm">
          <p className="font-medium">Tickets issued</p>
          <p className="mt-1 text-xs">
            Save QR tokens now (shown once): {tokens.join(", ")}
          </p>
          <a href="/customer/tickets" className="mt-2 inline-block underline">
            View ticket history
          </a>
        </div>
      ) : null}
    </div>
  );
}
