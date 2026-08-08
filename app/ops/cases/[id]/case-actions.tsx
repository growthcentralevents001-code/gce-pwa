"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function CaseActions({
  caseId,
  currentStatus,
}: {
  caseId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-4 space-y-3 rounded border border-neutral-200 p-3 text-sm">
      <div>
        <div className="text-xs text-neutral-500">Add internal note</div>
        <textarea
          className="mt-1 w-full rounded border border-neutral-300 p-2"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          type="button"
          disabled={pending}
          className="mt-1 rounded border border-neutral-300 px-2 py-1 text-xs"
          onClick={() =>
            startTransition(async () => {
              await fetch("/api/ops/admin", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  action: "add_case_note",
                  caseId,
                  body: note,
                  visibility: "internal",
                }),
              });
              setNote("");
              router.refresh();
            })
          }
        >
          Save note
        </button>
      </div>
      <div>
        <div className="text-xs text-neutral-500">
          Transition (current: {currentStatus})
        </div>
        <input
          className="mt-1 w-full rounded border border-neutral-300 px-2 py-1 text-xs"
          placeholder="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {["investigating", "escalated", "resolved", "closed", "reopened"].map(
            (toStatus) => (
              <button
                key={toStatus}
                type="button"
                disabled={pending}
                className="rounded border border-neutral-300 px-2 py-1 text-xs"
                onClick={() =>
                  startTransition(async () => {
                    await fetch("/api/ops/admin", {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify({
                        action: "transition_case",
                        caseId,
                        toStatus,
                        reason,
                      }),
                    });
                    router.refresh();
                  })
                }
              >
                → {toStatus}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
