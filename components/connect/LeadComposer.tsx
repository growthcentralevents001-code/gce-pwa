"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGated } from "@/components/states/FeatureGated";
import { extractApiError } from "@/lib/frontend/connect/format";

/** Stage 1 unpaid Lead Assist composer — create + submit. */
export function LeadComposer({
  giverMembershipId,
  originCircleId,
}: {
  giverMembershipId?: string | null;
  originCircleId?: string | null;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const onSubmit = () => {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      try {
        const createRes = await fetch("/api/lead-assist", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "create",
            title,
            requirementSummary: summary,
            requirementDetails: details || null,
            city: city || null,
            giverMembershipId: giverMembershipId ?? null,
            originCircleId: originCircleId ?? null,
            tagCodes: [],
            urgency: "normal",
            privacyLevel: "standard",
          }),
        });
        const createJson = await createRes.json();
        if (!createRes.ok) {
          throw new Error(extractApiError(createJson, "Could not create lead"));
        }
        const leadId = createJson.lead?.id as string | undefined;
        if (!leadId) throw new Error("Lead id missing");

        const submitRes = await fetch("/api/lead-assist", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "submit", leadId }),
        });
        const submitJson = await submitRes.json();
        if (!submitRes.ok) {
          throw new Error(extractApiError(submitJson, "Could not submit lead"));
        }
        router.push(`/connect/leads/${leadId}`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Submit failed");
      }
    });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <FeatureGated
        mode="disabled_in_environment"
        title="Unpaid Stage 1 Lead Assist"
        description="Formal leads are created in-app. Paid Lead Assist, escrow, ₹500 fees, and success fees remain OFF."
      />
      <div>
        <Label htmlFor="lead-title">Title</Label>
        <Input
          id="lead-title"
          className="mt-1 min-h-11"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
        />
      </div>
      <div>
        <Label htmlFor="lead-summary">Requirement summary</Label>
        <Textarea
          id="lead-summary"
          className="mt-1"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="lead-details">Details (optional)</Label>
        <Textarea
          id="lead-details"
          className="mt-1"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="lead-city">City</Label>
        <Input
          id="lead-city"
          className="mt-1 min-h-11"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        className="min-h-12 w-full touch-manipulation"
        disabled={pending || title.trim().length < 3 || summary.trim().length < 3}
        onClick={onSubmit}
      >
        {pending ? "Submitting…" : "Submit lead"}
      </Button>
    </div>
  );
}
