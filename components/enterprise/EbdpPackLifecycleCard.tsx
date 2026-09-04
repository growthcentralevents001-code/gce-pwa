"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import {
  ebdpPackageOptionLabel,
  ENTERPRISE_BDP_ROLE_LABEL,
} from "@/lib/frontend/enterprise/format";
import { cn } from "@/lib/utils";

type PackRow = {
  id: string;
  application_status: string;
  package_option: string;
  terms_accepted_at?: string | null;
  payment_intent_id?: string | null;
  offline_payment_ref?: string | null;
  created_at?: string | null;
};

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    submitted: "Submitted — accept terms",
    pending_payment: "Pending payment evidence",
    pending_approval: "Pending Platform approval",
    active: "Active",
    rejected: "Rejected",
    suspended: "Suspended",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

async function postEnterprise(body: Record<string, unknown>) {
  const res = await fetch("/api/enterprise", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || json?.message || "Request failed");
  }
  return json;
}

export function EbdpPackLifecycleCard({
  pack,
  className,
}: {
  pack: PackRow;
  className?: string;
}) {
  const router = useRouter();
  const [offlineRef, setOfflineRef] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const status = String(pack.application_status);

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "space-y-4 p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">
            {ebdpPackageOptionLabel(String(pack.package_option))}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Pack {pack.id.slice(0, 8)} · {ENTERPRISE_BDP_ROLE_LABEL}
          </p>
        </div>
        <StatusBadge
          label={statusLabel(status)}
          tone={status === "active" ? "success" : "pending"}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Applicants cannot self-approve. Platform Ops activates approved packs.
        Live online pack checkout remains gated — offline payment reference may be
        recorded for review.
      </p>

      {status === "submitted" ? (
        <Button
          className="min-h-11"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              try {
                await postEnterprise({ action: "accept_terms", packId: pack.id });
                router.refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed");
              }
            })
          }
        >
          {pending ? "Saving…" : "Accept commercial terms"}
        </Button>
      ) : null}

      {status === "pending_payment" ? (
        <div className="space-y-2">
          <Label htmlFor={`offline-${pack.id}`}>Offline payment reference</Label>
          <Input
            id={`offline-${pack.id}`}
            value={offlineRef}
            onChange={(e) => setOfflineRef(e.target.value)}
            placeholder="Bank transfer / admin receipt reference"
            maxLength={200}
          />
          <Button
            className="min-h-11"
            disabled={pending || offlineRef.trim().length < 3}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                try {
                  await postEnterprise({
                    action: "record_payment",
                    packId: pack.id,
                    offlinePaymentRef: offlineRef.trim(),
                  });
                  router.refresh();
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed");
                }
              })
            }
          >
            {pending ? "Recording…" : "Submit payment evidence"}
          </Button>
        </div>
      ) : null}

      {status === "pending_approval" ? (
        <p className="text-sm text-muted-foreground">
          Awaiting Platform Ops review. You will receive workspace access after
          authorized activation.
        </p>
      ) : null}

      {status === "active" ? (
        <Button asChild variant="outline" className="min-h-11">
          <a href="/dashboard/enterprise-bdp">Open workspace</a>
        </Button>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
