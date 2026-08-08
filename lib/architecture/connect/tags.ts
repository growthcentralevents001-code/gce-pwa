import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { tagSurchargeForSlot } from "./rules";
import { ASSOCIATE_PRICE_MINOR, MAX_TAGS, PRICING_RULE_VERSION } from "./types";

export async function setMembershipTags(
  client: SupabaseClient,
  input: {
    membershipId: string;
    tags: Array<{ slot: number; tagKey: string; tagLabel: string }>;
    actorUserId: string;
    baseMinor?: number;
    correlationId?: string;
  }
) {
  if (input.tags.length > MAX_TAGS) {
    throw new AppError("VALIDATION_ERROR", "Maximum 4 Tags allowed", {
      status: 400,
    });
  }
  const slots = input.tags.map((t) => t.slot);
  if (new Set(slots).size !== slots.length) {
    throw new AppError("VALIDATION_ERROR", "Duplicate tag slots", { status: 400 });
  }
  for (const t of input.tags) {
    if (t.slot < 1 || t.slot > MAX_TAGS) {
      throw new AppError("VALIDATION_ERROR", "Invalid tag slot", { status: 400 });
    }
  }

  // Replace active tags for membership
  await client
    .from("membership_tags")
    .update({ status: "replaced", effective_to: new Date().toISOString() })
    .eq("membership_id", input.membershipId)
    .eq("status", "active");

  const base = input.baseMinor ?? ASSOCIATE_PRICE_MINOR;
  const rows = input.tags.map((t) => {
    const pricing = tagSurchargeForSlot(t.slot, base);
    return {
      membership_id: input.membershipId,
      tag_slot: t.slot,
      tag_key: t.tagKey,
      tag_label: t.tagLabel,
      is_included: pricing.isIncluded,
      surcharge_bps: pricing.surchargeBps,
      surcharge_minor: pricing.surchargeMinor,
      pricing_rule_version: PRICING_RULE_VERSION,
      status: "active",
    };
  });

  const { data, error } = await client
    .from("membership_tags")
    .upsert(rows, { onConflict: "membership_id,tag_slot" })
    .select("*");

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to save tags", { cause: error });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "membership.tags_set",
    resourceType: "connect_membership",
    resourceId: input.membershipId,
    after: data,
    correlationId: input.correlationId,
  });

  return data ?? [];
}

export async function listMembershipTags(
  client: SupabaseClient,
  membershipId: string
) {
  const { data, error } = await client
    .from("membership_tags")
    .select("*")
    .eq("membership_id", membershipId)
    .eq("status", "active")
    .order("tag_slot", { ascending: true });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load tags", { cause: error });
  }
  return data ?? [];
}
