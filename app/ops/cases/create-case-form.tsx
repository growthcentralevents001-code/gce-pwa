"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function CreateCaseForm() {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-4 rounded border border-neutral-200 p-3 text-sm">
      <div className="font-medium">Create support / ops case</div>
      <textarea
        className="mt-2 w-full rounded border border-neutral-300 p-2 text-sm"
        rows={3}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Summary (required)"
      />
      <button
        type="button"
        disabled={pending}
        className="mt-2 rounded border border-neutral-300 px-3 py-1.5"
        onClick={() =>
          startTransition(async () => {
            setMsg(null);
            const res = await fetch("/api/ops/admin", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "create_case",
                caseType: "general_support",
                vertical: "support",
                summary,
              }),
            });
            setMsg(res.ok ? "Created" : "Failed");
            router.refresh();
          })
        }
      >
        {pending ? "Creating…" : "Create case"}
      </button>
      {msg ? <p className="mt-1 text-xs text-neutral-600">{msg}</p> : null}
    </div>
  );
}
