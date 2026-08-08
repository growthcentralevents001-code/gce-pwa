import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import type { OrganisationCreateInput } from "../validation/schemas";
import { createOrganisation } from "./create";

export type OrganisationMembership = {
  id: string;
  organisationId: string;
  userId: string;
  membershipRole: string;
  status: string;
  isPrimary: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
};

function mapMembership(row: Record<string, unknown>): OrganisationMembership {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    userId: String(row.user_id),
    membershipRole: String(row.membership_role),
    status: String(row.status),
    isPrimary: Boolean(row.is_primary),
    effectiveFrom: String(row.effective_from),
    effectiveTo: (row.effective_to as string | null) ?? null,
  };
}

export async function getOrganisation(
  client: SupabaseClient,
  organisationId: string
) {
  const { data, error } = await client
    .from("organisations")
    .select("*")
    .eq("id", organisationId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load organisation", {
      cause: error,
    });
  }
  return data;
}

export async function listUserOrganisations(
  client: SupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from("organisation_memberships")
    .select("*, organisations(*)")
    .eq("user_id", userId)
    .in("status", ["active", "invited"]);

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list organisations", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function manageOrganisationMembership(
  client: SupabaseClient,
  input: {
    organisationId: string;
    userId: string;
    membershipRole?:
      | "owner"
      | "admin"
      | "representative"
      | "member"
      | "billing_contact"
      | "viewer";
    status?: "invited" | "active" | "suspended" | "revoked";
    isPrimary?: boolean;
    effectiveFrom?: string;
    effectiveTo?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<OrganisationMembership> {
  const row = {
    organisation_id: input.organisationId,
    user_id: input.userId,
    membership_role: input.membershipRole ?? "member",
    status: input.status ?? "invited",
    is_primary: input.isPrimary ?? false,
    effective_from: input.effectiveFrom ?? new Date().toISOString(),
    effective_to: input.effectiveTo ?? null,
  };

  const { data, error } = await client
    .from("organisation_memberships")
    .upsert(row, { onConflict: "organisation_id,user_id,membership_role" })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to manage organisation membership", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "organisation_membership.upsert",
    resourceType: "organisation_membership",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return mapMembership(data as Record<string, unknown>);
}

export async function suspendOrganisationMembership(
  client: SupabaseClient,
  input: {
    membershipId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
): Promise<OrganisationMembership> {
  const { data, error } = await client
    .from("organisation_memberships")
    .update({ status: "suspended" })
    .eq("id", input.membershipId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to suspend membership", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "organisation_membership.suspend",
    resourceType: "organisation_membership",
    resourceId: input.membershipId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return mapMembership(data as Record<string, unknown>);
}

export async function createOrganisationWithOptionalPrimaryRep(
  client: SupabaseClient,
  input: OrganisationCreateInput & {
    primaryRepresentativeUserId?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const org = await createOrganisation(
    client,
    {
      kind: input.kind,
      legalName: input.legalName,
      tradingName: input.tradingName,
      primaryCity: input.primaryCity,
      gstin: input.gstin,
      countryCode: input.countryCode,
    },
    { userId: input.actorUserId, correlationId: input.correlationId }
  );

  if (input.primaryRepresentativeUserId) {
    await manageOrganisationMembership(client, {
      organisationId: String(org.id),
      userId: input.primaryRepresentativeUserId,
      membershipRole: "representative",
      status: "active",
      isPrimary: true,
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
    });
  }

  return org;
}
