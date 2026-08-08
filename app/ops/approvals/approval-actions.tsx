"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ApprovalActions({ approvalId }: { approvalId: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

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
      setMsg(res.ok ? "Saved" : "Failed (check reason / SoD)");
      router.refresh();
    });
  }

  return (
    <div className="mt-3 space-y-2">
      <input
        className="w-full rounded border border-neutral-300 px-2 py-1 text-xs"
        placeholder="Decision reason (required)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {["approve", "reject", "request_changes", "hold", "escalate"].map(
          (d) => (
            <button
              key={d}
              type="button"
              disabled={pending}
              className="rounded border border-neutral-300 px-2 py-1 text-xs"
              onClick={() => act(d)}
            >
              {d}
            </button>
          )
        )}
      </div>
      {msg ? <p className="text-xs text-neutral-600">{msg}</p> : null}
    </div>
  );
}
