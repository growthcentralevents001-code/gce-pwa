"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function MarkReadButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className="text-xs underline"
      onClick={() =>
        startTransition(async () => {
          await fetch("/api/ops", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "mark_read" }),
          });
          router.refresh();
        })
      }
    >
      {pending ? "Updating…" : "Mark all read"}
    </button>
  );
}
