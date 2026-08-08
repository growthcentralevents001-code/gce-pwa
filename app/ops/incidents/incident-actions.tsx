"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function IncidentActions({ incidentId }: { incidentId: string }) {
  const router = useRouter();
  const [ref, setRef] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={pending}
        className="rounded border border-neutral-300 px-2 py-1 text-xs"
        onClick={() =>
          startTransition(async () => {
            await fetch("/api/ops/admin", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "ack_incident",
                incidentId,
              }),
            });
            router.refresh();
          })
        }
      >
        Acknowledge
      </button>
      <input
        className="rounded border border-neutral-300 px-2 py-1 text-xs"
        placeholder="Resolution ref"
        value={ref}
        onChange={(e) => setRef(e.target.value)}
      />
      <button
        type="button"
        disabled={pending}
        className="rounded border border-neutral-300 px-2 py-1 text-xs"
        onClick={() =>
          startTransition(async () => {
            await fetch("/api/ops/admin", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                action: "resolve_incident",
                incidentId,
                resolutionRef: ref,
              }),
            });
            router.refresh();
          })
        }
      >
        Resolve
      </button>
    </div>
  );
}
