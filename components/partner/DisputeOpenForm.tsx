"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export function DisputeOpenForm({
  unitId,
  className,
}: {
  unitId: string;
  className?: string;
}) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/connect/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "open_dispute",
            unitId,
            subject,
            details: details || undefined,
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(json?.error?.message || json?.message || "Open dispute failed");
        }
        setSubject("");
        setDetails("");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Open dispute failed");
      }
    });
  }

  return (
    <div className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-5", className)}>
      <h3 className="text-sm font-semibold">Open dispute</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Disputes begin with Connect BDP first-level handling. Escalation to Platform
        Relationship Manager follows unresolved cases.
      </p>
      <div className="mt-4 space-y-3">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            className="mt-1 min-h-11"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="details">Details</Label>
          <Textarea
            id="details"
            className="mt-1"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
          />
        </div>
      </div>
      {error ? (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="mt-4 min-h-11"
        disabled={pending || subject.trim().length < 3}
        onClick={submit}
      >
        {pending ? "Opening…" : "Open dispute"}
      </Button>
    </div>
  );
}
