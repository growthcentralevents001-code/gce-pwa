"use client";

import { useEffect, useState } from "react";
import { QrDisplay } from "@/components/customer/QrDisplay";
import { ExpiryCountdown } from "@/components/customer/ExpiryCountdown";
import { Skeleton } from "@/components/ui/skeleton";
import { extractApiError } from "@/lib/frontend/customer/format";

type TicketPayload = {
  ticketId: string;
  ticketRef: string;
  status: string;
  displayToken: string | null;
  displayable: boolean;
  reason: "ok" | "already_used" | "invalid" | "unavailable";
};

type ClaimPayload = {
  claimId: string;
  status: string;
  expiresAt: string;
  displayToken: string | null;
  displayable: boolean;
  reason: "ok" | "expired" | "redeemed" | "invalid" | "unavailable";
};

function ticketMessage(reason: TicketPayload["reason"], status: string) {
  if (reason === "already_used") {
    return "This ticket has already been checked in.";
  }
  if (reason === "invalid") {
    return status === "cancelled"
      ? "This ticket was cancelled and cannot be used for check-in."
      : "This ticket is no longer valid for venue check-in.";
  }
  return "Your pass could not be loaded. Try again or contact support.";
}

function claimMessage(reason: ClaimPayload["reason"]) {
  if (reason === "expired") return "This claim has expired.";
  if (reason === "redeemed") return "This claim has already been redeemed.";
  if (reason === "invalid") return "This claim is no longer valid.";
  return "Your claim code could not be loaded. Try again or contact support.";
}

export function OwnerCredentialReveal({
  kind,
  id,
  expiresAt,
}: {
  kind: "ticket" | "claim";
  id: string;
  expiresAt?: string | null;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<TicketPayload | null>(null);
  const [claim, setClaim] = useState<ClaimPayload | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    const view = kind === "ticket" ? "ticket_credential" : "claim_credential";
    fetch(`/api/customer?view=${view}&id=${encodeURIComponent(id)}`, {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
      signal: ac.signal,
      headers: { "cache-control": "no-store" },
    })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          throw new Error(
            kind === "ticket"
              ? "You cannot view this ticket."
              : "You cannot view this claim."
          );
        }
        if (!res.ok) {
          throw new Error(
            extractApiError(
              json,
              kind === "ticket"
                ? "Your pass could not be loaded. Try again or contact support."
                : "Your claim code could not be loaded. Try again or contact support."
            )
          );
        }
        if (kind === "ticket") {
          setTicket(json.credential as TicketPayload);
          setClaim(null);
        } else {
          setClaim(json.credential as ClaimPayload);
          setTicket(null);
        }
        setError(null);
      })
      .catch((e: unknown) => {
        if (ac.signal.aborted) return;
        setError(
          e instanceof Error
            ? e.message
            : "Your pass could not be loaded. Try again or contact support."
        );
      })
      .finally(() => {
        if (!ac.signal.aborted) setLoading(false);
      });
    return () => ac.abort();
  }, [kind, id]);

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-live="polite">
        <p className="text-sm text-muted-foreground">Loading venue pass…</p>
        <Skeleton className="mx-auto h-[200px] w-[200px] rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }

  if (kind === "ticket" && ticket) {
    if (!ticket.displayable || !ticket.displayToken) {
      return (
        <p className="text-sm text-muted-foreground" role="status">
          {ticketMessage(ticket.reason, ticket.status)}
        </p>
      );
    }
    return (
      <div className="space-y-3">
        <p className="sr-only">
          Ticket {ticket.ticketRef} is {ticket.status}. Present the code at the
          venue for check-in.
        </p>
        <QrDisplay
          value={ticket.displayToken}
          label="Present this code at the venue for check-in"
        />
      </div>
    );
  }

  if (kind === "claim" && claim) {
    if (!claim.displayable || !claim.displayToken) {
      return (
        <p className="text-sm text-muted-foreground" role="status">
          {claimMessage(claim.reason)}
        </p>
      );
    }
    const exp = expiresAt ?? claim.expiresAt;
    return (
      <div className="space-y-3">
        <p className="sr-only">
          Offer claim is {claim.status}. Present the code at the venue for
          redemption.
        </p>
        {exp ? (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Expires</span>
            <ExpiryCountdown expiresAt={exp} />
          </div>
        ) : null}
        <QrDisplay
          value={claim.displayToken}
          label="Present this code at the venue for redemption"
        />
      </div>
    );
  }

  return (
    <p className="text-sm text-muted-foreground" role="status">
      Your pass could not be loaded. Try again or contact support.
    </p>
  );
}
