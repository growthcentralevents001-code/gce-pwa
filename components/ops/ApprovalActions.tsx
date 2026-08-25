"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { isSelfApprovalBlocked } from "@/lib/frontend/ops/format";

const DECISIONS = [
  { id: "approve", label: "Approve", variant: "default" as const },
  { id: "reject", label: "Reject", variant: "destructive" as const },
  { id: "request_changes", label: "Request changes", variant: "outline" as const },
  { id: "hold", label: "Hold", variant: "outline" as const },
  { id: "escalate", label: "Escalate", variant: "outline" as const },
] as const;

/**
 * Approval actions with reason + confirmation.
 * Hides approve when UI detects self-approval; backend still enforces SoD.
 */
export function ApprovalActions({
  approvalId,
  title,
  actorUserId,
  requesterUserId,
}: {
  approvalId: string;
  title: string;
  actorUserId?: string | null;
  requesterUserId?: string | null;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const selfBlocked = isSelfApprovalBlocked(actorUserId, requesterUserId);

  function act(decision: string) {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/ops/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "review_approval",
          approvalId,
          decision,
          decisionReason: reason,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(
          body?.error?.message ??
            "Failed — check reason, permission, or self-approval SoD"
        );
      } else {
        setMsg("Decision recorded");
      }
      router.refresh();
    });
  }

  if (selfBlocked) {
    return (
      <p
        className="rounded-md border border-warning/40 bg-warning/10 px-2 py-2 text-xs text-warning"
        role="status"
      >
        Self-approval blocked. You requested this item — another authorized
        reviewer must decide. Backend SoD still enforces.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label htmlFor={`reason-${approvalId}`} className="text-xs">
          Decision reason (required)
        </Label>
        <Input
          id={`reason-${approvalId}`}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="State why this decision is appropriate"
          className="text-sm"
          disabled={pending}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {DECISIONS.map((d) => (
          <AlertDialog key={d.id}>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant={d.variant}
                disabled={pending || reason.trim().length < 3}
              >
                {d.label}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Confirm {d.label.toLowerCase()}
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      Entity: <span className="text-foreground">{title}</span>
                    </p>
                    <p>
                      Action:{" "}
                      <span className="text-foreground">{d.label}</span>
                    </p>
                    <p>
                      Consequence: For Venue, Event, Offer, and Connect BDP
                      unit queue items this applies the canonical domain
                      approve/activate service. Other queue items record an
                      audited ops decision only.
                    </p>
                    <p className="text-xs">Reason: {reason}</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => act(d.id)}
                  className={
                    d.variant === "destructive"
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : undefined
                  }
                >
                  Confirm {d.label.toLowerCase()}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
