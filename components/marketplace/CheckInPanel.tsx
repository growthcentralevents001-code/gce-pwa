"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * Utility-first check-in — server validates token via /api/customer.
 * Frontend never marks a ticket valid from QR parse alone.
 */
export function CheckInPanel({ className }: { className?: string }) {
  const [ticketId, setTicketId] = useState("");
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
            action: "check_in_ticket",
            ticketId,
            presentedToken: token,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            json?.error?.message || json?.message || "Check-in failed"
          );
        }
        setMessage("Check-in recorded by server.");
        setToken("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Check-in failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h2 className="text-base font-semibold">Ticket check-in</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Enter ticket ID and presented token. Validation is server-authorized —
        scanning alone does not prove validity.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="ticketId">Ticket ID</Label>
          <Input
            id="ticketId"
            className="mt-1 min-h-11"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="presentedToken">Presented token</Label>
          <Input
            id="presentedToken"
            className="mt-1 min-h-11"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
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
        className="mt-4 min-h-12 w-full sm:w-auto"
        disabled={pending || ticketId.length < 8 || token.length < 8}
        onClick={submit}
      >
        {pending ? "Verifying…" : "Check in"}
      </Button>
    </div>
  );
}
