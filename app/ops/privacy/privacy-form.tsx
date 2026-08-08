"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function PrivacyRequestForm() {
  const router = useRouter();
  const [requestType, setRequestType] = useState("access");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-4 space-y-2 text-sm">
      <label className="block">
        Request type
        <select
          className="mt-1 block w-full rounded border border-neutral-300 p-2"
          value={requestType}
          onChange={(e) => setRequestType(e.target.value)}
        >
          <option value="access">Access</option>
          <option value="correction">Correction</option>
          <option value="erasure">Erasure (review only)</option>
          <option value="restricted_processing">Restricted processing</option>
        </select>
      </label>
      <button
        type="button"
        disabled={pending}
        className="rounded border border-neutral-300 px-3 py-1.5"
        onClick={() =>
          startTransition(async () => {
            setMsg(null);
            const res = await fetch("/api/ops", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "create_privacy_request",
                requestType,
              }),
            });
            setMsg(res.ok ? "Submitted" : "Failed");
            router.refresh();
          })
        }
      >
        {pending ? "Submitting…" : "Submit request"}
      </button>
      {msg ? <p className="text-xs text-neutral-600">{msg}</p> : null}
    </div>
  );
}
