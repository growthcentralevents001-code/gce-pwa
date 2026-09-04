"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSelfApprovalBlocked } from "@/lib/frontend/ops/format";

export function EbdpPackActivateButton({
  packId,
  applicantUserId,
  actorUserId,
  canActivate,
}: {
  packId: string;
  applicantUserId: string;
  actorUserId: string;
  canActivate: boolean;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const selfBlocked = isSelfApprovalBlocked(actorUserId, applicantUserId);

  if (selfBlocked) {
    return (
      <p className="text-xs text-muted-foreground">
        Self-approval blocked — another authorized reviewer must activate this pack.
      </p>
    );
  }

  if (!canActivate) {
    return (
      <p className="text-xs text-muted-foreground">
        Terms acceptance and payment evidence must be recorded before activation.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={`ebdp-reason-${packId}`} className="text-xs">
          Activation reason
        </Label>
        <Input
          id={`ebdp-reason-${packId}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why this Enterprise BDP pack is approved"
          className="text-sm"
          disabled={pending}
        />
      </div>
      <Button
        type="button"
        size="sm"
        disabled={pending || reason.trim().length < 3}
        onClick={() =>
          startTransition(async () => {
            setMsg(null);
            const res = await fetch("/api/enterprise", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "activate_pack",
                packId,
                reason: reason.trim(),
              }),
            });
            const body = await res.json().catch(() => null);
            if (!res.ok) {
              setMsg(
                body?.error?.message ?? body?.error?.code ?? "Activation failed"
              );
              return;
            }
            setMsg("Pack activated");
            router.refresh();
          })
        }
      >
        {pending ? "Activating…" : "Activate Enterprise BDP pack"}
      </Button>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
