"use client";

import { useState, useTransition } from "react";

export function ClaimOfferForm({ offerEventId }: { offerEventId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onClaim = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/customer", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "claim_offer",
            offerEventId,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error?.message ?? "Claim failed");
        }
        setToken(json.rawClaimToken ?? null);
        setExpiresAt(json.claim?.expires_at ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Claim failed");
      }
    });
  };

  return (
    <div className="mt-6 space-y-3">
      <button
        type="button"
        disabled={pending}
        onClick={onClaim}
        className="rounded bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? "Claiming…" : "Claim offer"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {token ? (
        <div className="rounded border border-green-200 bg-green-50 p-3 text-sm">
          <p className="font-medium">Claim issued (not revenue)</p>
          <p className="mt-1 text-xs break-all">Token (save now): {token}</p>
          {expiresAt ? (
            <p className="mt-1 text-xs">
              Expires {new Date(expiresAt).toLocaleString("en-IN")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
