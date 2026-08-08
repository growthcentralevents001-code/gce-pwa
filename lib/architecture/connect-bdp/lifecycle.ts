import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export async function openConnectBdpDispute(
  client: SupabaseClient,
  input: {
    unitId: string;
    openedBy: string;
    circleId?: string | null;
    membershipId?: string | null;
    subject: string;
    details?: string | null;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_disputes")
    .insert({
      unit_id: input.unitId,
      opened_by: input.openedBy,
      circle_id: input.circleId ?? null,
      membership_id: input.membershipId ?? null,
      status: "bdp_first_level",
      subject: input.subject,
      details: input.details ?? null,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to open dispute", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.openedBy,
    action: "connect_bdp.dispute_open",
    resourceType: "connect_bdp_dispute",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/** Escalate to Platform Relationship Manager — no commission for PRM. */
export async function escalateDisputeToPrm(
  client: SupabaseClient,
  input: {
    disputeId: string;
    prmUserId: string;
    actorUserId: string;
    notes?: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_disputes")
    .update({
      status: "escalated_prm",
      prm_user_id: input.prmUserId,
      details: input.notes ?? null,
    })
    .eq("id", input.disputeId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to escalate dispute", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.dispute_escalate_prm",
    resourceType: "connect_bdp_dispute",
    resourceId: input.disputeId,
    after: data,
    correlationId: input.correlationId,
    metadata: { prm_has_automatic_commission: false },
  });
  return data;
}

export async function resolveConnectBdpDispute(
  client: SupabaseClient,
  input: {
    disputeId: string;
    actorUserId: string;
    resolutionNotes: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_disputes")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      resolved_by: input.actorUserId,
      resolution: input.resolutionNotes,
    })
    .eq("id", input.disputeId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to resolve dispute", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.dispute_resolve",
    resourceType: "connect_bdp_dispute",
    resourceId: input.disputeId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/**
 * Controlled handover — prospective attribution only.
 * Already-earned approved entitlements remain with the source unit.
 */
export async function createConnectBdpHandover(
  client: SupabaseClient,
  input: {
    fromUnitId: string;
    toUnitId: string;
    circleId?: string | null;
    actorUserId: string;
    notes?: string | null;
    approve?: boolean;
    correlationId?: string;
  }
) {
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("connect_bdp_handovers")
    .insert({
      source_unit_id: input.fromUnitId,
      target_unit_id: input.toUnitId,
      status: input.approve ? "approved" : "requested",
      requested_by: input.actorUserId,
      approved_by: input.approve ? input.actorUserId : null,
      notes: input.notes ?? null,
      effective_from: now,
      completed_at: input.approve ? now : null,
      metadata: { circle_id: input.circleId ?? null },
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create handover", {
      cause: error,
    });
  }

  if (input.approve && input.circleId) {
    await client
      .from("connect_bdp_circle_assignments")
      .update({
        status: "handed_over",
        effective_to: now,
      })
      .eq("unit_id", input.fromUnitId)
      .eq("circle_id", input.circleId)
      .eq("status", "active");

    await client.from("connect_bdp_circle_assignments").insert({
      unit_id: input.toUnitId,
      circle_id: input.circleId,
      status: "active",
      assigned_by: input.actorUserId,
      reason: `Handover from unit ${input.fromUnitId}`,
    });

    await client.rpc("gce_connect_bdp_refresh_portfolio_counts", {
      p_unit_id: input.fromUnitId,
    });
    await client.rpc("gce_connect_bdp_refresh_portfolio_counts", {
      p_unit_id: input.toUnitId,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.handover",
    resourceType: "connect_bdp_handover",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

export async function terminateConnectBdpUnit(
  client: SupabaseClient,
  input: {
    unitId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
) {
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("connect_bdp_units")
    .update({
      application_status: "terminated",
      terminated_at: now,
    })
    .eq("id", input.unitId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to terminate Connect BDP", {
      cause: error,
    });
  }

  await client
    .from("connect_bdp_city_assignments")
    .update({ status: "ended", effective_to: now })
    .eq("unit_id", input.unitId)
    .eq("status", "active");

  await client
    .from("connect_bdp_circle_assignments")
    .update({ status: "inactive", effective_to: now })
    .eq("unit_id", input.unitId)
    .eq("status", "active");

  await client
    .from("connect_bdp_member_attributions")
    .update({ status: "reassigned_closed", effective_to: now })
    .eq("unit_id", input.unitId)
    .eq("status", "active");

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.terminate",
    resourceType: "connect_bdp_unit",
    resourceId: input.unitId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return data;
}
