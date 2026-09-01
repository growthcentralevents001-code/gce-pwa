import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export const VENUE_RELATIONSHIP_STATUSES = [
  "new",
  "engaged",
  "onboarding",
  "active_partnership",
  "needs_attention",
  "dormant",
] as const;

export type VenueRelationshipStatus =
  (typeof VENUE_RELATIONSHIP_STATUSES)[number];

export type VenueRelationshipState = {
  relationshipStatus?: VenueRelationshipStatus | null;
  lastInteractionAt?: string | null;
  lastInteractionNote?: string | null;
  nextFollowUpAt?: string | null;
  supportRequired?: boolean;
  supportNote?: string | null;
  updatedAt?: string | null;
  updatedByUserId?: string | null;
};

export const venueRelationshipUpdateSchema = z.object({
  attributionId: z.string().uuid(),
  relationshipStatus: z.enum(VENUE_RELATIONSHIP_STATUSES).optional(),
  lastInteractionAt: z.string().datetime().optional().nullable(),
  lastInteractionNote: z.string().max(1000).optional().nullable(),
  nextFollowUpAt: z.string().datetime().optional().nullable(),
  supportRequired: z.boolean().optional(),
  supportNote: z.string().max(1000).optional().nullable(),
});

export function parseVenueRelationship(
  metadata: unknown
): VenueRelationshipState {
  if (!metadata || typeof metadata !== "object") return {};
  const rel = (metadata as Record<string, unknown>).relationship;
  if (!rel || typeof rel !== "object") return {};
  return rel as VenueRelationshipState;
}

export async function updateVenueRelationship(
  client: SupabaseClient,
  input: {
    attributionId: string;
    actorUserId: string;
    patch: Omit<z.infer<typeof venueRelationshipUpdateSchema>, "attributionId">;
    correlationId?: string;
  }
) {
  const { data: attr, error } = await client
    .from("marketplace_venue_attributions")
    .select("id, venue_id, unit_id, bdp_user_id, status, metadata")
    .eq("id", input.attributionId)
    .single();

  if (error || !attr) {
    throw new AppError("NOT_FOUND", "Venue attribution not found", {
      status: 404,
    });
  }

  if (String(attr.bdp_user_id) !== input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Not allowed to manage relationship for this Venue",
      { status: 403 }
    );
  }

  if (!["active", "proposed"].includes(String(attr.status))) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Relationship notes only apply to assigned or proposed attributions",
      { status: 400 }
    );
  }

  const existingMeta =
    attr.metadata && typeof attr.metadata === "object"
      ? (attr.metadata as Record<string, unknown>)
      : {};
  const existingRel = parseVenueRelationship(existingMeta);
  const now = new Date().toISOString();

  const relationship: VenueRelationshipState = {
    ...existingRel,
    ...(input.patch.relationshipStatus !== undefined
      ? { relationshipStatus: input.patch.relationshipStatus }
      : {}),
    ...(input.patch.lastInteractionAt !== undefined
      ? { lastInteractionAt: input.patch.lastInteractionAt }
      : {}),
    ...(input.patch.lastInteractionNote !== undefined
      ? { lastInteractionNote: input.patch.lastInteractionNote }
      : {}),
    ...(input.patch.nextFollowUpAt !== undefined
      ? { nextFollowUpAt: input.patch.nextFollowUpAt }
      : {}),
    ...(input.patch.supportRequired !== undefined
      ? { supportRequired: input.patch.supportRequired }
      : {}),
    ...(input.patch.supportNote !== undefined
      ? { supportNote: input.patch.supportNote }
      : {}),
    updatedAt: now,
    updatedByUserId: input.actorUserId,
  };

  const { data: updated, error: upErr } = await client
    .from("marketplace_venue_attributions")
    .update({
      metadata: { ...existingMeta, relationship },
    })
    .eq("id", input.attributionId)
    .select("id, venue_id, unit_id, status, metadata, updated_at")
    .single();

  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to update venue relationship", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    action: "marketplace_bdp.venue_relationship_update",
    resourceType: "marketplace_venue_attributions",
    resourceId: input.attributionId,
    actorUserId: input.actorUserId,
    before: { relationship: existingRel },
    after: { relationship },
    correlationId: input.correlationId,
  });

  return {
    attribution: updated,
    relationship,
  };
}
