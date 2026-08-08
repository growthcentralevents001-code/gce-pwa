import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { SEAT_RESERVATION_DAYS, CIRCLE_CAPACITY_MAX } from "./types";
import { refreshCircleCapacity } from "./circles";

export async function getSeatAvailability(
  client: SupabaseClient,
  circleId: string
): Promise<{
  capacityMax: number;
  activeSeats: number;
  remaining: number;
  canAccept: boolean;
}> {
  const { data: circle, error } = await client
    .from("connect_circles")
    .select("capacity_max, active_seat_count")
    .eq("id", circleId)
    .single();
  if (error || !circle) {
    throw new AppError("NOT_FOUND", "Circle not found", { status: 404 });
  }
  const capacityMax = Number(circle.capacity_max ?? CIRCLE_CAPACITY_MAX);
  const activeSeats = Number(circle.active_seat_count ?? 0);
  const remaining = Math.max(0, capacityMax - activeSeats);
  return {
    capacityMax,
    activeSeats,
    remaining,
    canAccept: remaining > 0,
  };
}

export async function proposeAllocation(
  client: SupabaseClient,
  input: {
    membershipId: string;
    circleId: string;
    specialisationId?: string | null;
    actorUserId: string;
    assistedByBdpUserId?: string | null;
    reason?: string;
    correlationId?: string;
  }
) {
  const availability = await getSeatAvailability(client, input.circleId);
  if (!availability.canAccept) {
    throw new AppError("CONFLICT", "Circle has no remaining seats", {
      status: 409,
    });
  }

  const reservedUntil = new Date();
  reservedUntil.setDate(reservedUntil.getDate() + SEAT_RESERVATION_DAYS);

  const { data: seat, error: seatErr } = await client
    .from("connect_circle_seats")
    .insert({
      circle_id: input.circleId,
      membership_id: input.membershipId,
      specialisation_id: input.specialisationId ?? null,
      status: "reserved",
      reserved_until: reservedUntil.toISOString(),
      counts_toward_capacity: false,
    })
    .select("*")
    .single();

  if (seatErr || !seat) {
    throw new AppError("INTERNAL_ERROR", "Failed to reserve seat", {
      cause: seatErr,
    });
  }

  const { data: proposal, error } = await client
    .from("circle_allocation_proposals")
    .insert({
      membership_id: input.membershipId,
      circle_id: input.circleId,
      specialisation_id: input.specialisationId ?? null,
      status: "proposed",
      proposed_by: input.actorUserId,
      assisted_by_bdp_user_id: input.assistedByBdpUserId ?? null,
      seat_id: seat.id,
      due_business_days: 7,
      reason: input.reason ?? null,
    })
    .select("*")
    .single();

  if (error || !proposal) {
    throw new AppError("INTERNAL_ERROR", "Failed to create allocation proposal", {
      cause: error,
    });
  }

  await client
    .from("connect_memberships")
    .update({ allocation_status: "pending_allocation" })
    .eq("id", input.membershipId);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "allocation.propose",
    resourceType: "circle_allocation_proposal",
    resourceId: String(proposal.id),
    after: proposal,
    correlationId: input.correlationId,
  });

  return { proposal, seat };
}

/**
 * Platform confirmation — BDP optional (organic members ok).
 * Uses DB function for concurrency-safe capacity.
 */
export async function confirmAllocation(
  client: SupabaseClient,
  input: {
    proposalId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: proposal, error } = await client
    .from("circle_allocation_proposals")
    .select("*")
    .eq("id", input.proposalId)
    .single();
  if (error || !proposal) {
    throw new AppError("NOT_FOUND", "Allocation proposal not found", {
      status: 404,
    });
  }
  if (!proposal.seat_id) {
    throw new AppError("CONFLICT", "Proposal has no reserved seat", {
      status: 409,
    });
  }

  const { data: seat, error: seatErr } = await client.rpc(
    "gce_confirm_circle_seat",
    {
      p_seat_id: proposal.seat_id,
      p_actor: input.actorUserId,
    }
  );
  if (seatErr) {
    throw new AppError("CONFLICT", seatErr.message || "Seat confirmation failed", {
      status: 409,
      cause: seatErr,
    });
  }

  const { data: updated, error: upErr } = await client
    .from("circle_allocation_proposals")
    .update({
      status: "confirmed",
      confirmed_by: input.actorUserId,
      reason: input.reason ?? proposal.reason,
    })
    .eq("id", input.proposalId)
    .select("*")
    .single();

  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to confirm proposal", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "allocation.confirm",
    resourceType: "circle_allocation_proposal",
    resourceId: input.proposalId,
    after: { proposal: updated, seat },
    correlationId: input.correlationId,
    reason: input.reason,
  });

  const circle = await refreshCircleCapacity(
    client,
    String(proposal.circle_id),
    input.actorUserId
  );

  return { proposal: updated, seat, circle };
}

export async function addToWaitlist(
  client: SupabaseClient,
  input: {
    membershipId: string;
    specialisationId?: string | null;
    preferredCity?: string | null;
    preferredDistrict?: string | null;
    preferredState?: string | null;
    preferredCircleId?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("circle_waitlist_entries")
    .insert({
      membership_id: input.membershipId,
      specialisation_id: input.specialisationId ?? null,
      preferred_city: input.preferredCity ?? null,
      preferred_district: input.preferredDistrict ?? null,
      preferred_state: input.preferredState ?? null,
      preferred_circle_id: input.preferredCircleId ?? null,
      status: "active",
      admin_priority: 0,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create waitlist entry", {
      cause: error,
    });
  }

  await client
    .from("connect_memberships")
    .update({ allocation_status: "waitlisted" })
    .eq("id", input.membershipId);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "waitlist.add",
    resourceType: "circle_waitlist_entry",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

/**
 * Operational ordering only — not a contractual fairness formula (OD-023).
 */
export async function listWaitlistOperationalOrder(
  client: SupabaseClient,
  options?: { city?: string | null; limit?: number }
) {
  let q = client
    .from("circle_waitlist_entries")
    .select("*")
    .eq("status", "active")
    .order("admin_priority", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(options?.limit ?? 50);

  if (options?.city) {
    q = q.eq("preferred_city", options.city);
  }

  const { data, error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load waitlist", {
      cause: error,
    });
  }
  return data ?? [];
}
