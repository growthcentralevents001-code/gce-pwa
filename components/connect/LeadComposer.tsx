"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FeatureGated } from "@/components/states/FeatureGated";
import { extractApiError } from "@/lib/frontend/connect/format";
import { cn } from "@/lib/utils";

type Specialisation = {
  id: string;
  code: string;
  label: string;
  powerSector: string | null;
};

type TagEntry = { key: string; label: string };

/** Stage 1 unpaid Lead Assist composer — create + submit with taxonomy. */
export function LeadComposer({
  giverMembershipId,
  originCircleId,
  meetingId,
}: {
  giverMembershipId?: string | null;
  originCircleId?: string | null;
  meetingId?: string | null;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [city, setCity] = useState("");
  const [specialisationId, setSpecialisationId] = useState<string | null>(null);
  const [tagCodes, setTagCodes] = useState<string[]>([]);
  const [specialisations, setSpecialisations] = useState<Specialisation[]>([]);
  const [tags, setTags] = useState<TagEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    void (async () => {
      try {
        const [specRes, tagRes] = await Promise.all([
          fetch("/api/connect/specialisations"),
          fetch("/api/connect/tag-catalog"),
        ]);
        if (specRes.ok) {
          const json = await specRes.json();
          if (Array.isArray(json.specialisations)) {
            setSpecialisations(json.specialisations);
          }
        }
        if (tagRes.ok) {
          const json = await tagRes.json();
          if (Array.isArray(json.tags)) {
            setTags(json.tags);
          }
        }
      } catch {
        // taxonomy optional for draft; submit may still classify
      }
    })();
  }, []);

  const toggleTag = (key: string) => {
    setTagCodes((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      if (prev.length >= 4) return prev;
      return [...prev, key];
    });
  };

  const selectedSpec = specialisations.find((s) => s.id === specialisationId);

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
            meetingId: meetingId ?? null,
            specialisationId: specialisationId ?? null,
            tagCodes,
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

  const canSubmit =
    title.trim().length >= 3 &&
    summary.trim().length >= 3 &&
    Boolean(specialisationId);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <FeatureGated
        mode="disabled_in_environment"
        title="Unpaid Stage 1 Lead Assist"
        description="Formal referrals are created in-app. Paid Lead Assist, escrow, ₹500 fees, and success fees remain OFF."
      />
      {meetingId ? (
        <p className="text-xs text-muted-foreground">
          This referral is linked to your Circle meeting. It uses the same Lead
          Assist workflow — not a separate meeting opportunity engine.
        </p>
      ) : null}
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
        <Label htmlFor="lead-spec">Specialisation (required)</Label>
        <select
          id="lead-spec"
          className="mt-1 flex min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={specialisationId ?? ""}
          onChange={(e) =>
            setSpecialisationId(e.target.value ? e.target.value : null)
          }
        >
          <option value="">Select specialisation…</option>
          {specialisations.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
              {s.powerSector ? ` · ${s.powerSector.replaceAll("_", " ")}` : ""}
            </option>
          ))}
        </select>
        {selectedSpec?.powerSector ? (
          <p className="mt-1 text-xs text-muted-foreground">
            GC Power Sector: {selectedSpec.powerSector.replaceAll("_", " ")}
          </p>
        ) : null}
      </div>
      {tags.length > 0 ? (
        <div>
          <Label>Tags (optional, max 4)</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = tagCodes.includes(tag.key);
              return (
                <button
                  key={tag.key}
                  type="button"
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors min-h-9",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground"
                  )}
                  onClick={() => toggleTag(tag.key)}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
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
        disabled={pending || !canSubmit}
        onClick={onSubmit}
      >
        {pending ? "Submitting…" : "Submit referral"}
      </Button>
    </div>
  );
}
