import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import type { RoleAssignment } from "../types";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { actorHasMarketplacePermission } from "./permissions";
import {
  mergeVenueOnboardingMetadata,
  parseVenueOnboarding,
  type VenueDocumentManifestEntry,
} from "./onboarding";

export const VENUE_ONBOARDING_BUCKET = "marketplace-venue-private";
export const VENUE_DOC_MAX_BYTES = 10 * 1024 * 1024;
export const VENUE_DOC_ALLOWED_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const SIGNED_URL_TTL_SECONDS = 60;

export function buildVenueDocumentStoragePath(input: {
  venueId: string;
  documentId: string;
  fileName: string;
}): string {
  const safeName = input.fileName
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .slice(0, 120);
  return `venues/${input.venueId}/onboarding/${input.documentId}/${safeName}`;
}

export function assertVenueDocumentMime(mimeType: string) {
  if (!VENUE_DOC_ALLOWED_MIME.has(mimeType)) {
    throw new AppError(
      "VALIDATION_ERROR",
      "File type not permitted for Venue onboarding documents",
      { status: 400 }
    );
  }
}

export async function assertVenueOnboardingDocumentAccess(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    assignments: RoleAssignment[];
    requireOpsReview?: boolean;
  }
) {
  if (input.requireOpsReview) {
    if (
      !actorHasMarketplacePermission(
        input.assignments,
        "marketplace.venue.approve"
      )
    ) {
      throw new AppError("FORBIDDEN", "Marketplace Ops review required", {
        status: 403,
      });
    }
    return;
  }

  const { data: venue, error } = await client
    .from("marketplace_venues")
    .select("id, organisation_id, submitted_by")
    .eq("id", input.venueId)
    .maybeSingle();
  if (error || !venue) {
    throw new AppError("NOT_FOUND", "Venue not found", { status: 404 });
  }

  if (
    actorHasMarketplacePermission(input.assignments, "marketplace.venue.approve")
  ) {
    return venue;
  }

  if (String(venue.submitted_by) === input.actorUserId) {
    return venue;
  }

  if (
    actorHasMarketplacePermission(input.assignments, "marketplace.venue.create")
  ) {
    const { data: attr } = await client
      .from("marketplace_venue_attributions")
      .select("id")
      .eq("venue_id", input.venueId)
      .eq("bdp_user_id", input.actorUserId)
      .maybeSingle();
    if (attr) return venue;
  }

  const { data: membership } = await client
    .from("organisation_memberships")
    .select("id")
    .eq("organisation_id", venue.organisation_id)
    .eq("user_id", input.actorUserId)
    .eq("status", "active")
    .maybeSingle();
  if (membership) return venue;

  throw new AppError("FORBIDDEN", "Not allowed to access Venue documents", {
    status: 403,
  });
}

export async function uploadVenueOnboardingDocument(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    assignments: RoleAssignment[];
    label: string;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
    bytes: Buffer;
    correlationId?: string;
  }
) {
  if (input.sizeBytes <= 0 || input.sizeBytes > VENUE_DOC_MAX_BYTES) {
    throw new AppError("VALIDATION_ERROR", "File exceeds permitted size", {
      status: 400,
    });
  }
  assertVenueDocumentMime(input.mimeType);

  await assertVenueOnboardingDocumentAccess(client, {
    venueId: input.venueId,
    actorUserId: input.actorUserId,
    assignments: input.assignments,
  });

  const { data: venue, error: venueErr } = await client
    .from("marketplace_venues")
    .select("*")
    .eq("id", input.venueId)
    .single();
  if (venueErr || !venue) {
    throw new AppError("NOT_FOUND", "Venue not found", { status: 404 });
  }

  const documentId = randomUUID();
  const storagePath = buildVenueDocumentStoragePath({
    venueId: input.venueId,
    documentId,
    fileName: input.fileName,
  });

  const { error: upErr } = await client.storage
    .from(VENUE_ONBOARDING_BUCKET)
    .upload(storagePath, input.bytes, {
      contentType: input.mimeType,
      upsert: false,
    });
  if (upErr) {
    throw new AppError("INTERNAL_ERROR", "Failed to store document", {
      cause: upErr,
      status: 500,
    });
  }

  const now = new Date().toISOString();
  const entry: VenueDocumentManifestEntry = {
    id: documentId,
    label: input.label,
    referenceNote: null,
    storagePath,
    fileName: input.fileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    submittedAt: now,
    submittedByUserId: input.actorUserId,
    reviewStatus: "pending",
  };

  const existing = parseVenueOnboarding(venue.metadata).documents ?? [];
  const metadata = mergeVenueOnboardingMetadata(venue.metadata, {
    documents: [...existing, entry],
  });

  const { data, error } = await client
    .from("marketplace_venues")
    .update({ metadata })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to persist document metadata", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.document_uploaded",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: { documentId, storagePath, label: input.label },
    correlationId: input.correlationId,
  });

  return { venue: data, document: entry };
}

export async function createVenueDocumentSignedUrl(
  client: SupabaseClient,
  input: {
    venueId: string;
    documentId: string;
    actorUserId: string;
    assignments: RoleAssignment[];
    correlationId?: string;
  }
) {
  await assertVenueOnboardingDocumentAccess(client, {
    venueId: input.venueId,
    actorUserId: input.actorUserId,
    assignments: input.assignments,
  });

  const { data: venue, error } = await client
    .from("marketplace_venues")
    .select("metadata")
    .eq("id", input.venueId)
    .single();
  if (error || !venue) {
    throw new AppError("NOT_FOUND", "Venue not found", { status: 404 });
  }

  const doc = (parseVenueOnboarding(venue.metadata).documents ?? []).find(
    (d) => d.id === input.documentId
  );
  if (!doc?.storagePath) {
    throw new AppError("NOT_FOUND", "Stored document not found", { status: 404 });
  }

  const { data: signed, error: signErr } = await client.storage
    .from(VENUE_ONBOARDING_BUCKET)
    .createSignedUrl(doc.storagePath, SIGNED_URL_TTL_SECONDS);
  if (signErr || !signed?.signedUrl) {
    throw new AppError("INTERNAL_ERROR", "Failed to authorize document access", {
      cause: signErr,
      status: 500,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.document_access_authorized",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: { documentId: input.documentId },
    correlationId: input.correlationId,
  });

  return {
    signedUrl: signed.signedUrl,
    expiresInSeconds: SIGNED_URL_TTL_SECONDS,
    document: doc,
  };
}
