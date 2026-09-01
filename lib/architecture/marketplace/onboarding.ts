import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export const VENUE_ELIGIBILITY_RESULTS = [
  "eligible",
  "not_eligible",
  "needs_info",
] as const;

export type VenueEligibilityResult = (typeof VENUE_ELIGIBILITY_RESULTS)[number];

export type VenueEligibilityRecord = {
  result: VenueEligibilityResult;
  verifiedByUserId: string;
  verifiedAt: string;
  notes?: string | null;
  missingRequirements?: string[];
};

export const VENUE_DOCUMENT_REVIEW_STATUSES = [
  "pending",
  "accepted",
  "rejected",
] as const;

export type VenueDocumentReviewStatus =
  (typeof VENUE_DOCUMENT_REVIEW_STATUSES)[number];

/** Manifest entry — reference metadata only; no binary upload in Phase 7. */
export type VenueDocumentManifestEntry = {
  id: string;
  label: string;
  referenceNote: string;
  submittedAt: string;
  submittedByUserId: string;
  reviewStatus: VenueDocumentReviewStatus;
  reviewedByUserId?: string | null;
  reviewedAt?: string | null;
  rejectionNote?: string | null;
};

export type VenueBusinessProfile = {
  ownerContactName?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  businessDescription?: string | null;
  websiteUrl?: string | null;
  socialLinks?: string[];
};

export type VenueOnboardingMetadata = {
  business?: VenueBusinessProfile;
  eligibility?: VenueEligibilityRecord;
  documents?: VenueDocumentManifestEntry[];
  recommendation?: {
    notes?: string | null;
    recommendedAt?: string | null;
    recommendedByUserId?: string | null;
    recommendedByUnitId?: string | null;
  };
  opsReview?: {
    requestedChangesAt?: string | null;
    requestedChangesNote?: string | null;
    requestedByUserId?: string | null;
  };
};

export type OnboardingProgressStep = {
  id: string;
  label: string;
  state: "complete" | "current" | "pending" | "blocked";
  detail?: string | null;
};

const businessProfileSchema = z.object({
  ownerContactName: z.string().max(200).optional().nullable(),
  contactPhone: z.string().max(40).optional().nullable(),
  contactEmail: z.string().email().max(200).optional().nullable(),
  businessDescription: z.string().max(2000).optional().nullable(),
  websiteUrl: z.string().url().max(500).optional().nullable(),
  socialLinks: z.array(z.string().max(500)).max(10).optional(),
});

export const venueEligibilitySchema = z.object({
  venueId: z.string().uuid(),
  result: z.enum(VENUE_ELIGIBILITY_RESULTS),
  notes: z.string().max(2000).optional().nullable(),
  missingRequirements: z.array(z.string().max(200)).max(20).optional(),
});

export const venueDocumentManifestSchema = z.object({
  venueId: z.string().uuid(),
  documents: z
    .array(
      z.object({
        label: z.string().min(1).max(200),
        referenceNote: z.string().min(1).max(1000),
      })
    )
    .min(1)
    .max(20),
});

export const reviewVenueDocumentSchema = z.object({
  venueId: z.string().uuid(),
  documentId: z.string().uuid(),
  reviewStatus: z.enum(["accepted", "rejected"]),
  rejectionNote: z.string().max(1000).optional().nullable(),
});

const OPERATIONAL_VENUE_STATUSES = new Set(["active", "temporarily_inactive"]);

export function isVenueOperational(status: string): boolean {
  return OPERATIONAL_VENUE_STATUSES.has(status);
}

export function parseVenueOnboarding(metadata: unknown): VenueOnboardingMetadata {
  if (!metadata || typeof metadata !== "object") return {};
  const onboarding = (metadata as Record<string, unknown>).onboarding;
  if (!onboarding || typeof onboarding !== "object") return {};
  return onboarding as VenueOnboardingMetadata;
}

export function mergeVenueOnboardingMetadata(
  existing: unknown,
  patch: Partial<VenueOnboardingMetadata>
): Record<string, unknown> {
  const base =
    existing && typeof existing === "object"
      ? { ...(existing as Record<string, unknown>) }
      : {};
  const current = parseVenueOnboarding(base);
  return {
    ...base,
    onboarding: {
      ...current,
      ...patch,
      business: patch.business
        ? { ...current.business, ...patch.business }
        : current.business,
      eligibility: patch.eligibility ?? current.eligibility,
      documents: patch.documents ?? current.documents,
      recommendation: patch.recommendation
        ? { ...current.recommendation, ...patch.recommendation }
        : current.recommendation,
      opsReview: patch.opsReview
        ? { ...current.opsReview, ...patch.opsReview }
        : current.opsReview,
    },
  };
}

export function buildOnboardingProgress(input: {
  status: string;
  onboarding: VenueOnboardingMetadata;
  hasRecommendation: boolean;
}): OnboardingProgressStep[] {
  const { status, onboarding, hasRecommendation } = input;
  const eligibilityDone = Boolean(onboarding.eligibility?.verifiedAt);
  const docsSubmitted = (onboarding.documents?.length ?? 0) > 0;
  const docsReviewed =
    docsSubmitted &&
    onboarding.documents!.every((d) => d.reviewStatus !== "pending");
  const opsApproved = status === "active";
  const opsRejected = status === "terminated" || status === "archived";
  const opsReview =
    status === "pending_platform_approval" ||
    status === "submitted" ||
    status === "review_required";

  return [
    {
      id: "profile",
      label: "Business profile",
      state: onboarding.business?.ownerContactName ? "complete" : "current",
      detail: onboarding.business?.ownerContactName
        ? "Contact details captured"
        : "Capture owner/contact and business details",
    },
    {
      id: "eligibility",
      label: "Basic eligibility",
      state: eligibilityDone
        ? "complete"
        : onboarding.business?.ownerContactName
          ? "current"
          : "pending",
      detail: onboarding.eligibility?.result
        ? `Result: ${onboarding.eligibility.result.replace(/_/g, " ")}`
        : "MBDP assists initial eligibility — not final approval",
    },
    {
      id: "documents",
      label: "Documents",
      state: docsReviewed
        ? "complete"
        : docsSubmitted
          ? "current"
          : eligibilityDone
            ? "current"
            : "pending",
      detail: docsSubmitted
        ? `${onboarding.documents!.filter((d) => d.reviewStatus === "accepted").length}/${onboarding.documents!.length} accepted`
        : "Document manifest (reference metadata) — secure upload not live",
    },
    {
      id: "recommendation",
      label: "MBDP recommendation",
      state: hasRecommendation
        ? "complete"
        : eligibilityDone
          ? "current"
          : "pending",
      detail: hasRecommendation
        ? "Submitted to Platform review queue"
        : "Recommendation is assistive — not activation",
    },
    {
      id: "platform",
      label: "Platform final approval",
      state: opsApproved
        ? "complete"
        : opsRejected
          ? "blocked"
          : opsReview
            ? "current"
            : "pending",
      detail: opsApproved
        ? "Venue active"
        : status === "review_required"
          ? onboarding.opsReview?.requestedChangesNote ?? "Changes requested"
          : "Marketplace Ops final-approves",
    },
  ];
}

async function loadVenueRow(client: SupabaseClient, venueId: string) {
  const { data, error } = await client
    .from("marketplace_venues")
    .select("*")
    .eq("id", venueId)
    .single();
  if (error || !data) {
    throw new AppError("NOT_FOUND", "Venue not found", { status: 404 });
  }
  return data;
}

export async function assertVenueOperationalForCommerce(
  client: SupabaseClient,
  venueId: string
) {
  const venue = await loadVenueRow(client, venueId);
  if (!isVenueOperational(String(venue.status))) {
    throw new AppError(
      "FORBIDDEN",
      "Venue must be Platform-approved (active) before Events or Offers",
      { status: 403 }
    );
  }
  return venue;
}

export async function recordVenueEligibility(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    result: VenueEligibilityResult;
    notes?: string | null;
    missingRequirements?: string[];
    correlationId?: string;
  }
) {
  const venue = await loadVenueRow(client, input.venueId);
  const now = new Date().toISOString();
  const eligibility: VenueEligibilityRecord = {
    result: input.result,
    verifiedByUserId: input.actorUserId,
    verifiedAt: now,
    notes: input.notes ?? null,
    missingRequirements: input.missingRequirements,
  };
  const metadata = mergeVenueOnboardingMetadata(venue.metadata, { eligibility });
  const { data, error } = await client
    .from("marketplace_venues")
    .update({ metadata })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record eligibility", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.eligibility_recorded",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: { eligibility },
    correlationId: input.correlationId,
  });
  return data;
}

export async function recordVenueDocumentManifest(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    documents: Array<{ label: string; referenceNote: string }>;
    correlationId?: string;
  }
) {
  const venue = await loadVenueRow(client, input.venueId);
  const now = new Date().toISOString();
  const existing = parseVenueOnboarding(venue.metadata).documents ?? [];
  const added: VenueDocumentManifestEntry[] = input.documents.map((d) => ({
    id: randomUUID(),
    label: d.label,
    referenceNote: d.referenceNote,
    submittedAt: now,
    submittedByUserId: input.actorUserId,
    reviewStatus: "pending",
  }));
  const metadata = mergeVenueOnboardingMetadata(venue.metadata, {
    documents: [...existing, ...added],
  });
  const { data, error } = await client
    .from("marketplace_venues")
    .update({ metadata })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record document manifest", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.documents_submitted",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: { documents: added },
    correlationId: input.correlationId,
  });
  return data;
}

export async function reviewVenueDocument(
  client: SupabaseClient,
  input: {
    venueId: string;
    documentId: string;
    actorUserId: string;
    reviewStatus: "accepted" | "rejected";
    rejectionNote?: string | null;
    correlationId?: string;
  }
) {
  const venue = await loadVenueRow(client, input.venueId);
  const onboarding = parseVenueOnboarding(venue.metadata);
  const docs = onboarding.documents ?? [];
  const idx = docs.findIndex((d) => d.id === input.documentId);
  if (idx < 0) {
    throw new AppError("NOT_FOUND", "Document entry not found", { status: 404 });
  }
  const now = new Date().toISOString();
  const updated = [...docs];
  updated[idx] = {
    ...updated[idx]!,
    reviewStatus: input.reviewStatus,
    reviewedByUserId: input.actorUserId,
    reviewedAt: now,
    rejectionNote:
      input.reviewStatus === "rejected" ? input.rejectionNote ?? null : null,
  };
  const metadata = mergeVenueOnboardingMetadata(venue.metadata, {
    documents: updated,
  });
  const { data, error } = await client
    .from("marketplace_venues")
    .update({
      metadata,
      verification_status:
        updated.every((d) => d.reviewStatus === "accepted") &&
        updated.length > 0
          ? "verified"
          : venue.verification_status,
    })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to review document", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.document_reviewed",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: { documentId: input.documentId, reviewStatus: input.reviewStatus },
    correlationId: input.correlationId,
  });
  return data;
}

export async function rejectMarketplaceVenue(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
) {
  const venue = await loadVenueRow(client, input.venueId);
  if (venue.recommended_by_user_id === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Marketplace BDP recommender cannot final-reject Venue (FD-037)",
      { status: 403 }
    );
  }
  const { data, error } = await client
    .from("marketplace_venues")
    .update({
      status: "terminated",
      rejected_by: input.actorUserId,
      rejection_reason: input.reason,
    })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to reject venue", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.reject",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function requestVenueChanges(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    note: string;
    correlationId?: string;
  }
) {
  const venue = await loadVenueRow(client, input.venueId);
  const now = new Date().toISOString();
  const metadata = mergeVenueOnboardingMetadata(venue.metadata, {
    opsReview: {
      requestedChangesAt: now,
      requestedChangesNote: input.note,
      requestedByUserId: input.actorUserId,
    },
  });
  const { data, error } = await client
    .from("marketplace_venues")
    .update({
      status: "review_required",
      metadata,
    })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to request venue changes", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.changes_requested",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: data,
    reason: input.note,
    correlationId: input.correlationId,
  });
  return data;
}

export { businessProfileSchema };
