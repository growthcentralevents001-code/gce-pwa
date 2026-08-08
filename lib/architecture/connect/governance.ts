import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { GB_TERM_MONTHS } from "./types";
import type { GceRoleKey } from "../types";
import { createRoleAssignment } from "../identity/assignments";
import type { RoleAssignment } from "../types";
import { activateRoleAssignment } from "../identity/assignments";

const GOV_ROLES: GceRoleKey[] = [
  "governing_body_member",
  "circle_finance_coordinator",
  "sergeant_at_arms",
];

export async function appointCircleGovernance(
  client: SupabaseClient,
  input: {
    circleId: string;
    userId: string;
    roleKey: GceRoleKey;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason?: string;
    correlationId?: string;
  }
) {
  if (!GOV_ROLES.includes(input.roleKey)) {
    throw new AppError("VALIDATION_ERROR", "Role not allowed for Circle governance", {
      status: 400,
    });
  }
  if (input.userId === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Cannot self-appoint Circle governance roles", {
      status: 403,
    });
  }

  const starts = new Date();
  const ends = new Date(starts);
  ends.setMonth(ends.getMonth() + GB_TERM_MONTHS);

  const assignment = await createRoleAssignment(
    client,
    {
      userId: input.userId,
      roleKey: input.roleKey,
      status: "pending",
      scopeType: "circle",
      scopeId: input.circleId,
      reason: input.reason ?? "Circle governance appointment",
    },
    {
      userId: input.actorUserId,
      assignments: input.actorAssignments,
      correlationId: input.correlationId,
    }
  );

  const activated = await activateRoleAssignment(client, {
    assignmentId: assignment.id,
    actorUserId: input.actorUserId,
    actorAssignments: input.actorAssignments,
    reason: input.reason ?? "Activate Circle governance assignment",
    correlationId: input.correlationId,
  });

  const { data, error } = await client
    .from("circle_governance_appointments")
    .insert({
      circle_id: input.circleId,
      user_id: input.userId,
      role_key: input.roleKey,
      role_assignment_id: activated.id,
      status: "active",
      term_months: GB_TERM_MONTHS,
      starts_at: starts.toISOString(),
      ends_at: ends.toISOString(),
      appointed_by: input.actorUserId,
      reason: input.reason ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record governance appointment", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "circle.governance_appoint",
    resourceType: "circle_governance_appointment",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
    reason: input.reason,
  });

  return { appointment: data, assignment: activated };
}

export async function startKycCase(
  client: SupabaseClient,
  input: {
    userId: string;
    purpose?: "membership" | "seat" | "role_assignment" | "venue" | "other";
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("kyc_verification_cases")
    .insert({
      user_id: input.userId,
      purpose: input.purpose ?? "membership",
      status: "in_progress",
      aadhaar_used: false,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to start KYC case", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "kyc.started",
    resourceType: "kyc_verification_case",
    resourceId: String(data.id),
    after: { id: data.id, status: data.status, aadhaar_used: false },
    correlationId: input.correlationId,
  });

  return data;
}

export async function clearKycCase(
  client: SupabaseClient,
  input: {
    caseId: string;
    actorUserId: string;
    conditional?: boolean;
    reason?: string;
    correlationId?: string;
  }
) {
  if (!input.reason || input.reason.trim().length < 3) {
    throw new AppError("VALIDATION_ERROR", "KYC decision requires reason", {
      status: 400,
    });
  }
  const status = input.conditional ? "conditionally_cleared" : "cleared";
  const { data, error } = await client
    .from("kyc_verification_cases")
    .update({
      status,
      reviewer_user_id: input.actorUserId,
      reason: input.reason,
      cleared_at: new Date().toISOString(),
      aadhaar_used: false,
    })
    .eq("id", input.caseId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to clear KYC", { cause: error });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: input.conditional ? "kyc.conditional" : "kyc.cleared",
    resourceType: "kyc_verification_case",
    resourceId: input.caseId,
    after: { id: data.id, status: data.status, aadhaar_used: data.aadhaar_used },
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return data;
}

export async function requestCircleTransfer(
  client: SupabaseClient,
  input: {
    membershipId: string;
    sourceCircleId: string;
    targetCircleId: string;
    sourceSeatId?: string | null;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  if (input.sourceCircleId === input.targetCircleId) {
    throw new AppError("VALIDATION_ERROR", "Source and target Circles must differ", {
      status: 400,
    });
  }

  // First transfer in 12 months free — additional ₹1,000 (FD-027). Simplified: check completed transfers.
  const since = new Date();
  since.setFullYear(since.getFullYear() - 1);
  const { count } = await client
    .from("circle_transfers")
    .select("id", { count: "exact", head: true })
    .eq("membership_id", input.membershipId)
    .eq("status", "completed")
    .gte("completed_at", since.toISOString());

  const prior = count ?? 0;
  const adminFeeMinor = prior >= 1 ? 100_000 : 0;

  const { data, error } = await client
    .from("circle_transfers")
    .insert({
      membership_id: input.membershipId,
      source_circle_id: input.sourceCircleId,
      target_circle_id: input.targetCircleId,
      source_seat_id: input.sourceSeatId ?? null,
      status: "requested",
      preserve_bdp_attribution: true,
      admin_fee_minor: adminFeeMinor,
      fee_waived: adminFeeMinor === 0,
      requested_by: input.actorUserId,
      reason: input.reason ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to request transfer", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "transfer.request",
    resourceType: "circle_transfer",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

export async function completeCircleTransfer(
  client: SupabaseClient,
  input: {
    transferId: string;
    actorUserId: string;
    targetSeatId: string;
    correlationId?: string;
  }
) {
  const { data: transfer, error } = await client
    .from("circle_transfers")
    .select("*")
    .eq("id", input.transferId)
    .single();
  if (error || !transfer) {
    throw new AppError("NOT_FOUND", "Transfer not found", { status: 404 });
  }

  // Release source seat (does not count)
  if (transfer.source_seat_id) {
    await client
      .from("connect_circle_seats")
      .update({
        status: "released",
        counts_toward_capacity: false,
        released_at: new Date().toISOString(),
      })
      .eq("id", transfer.source_seat_id);
    await client.rpc("gce_refresh_circle_capacity", {
      p_circle_id: transfer.source_circle_id,
      p_actor: input.actorUserId,
    });
  }

  const { error: seatErr } = await client.rpc("gce_confirm_circle_seat", {
    p_seat_id: input.targetSeatId,
    p_actor: input.actorUserId,
  });
  if (seatErr) {
    throw new AppError("CONFLICT", seatErr.message || "Target seat confirm failed", {
      status: 409,
      cause: seatErr,
    });
  }

  const { data: updated, error: upErr } = await client
    .from("circle_transfers")
    .update({
      status: "completed",
      target_seat_id: input.targetSeatId,
      reviewed_by: input.actorUserId,
      completed_at: new Date().toISOString(),
    })
    .eq("id", input.transferId)
    .select("*")
    .single();

  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to complete transfer", {
      cause: upErr,
    });
  }

  // Attribution history preserved — no automatic BDP transfer
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "transfer.complete",
    resourceType: "circle_transfer",
    resourceId: input.transferId,
    after: updated,
    correlationId: input.correlationId,
    metadata: { preserve_bdp_attribution: true },
  });

  return updated;
}
