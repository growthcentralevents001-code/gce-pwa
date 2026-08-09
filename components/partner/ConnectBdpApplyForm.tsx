"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  GCE_RADIUS,
  GCE_SURFACE,
} from "@/lib/frontend/design-language";
import { packageOptionLabel } from "@/lib/frontend/partner/format";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    id: "direct_50000" as const,
    title: "Direct",
    detail: "₹50,000 upfront per Franchise Unit",
  },
  {
    id: "finance_recovery_60000" as const,
    title: "Commission-Recovery Finance",
    detail: "₹60,000 total · ₹5,000 initial · ₹55,000 recoverable (max ₹5,000/cycle)",
  },
];

export function ConnectBdpApplyForm({ className }: { className?: string }) {
  const router = useRouter();
  const [option, setOption] = useState<(typeof OPTIONS)[number]["id"]>(
    "finance_recovery_60000"
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/connect/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "apply", packageOption: option }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Application failed");
        }
        router.push("/connect-bdp/unit");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Application failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Package option</legend>
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              "flex cursor-pointer gap-3 rounded-xl border p-3 touch-manipulation",
              option === opt.id
                ? "border-primary bg-orange-50/80 dark:bg-orange-950/30"
                : "border-border"
            )}
          >
            <input
              type="radio"
              name="packageOption"
              className="mt-1"
              checked={option === opt.id}
              onChange={() => setOption(opt.id)}
            />
            <span>
              <span className="block text-sm font-medium">{opt.title}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {opt.detail}
              </span>
              <span className="sr-only">{packageOptionLabel(opt.id)}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <p className="mt-4 text-xs text-muted-foreground">
        Connect BDP is an independent commercial partner operating a Franchise Unit
        under platform assignment — not an employee, city owner, or authority to bind
        Logixia. Payment does not activate the unit; Platform approval is required.
      </p>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4 min-h-11 w-full sm:w-auto"
        disabled={pending}
        onClick={submit}
      >
        {pending ? "Submitting…" : "Submit application"}
      </Button>
      <Label className="sr-only">Submit Connect BDP application</Label>
    </div>
  );
}
