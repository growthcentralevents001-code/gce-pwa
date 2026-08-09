"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function VenueAttributionProposeForm({
  unitId,
  className,
}: {
  unitId: string;
  className?: string;
}) {
  const router = useRouter();
  const [venueId, setVenueId] = useState("");
  const [basis, setBasis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setOk(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/marketplace/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "propose_attribution",
            unitId,
            venueId,
            basis: basis || undefined,
            provenance: "mbdp_propose",
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Propose failed");
        }
        setOk(
          "Attribution proposed. Platform confirms — Marketplace BDP cannot self-approve."
        );
        setVenueId("");
        setBasis("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Propose failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h3 className="text-sm font-semibold">Propose Venue attribution</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Recommend / propose only. Organic/unattributed Venues remain valid.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="venueId">Venue ID</Label>
          <Input
            id="venueId"
            className="mt-1 min-h-11"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="basis">Basis</Label>
          <Textarea
            id="basis"
            className="mt-1"
            value={basis}
            onChange={(e) => setBasis(e.target.value)}
            rows={3}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="mt-3 text-sm text-success" role="status">
          {ok}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4 min-h-11"
        disabled={pending || !venueId}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Propose attribution"}
      </Button>
    </div>
  );
}
