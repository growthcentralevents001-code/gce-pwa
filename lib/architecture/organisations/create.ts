import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import type { OrganisationCreateInput } from "../validation/schemas";
import { writeAuditEvent } from "../audit/write";

export async function createOrganisation(
  client: SupabaseClient,
  input: OrganisationCreateInput,
  actor: { userId: string; correlationId?: string }
) {
  const { data, error } = await client
    .from("organisations")
    .insert({
      kind: input.kind,
      legal_name: input.legalName,
      trading_name: input.tradingName ?? null,
      primary_city: input.primaryCity ?? null,
      gstin: input.gstin ?? null,
      country_code: input.countryCode ?? "IN",
      status: "draft",
      created_by: actor.userId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create organisation", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: actor.userId,
    action: "organisation.create",
    resourceType: "organisation",
    resourceId: String(data.id),
    after: data,
    correlationId: actor.correlationId,
  });

  return data;
}
