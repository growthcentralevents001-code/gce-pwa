"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { ebdpPackageOptionLabel } from "@/lib/frontend/enterprise/format";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    id: "direct_30000" as const,
    title: "Direct",
    detail: "₹30,000 upfront per Enterprise BDP Franchise Pack",
  },
  {
    id: "finance_recovery_36000" as const,
    title: "Commission-Recovery Finance",
    detail: "₹36,000 total · ₹5,000 initial · ₹31,000 recoverable from approved commission",
  },
];

export function EbdpApplyForm({ className }: { className?: string }) {
  const router = useRouter();
  const [option, setOption] = useState<(typeof OPTIONS)[number]["id"]>(
    "finance_recovery_36000"
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/enterprise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "apply", packageOption: option }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Apply failed");
        }
        router.push("/enterprise-bdp/apply");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Apply failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Package option</legend>
        <p className="text-xs text-muted-foreground">
          Client capacity is 30 active clients per pack. Attribution is client-based —
          no territory ownership.
        </p>
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              "flex cursor-pointer gap-3 rounded-xl border p-3 touch-manipulation",
              option === opt.id
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted/40"
            )}
          >
            <input
              type="radio"
              name="ebdp-package"
              className="mt-1"
              checked={option === opt.id}
              onChange={() => setOption(opt.id)}
            />
            <span>
              <span className="block text-sm font-medium">{opt.title}</span>
              <span className="block text-xs text-muted-foreground">{opt.detail}</span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {ebdpPackageOptionLabel(opt.id)}
              </span>
            </span>
          </label>
        ))}
      </fieldset>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        className="mt-4 min-h-11 w-full sm:w-auto"
        disabled={pending}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </div>
  );
}
