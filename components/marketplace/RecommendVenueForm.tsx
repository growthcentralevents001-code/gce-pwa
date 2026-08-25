"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function RecommendVenueForm({
  unitId,
  organisationId,
  className,
}: {
  unitId: string;
  organisationId?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [orgId, setOrgId] = useState(organisationId ?? "");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
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
            action: "create_venue",
            organisationId: orgId,
            displayName,
            city,
            recommendUnitId: unitId,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            json?.error?.message || json?.message || "Recommend failed"
          );
        }
        setOk(
          "Venue submitted as a recommendation. Marketplace Ops must final-approve. You cannot self-approve."
        );
        setDisplayName("");
        setCity("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Recommend failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h3 className="text-sm font-semibold">Recommend a Venue</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Recommend only — no city ownership. Platform Marketplace Ops final-approves.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="rec-org">Organisation ID</Label>
          <Input
            id="rec-org"
            className="mt-1 min-h-11"
            value={orgId}
            onChange={(e) => setOrgId(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="rec-name">Venue display name</Label>
          <Input
            id="rec-name"
            className="mt-1 min-h-11"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="rec-city">City (operating location, not exclusive territory)</Label>
          <Input
            id="rec-city"
            className="mt-1 min-h-11"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
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
        disabled={pending || !orgId || !displayName || !city}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Submit recommendation"}
      </Button>
    </div>
  );
}
