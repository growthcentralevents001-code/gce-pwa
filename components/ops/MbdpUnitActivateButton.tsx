"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSelfApprovalBlocked } from "@/lib/frontend/ops/format";

export function MbdpUnitActivateButton({
  unitId,
  applicantUserId,
  actorUserId,
}: {
  unitId: string;
  applicantUserId: string;
  actorUserId: string;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const selfBlocked = isSelfApprovalBlocked(actorUserId, applicantUserId);

  if (selfBlocked) {
    return (
      <p className="text-xs text-muted-foreground">
        Self-approval blocked — another authorized reviewer must activate this unit.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <Label htmlFor={`reason-${unitId}`} className="text-xs">
          Activation reason
        </Label>
        <Input
          id={`reason-${unitId}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Why this MBDP unit is approved"
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
            const res = await fetch("/api/marketplace/bdp", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "activate",
                unitId,
                reason: reason.trim(),
              }),
            });
            const body = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(
          body?.error?.message ??
            body?.error?.code ??
            "Activation failed"
        );
        return;
      }
            setMsg("Unit activated");
            router.refresh();
          })
        }
      >
        {pending ? "Activating…" : "Activate MBDP unit"}
      </Button>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
