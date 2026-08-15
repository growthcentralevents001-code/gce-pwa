"use client";

import { useEffect, useState } from "react";
import { QrDisplay } from "@/components/customer/QrDisplay";
import { OwnerCredentialReveal } from "@/components/customer/OwnerCredentialReveal";
import { takeBookingQrTokens } from "@/lib/frontend/customer/format";

/**
 * Confirmation-session tokens if still in memory; otherwise owner-authorized
 * server redisplay. Session storage is never the source of truth.
 */
export function BookingQrReveal({ bookingId }: { bookingId: string }) {
  const [sessionTokens] = useState(
    () => takeBookingQrTokens(bookingId) ?? []
  );
  const [ticketIds, setTicketIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (sessionTokens.length > 0) return;
    let cancelled = false;
    fetch("/api/customer?view=tickets", {
      cache: "no-store",
      credentials: "same-origin",
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        const list = Array.isArray(json.tickets) ? json.tickets : [];
        const ids = list
          .filter(
            (t: { booking_id?: string; status?: string; id?: string }) =>
              t.booking_id === bookingId && t.id
          )
          .map((t: { id: string }) => t.id);
        if (!cancelled) setTicketIds(ids);
      })
      .catch(() => {
        if (!cancelled) setTicketIds([]);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId, sessionTokens.length]);

  if (sessionTokens.length > 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-medium">
          Present these codes at the venue. You can reopen them later from
          Tickets.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {sessionTokens.map((t, i) => (
            <QrDisplay
              key={`${i}-${t.length}`}
              value={t}
              label={`Ticket ${i + 1} — present at venue`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (ticketIds === null) {
    return (
      <p className="text-sm text-muted-foreground" aria-busy="true">
        Loading venue pass…
      </p>
    );
  }

  if (ticketIds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        No tickets on this booking yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {ticketIds.map((id) => (
        <OwnerCredentialReveal key={id} kind="ticket" id={id} />
      ))}
    </div>
  );
}
