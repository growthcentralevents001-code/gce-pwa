"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function PromoteSignalButton({ signalId }: { signalId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      className="mt-2 text-xs underline"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/ops/admin", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              action: "promote_support_signal",
              signalId,
            }),
          });
          router.refresh();
        })
      }
    >
      {pending ? "Promoting…" : "Promote to case"}
    </button>
  );
}
