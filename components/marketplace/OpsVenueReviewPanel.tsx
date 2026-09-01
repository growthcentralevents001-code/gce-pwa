"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/states/StatusBadge";
import { VenueOnboardingProgress } from "@/components/marketplace/VenueOnboardingProgress";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import type {
  OnboardingProgressStep,
  VenueDocumentManifestEntry,
  VenueOnboardingMetadata,
} from "@/lib/architecture/marketplace/onboarding";
import { venueStatusLabel } from "@/lib/frontend/marketplace/format";

export function OpsVenueReviewPanel({
  venueId,
  displayName,
  status,
  category,
  city,
  state,
  address,
  onboarding,
  progress,
  canReview,
}: {
  venueId: string;
  displayName: string;
  status: string;
  category?: string | null;
  city?: string | null;
  state?: string | null;
  address?: string | null;
  onboarding: VenueOnboardingMetadata;
  progress: OnboardingProgressStep[];
  canReview: boolean;
}) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [changeNote, setChangeNote] = useState("");
  const [docId, setDocId] = useState("");
  const [docRejectNote, setDocRejectNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function act(action: string, payload: Record<string, unknown>) {
    setError(null);
    setMsg(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/marketplace/bdp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...payload }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(
            json?.error?.message || json?.message || "Action failed"
          );
        }
        setMsg("Decision recorded");
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Action failed");
      }
    });
  }

  const docs = onboarding.documents ?? [];

  return (
    <div className="space-y-6">
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{displayName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {[category, city, state].filter(Boolean).join(" · ")}
            </p>
          </div>
          <StatusBadge
            label={venueStatusLabel(status)}
            tone={status === "active" ? "success" : "pending"}
          />
        </div>
        {address ? <p className="mt-3 text-sm">{address}</p> : null}
        {onboarding.business ? (
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {onboarding.business.ownerContactName ? (
              <>
                <dt className="text-muted-foreground">Contact</dt>
                <dd>{onboarding.business.ownerContactName}</dd>
              </>
            ) : null}
            {onboarding.business.contactPhone ? (
              <>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{onboarding.business.contactPhone}</dd>
              </>
            ) : null}
            {onboarding.business.contactEmail ? (
              <>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{onboarding.business.contactEmail}</dd>
              </>
            ) : null}
          </dl>
        ) : null}
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold">Onboarding progress</h3>
        <VenueOnboardingProgress steps={progress} />
      </section>

      {onboarding.eligibility ? (
        <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
          <h3 className="text-sm font-semibold">Eligibility review</h3>
          <p className="mt-2 text-sm">
            Result:{" "}
            <span className="font-medium">
              {onboarding.eligibility.result.replace(/_/g, " ")}
            </span>
          </p>
          {onboarding.eligibility.notes ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {onboarding.eligibility.notes}
            </p>
          ) : null}
        </section>
      ) : null}

      {onboarding.recommendation?.notes ? (
        <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
          <h3 className="text-sm font-semibold">MBDP recommendation</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {onboarding.recommendation.notes}
          </p>
        </section>
      ) : null}

      {docs.length > 0 ? (
        <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
          <h3 className="text-sm font-semibold">Document manifest</h3>
          <ul className="mt-3 space-y-3">
            {docs.map((d: VenueDocumentManifestEntry) => (
              <li key={d.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{d.label}</span>
                  <StatusBadge label={d.reviewStatus} tone="info" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{d.referenceNote}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canReview && status !== "active" ? (
        <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5 space-y-4`}>
          <h3 className="text-sm font-semibold">Marketplace Ops decision</h3>
          <p className="text-xs text-muted-foreground">
            Final approval activates the Venue. MBDP cannot self-approve.
          </p>
          <div>
            <Label htmlFor="ops-reason">Approval / rejection reason</Label>
            <Input
              id="ops-reason"
              className="mt-1 min-h-11"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={pending || reason.trim().length < 3}
              onClick={() =>
                act("approve_venue", { venueId, reason: reason.trim() })
              }
            >
              Final approve
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={pending || reason.trim().length < 3}
              onClick={() =>
                act("reject_venue", { venueId, reason: reason.trim() })
              }
            >
              Reject
            </Button>
          </div>
          <div>
            <Label htmlFor="ops-changes">Request more information</Label>
            <Textarea
              id="ops-changes"
              className="mt-1"
              rows={2}
              value={changeNote}
              onChange={(e) => setChangeNote(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-2"
              disabled={pending || changeNote.trim().length < 3}
              onClick={() =>
                act("request_venue_changes", {
                  venueId,
                  note: changeNote.trim(),
                })
              }
            >
              Request changes
            </Button>
          </div>
          {docs.some((d) => d.reviewStatus === "pending") ? (
            <div className="space-y-2 border-t border-border pt-4">
              <Label htmlFor="doc-id">Review document (ID)</Label>
              <Input
                id="doc-id"
                className="min-h-11"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                placeholder="Document UUID from manifest"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={pending || !docId}
                  onClick={() =>
                    act("review_venue_document", {
                      venueId,
                      documentId: docId,
                      reviewStatus: "accepted",
                    })
                  }
                >
                  Accept document
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending || !docId}
                  onClick={() =>
                    act("review_venue_document", {
                      venueId,
                      documentId: docId,
                      reviewStatus: "rejected",
                      rejectionNote: docRejectNote || undefined,
                    })
                  }
                >
                  Reject document
                </Button>
              </div>
              <Input
                value={docRejectNote}
                onChange={(e) => setDocRejectNote(e.target.value)}
                placeholder="Rejection note (optional)"
              />
            </div>
          ) : null}
        </section>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {msg ? (
        <p className="text-sm text-success" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
