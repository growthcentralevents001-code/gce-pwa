"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function AttributionProposeForm({
  unitId,
  className,
}: {
  unitId: string;
  className?: string;
}) {
  const router = useRouter();
  const [membershipId, setMembershipId] = useState("");
  const [basis, setBasis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setOk(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/connect/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "propose_attribution",
            unitId,
            membershipId,
            basis: basis || undefined,
            provenance: "connect_bdp_propose",
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Propose failed");
        }
        setOk("Attribution proposed. Platform confirmation is required — self-approval is not allowed.");
        setMembershipId("");
        setBasis("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Propose failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h3 className="text-sm font-semibold">Propose member attribution</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        System proposes → Connect BDP assists → Platform confirms. Organic /
        unattributed membership remains valid.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="membershipId">Membership ID</Label>
          <Input
            id="membershipId"
            className="mt-1 min-h-11"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            placeholder="UUID"
            required
          />
        </div>
        <div>
          <Label htmlFor="basis">Basis (optional)</Label>
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
        disabled={pending || !membershipId}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Propose attribution"}
      </Button>
    </div>
  );
}
