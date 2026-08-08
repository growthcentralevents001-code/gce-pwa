import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { membershipMachine } from "./rules";
import type {
  AllocationStatus,
  ConnectMembership,
  MembershipStatus,
} from "./types";
import { GRACE_DAYS, PRICING_RULE_VERSION } from "./types";

function mapMembership(row: Record<string, unknown>): ConnectMembership {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    planId: String(row.plan_id),
    status: row.status as MembershipStatus,
    allocationStatus: row.allocation_status as AllocationStatus,
    specialisationId: (row.specialisation_id as string | null) ?? null,
    organisationId: (row.organisation_id as string | null) ?? null,
    paymentIntentId: (row.payment_intent_id as string | null) ?? null,
    kycCaseId: (row.kyc_case_id as string | null) ?? null,
    preferredCity: (row.preferred_city as string | null) ?? null,
    preferredState: (row.preferred_state as string | null) ?? null,
    connectBdpUserId: (row.connect_bdp_user_id as string | null) ?? null,
    activatedAt: (row.activated_at as string | null) ?? null,
    startsAt: (row.starts_at as string | null) ?? null,
    endsAt: (row.ends_at as string | null) ?? null,
  };
}

async function appendMembershipEvent(
  client: SupabaseClient,
  input: {
    membershipId: string;
    eventType: string;
    fromStatus?: MembershipStatus | null;
    toStatus?: MembershipStatus | null;
    fromAllocation?: AllocationStatus | null;
    toAllocation?: AllocationStatus | null;
    actorUserId?: string | null;
    reason?: string | null;
    metadata?: Record<string, unknown>;
  }
) {
  await client.from("connect_membership_events").insert({
    membership_id: input.membershipId,
    event_type: input.eventType,
    from_status: input.fromStatus ?? null,
    to_status: input.toStatus ?? null,
    from_allocation: input.fromAllocation ?? null,
    to_allocation: input.toAllocation ?? null,
    actor_user_id: input.actorUserId ?? null,
    reason: input.reason ?? null,
    metadata: input.metadata ?? {},
  });
}

export async function getAssociatePlanId(client: SupabaseClient): Promise<string> {
  const { data, error } = await client
    .from("membership_plans")
    .select("id, is_purchasable")
    .eq("plan_key", "associate")
    .single();
  if (error || !data) {
    throw new AppError("NOT_FOUND", "Associate plan not configured", { status: 404 });
  }
  if (!data.is_purchasable) {
    throw new AppError("FEATURE_DISABLED", "Associate purchase disabled", {
      status: 403,
    });
  }
  return String(data.id);
}

export async function createMembershipDraft(
  client: SupabaseClient,
  input: {
    userId: string;
    specialisationId?: string | null;
    organisationId?: string | null;
    preferredCity?: string | null;
    preferredState?: string | null;
    preferredDistrict?: string | null;
    preferredLocality?: string | null;
    connectBdpUserId?: string | null;
    attributionProvenance?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<ConnectMembership> {
  const planId = await getAssociatePlanId(client);
  const { data, error } = await client
    .from("connect_memberships")
    .insert({
      user_id: input.userId,
      plan_id: planId,
      status: "draft",
      allocation_status: "unallocated",
      specialisation_id: input.specialisationId ?? null,
      organisation_id: input.organisationId ?? null,
      preferred_city: input.preferredCity ?? null,
      preferred_state: input.preferredState ?? null,
      preferred_district: input.preferredDistrict ?? null,
      preferred_locality: input.preferredLocality ?? null,
      connect_bdp_user_id: input.connectBdpUserId ?? null,
      attribution_provenance: input.attributionProvenance ?? null,
      pricing_rule_version: PRICING_RULE_VERSION,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create membership", {
      cause: error,
    });
  }

  await appendMembershipEvent(client, {
    membershipId: String(data.id),
    eventType: "membership.created",
    toStatus: "draft",
    toAllocation: "unallocated",
    actorUserId: input.actorUserId,
  });

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "membership.create",
    resourceType: "connect_membership",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return mapMembership(data as Record<string, unknown>);
}

async function transitionMembership(
  client: SupabaseClient,
  input: {
    membershipId: string;
    transition: string;
    actorUserId: string;
    reason?: string;
    patch?: Record<string, unknown>;
    correlationId?: string;
  }
): Promise<ConnectMembership> {
  const { data: existing, error } = await client
    .from("connect_memberships")
    .select("*")
    .eq("id", input.membershipId)
    .single();
  if (error || !existing) {
    throw new AppError("NOT_FOUND", "Membership not found", { status: 404 });
  }

  const from = existing.status as MembershipStatus;
  const to = await membershipMachine.transition(from, input.transition, {
    actorUserId: input.actorUserId,
    reason: input.reason,
  });

  // Hard invariant: payment success uses payment_succeeded → pending_verification, never active
  if (input.transition === "payment_succeeded" && to === "active") {
    throw new AppError(
      "INVALID_TRANSITION",
      "Payment success must not activate membership",
      { status: 409 }
    );
  }

  const { data, error: upErr } = await client
    .from("connect_memberships")
    .update({
      status: to,
      ...(input.patch ?? {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.membershipId)
    .select("*")
    .single();

  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to update membership", {
      cause: upErr,
    });
  }

  await appendMembershipEvent(client, {
    membershipId: input.membershipId,
    eventType: `membership.${input.transition}`,
    fromStatus: from,
    toStatus: to,
    actorUserId: input.actorUserId,
    reason: input.reason ?? null,
  });

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: `membership.${input.transition}`,
    resourceType: "connect_membership",
    resourceId: input.membershipId,
    before: existing,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return mapMembership(data as Record<string, unknown>);
}

export async function submitMembership(
  client: SupabaseClient,
  input: { membershipId: string; actorUserId: string; correlationId?: string }
) {
  return transitionMembership(client, {
    ...input,
    transition: "submit",
  }).then((m) =>
    transitionMembership(client, {
      ...input,
      transition: "require_payment",
    }).catch(() => m)
  );
}

export async function recordMembershipPaymentSuccess(
  client: SupabaseClient,
  input: {
    membershipId: string;
    paymentIntentId: string;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<ConnectMembership> {
  // Idempotent: if already past payment, return current
  const { data: existing } = await client
    .from("connect_memberships")
    .select("*")
    .eq("id", input.membershipId)
    .maybeSingle();
  if (!existing) {
    throw new AppError("NOT_FOUND", "Membership not found", { status: 404 });
  }
  const status = existing.status as MembershipStatus;
  if (
    status !== "pending_payment" &&
    status !== "applied" &&
    status !== "draft"
  ) {
    return mapMembership(existing as Record<string, unknown>);
  }

  if (status === "draft" || status === "applied") {
    await transitionMembership(client, {
      membershipId: input.membershipId,
      transition: status === "draft" ? "submit" : "require_payment",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
    });
    if (status === "draft") {
      await transitionMembership(client, {
        membershipId: input.membershipId,
        transition: "require_payment",
        actorUserId: input.actorUserId,
        correlationId: input.correlationId,
      });
    }
  }

  return transitionMembership(client, {
    membershipId: input.membershipId,
    transition: "payment_succeeded",
    actorUserId: input.actorUserId,
    reason: "Payment recorded",
    correlationId: input.correlationId,
    patch: { payment_intent_id: input.paymentIntentId },
  });
}

/**
 * Platform activation — independent of Circle allocation (FD-036).
 * Organic/unattributed membership may activate with null BDP attribution.
 */
export async function activateMembership(
  client: SupabaseClient,
  input: {
    membershipId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
): Promise<ConnectMembership> {
  const { data: existing } = await client
    .from("connect_memberships")
    .select("*")
    .eq("id", input.membershipId)
    .single();
  if (!existing) {
    throw new AppError("NOT_FOUND", "Membership not found", { status: 404 });
  }
  if (existing.user_id === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Members may not self-activate membership",
      { status: 403 }
    );
  }

  const starts = new Date();
  const ends = new Date(starts);
  ends.setMonth(ends.getMonth() + 3);

  let m = mapMembership(existing as Record<string, unknown>);
  if (m.status === "pending_verification") {
    m = await transitionMembership(client, {
      membershipId: input.membershipId,
      transition: "verification_cleared",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
    });
  }

  return transitionMembership(client, {
    membershipId: input.membershipId,
    transition: "activate",
    actorUserId: input.actorUserId,
    reason: input.reason ?? "Platform activation",
    correlationId: input.correlationId,
    patch: {
      activated_at: starts.toISOString(),
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      // allocation_status left unchanged — may remain unallocated
    },
  });
}

export async function suspendMembership(
  client: SupabaseClient,
  input: {
    membershipId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
) {
  return transitionMembership(client, {
    membershipId: input.membershipId,
    transition: "suspend",
    actorUserId: input.actorUserId,
    reason: input.reason,
    correlationId: input.correlationId,
    patch: {
      suspended_at: new Date().toISOString(),
      suspended_by: input.actorUserId,
      suspend_reason: input.reason,
    },
  });
}

export async function enterGracePeriod(
  client: SupabaseClient,
  input: { membershipId: string; actorUserId: string; correlationId?: string }
) {
  const graceEnds = new Date();
  graceEnds.setDate(graceEnds.getDate() + GRACE_DAYS);
  return transitionMembership(client, {
    ...input,
    transition: "enter_grace",
    patch: { grace_ends_at: graceEnds.toISOString() },
  });
}

export async function getMembership(
  client: SupabaseClient,
  membershipId: string
): Promise<ConnectMembership | null> {
  const { data, error } = await client
    .from("connect_memberships")
    .select("*")
    .eq("id", membershipId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load membership", {
      cause: error,
    });
  }
  return data ? mapMembership(data as Record<string, unknown>) : null;
}

export async function listMembershipsForUser(
  client: SupabaseClient,
  userId: string
): Promise<ConnectMembership[]> {
  const { data, error } = await client
    .from("connect_memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list memberships", {
      cause: error,
    });
  }
  return (data ?? []).map((r) => mapMembership(r as Record<string, unknown>));
}
