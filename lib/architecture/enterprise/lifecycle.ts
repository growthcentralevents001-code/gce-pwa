import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { createOpportunity, createRequirementVersion } from "./operations";
import { listClientsForRepresentative } from "./reporting";

export type RequirementReadinessStatus =
  | "submitted"
  | "under_review"
  | "info_requested"
  | "structuring"
  | "qualified"
  | "rejected";

async function loadOpportunity(
  client: SupabaseClient,
  opportunityId: string
) {
  const { data, error } = await client
    .from("enterprise_opportunities")
    .select("*")
    .eq("id", opportunityId)
    .maybeSingle();
  if (error || !data) {
    throw new AppError("NOT_FOUND", "Opportunity not found", { status: 404 });
  }
  return data;
}

async function loadRequirementForOpportunity(
  client: SupabaseClient,
  opportunityId: string
) {
  const { data, error } = await client
    .from("enterprise_requirements")
    .select("*")
    .eq("opportunity_id", opportunityId)
    .maybeSingle();
  if (error || !data) {
    throw new AppError("NOT_FOUND", "Requirement not found", { status: 404 });
  }
  return data;
}

export async function assertClientRepresentativeForClient(
  client: SupabaseClient,
  userId: string,
  clientId: string
) {
  const reps = await listClientsForRepresentative(client, userId);
  if (!reps.some((c) => String(c.id) === clientId)) {
    throw new AppError(
      "FORBIDDEN",
      "Not authorised for this Enterprise Client organisation",
      { status: 403 }
    );
  }
}

/** Client submits a new requirement — creates opportunity + requirement v1. */
export async function submitClientRequirement(
  client: SupabaseClient,
  input: {
    clientId: string;
    title: string;
    rawRequirement: string;
    summary?: string | null;
    category?: string | null;
    locations?: string | null;
    timelineNotes?: string | null;
    budgetGuidanceMinor?: number | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  await assertClientRepresentativeForClient(
    client,
    input.actorUserId,
    input.clientId
  );
  if (!input.rawRequirement.trim()) {
    throw new AppError("VALIDATION_ERROR", "Requirement description is required", {
      status: 400,
    });
  }

  const opportunity = await createOpportunity(client, {
    clientId: input.clientId,
    title: input.title.trim(),
    summary: input.summary ?? null,
    category: input.category ?? null,
    source: "direct_client",
    clientRepUserId: input.actorUserId,
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  const { data: requirement, error: reqErr } = await client
    .from("enterprise_requirements")
    .insert({
      opportunity_id: opportunity.id,
      current_version: 1,
      readiness_status: "submitted",
      structured_by: null,
      metadata: {
        submittedAt: new Date().toISOString(),
        submittedBy: input.actorUserId,
      },
    })
    .select("*")
    .single();
  if (reqErr || !requirement) {
    throw new AppError("INTERNAL_ERROR", "Failed to create requirement", {
      cause: reqErr,
    });
  }

  const { data: version, error: vErr } = await client
    .from("enterprise_requirement_versions")
    .insert({
      requirement_id: requirement.id,
      version_no: 1,
      raw_requirement: input.rawRequirement.trim(),
      locations: input.locations ?? null,
      timeline_notes: input.timelineNotes ?? null,
      budget_guidance_minor: input.budgetGuidanceMinor ?? null,
      change_reason: "client_submission",
      actor_user_id: input.actorUserId,
      approval_status: "submitted",
    })
    .select("*")
    .single();
  if (vErr || !version) {
    throw new AppError("INTERNAL_ERROR", "Failed to create requirement version", {
      cause: vErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_requirement.submit",
    resourceType: "enterprise_requirement",
    resourceId: String(requirement.id),
    after: { requirement, version, opportunityId: opportunity.id },
    correlationId: input.correlationId,
  });

  return { opportunity, requirement, version };
}

export async function startRequirementReview(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const requirement = await loadRequirementForOpportunity(
    client,
    input.opportunityId
  );
  if (!["submitted", "info_requested"].includes(requirement.readiness_status)) {
    throw new AppError("CONFLICT", "Requirement not eligible for review start", {
      status: 409,
    });
  }

  const { data: updated, error } = await client
    .from("enterprise_requirements")
    .update({
      readiness_status: "under_review",
      structured_by: input.actorUserId,
    })
    .eq("id", requirement.id)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to start review", { cause: error });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_requirement.review_start",
    resourceType: "enterprise_requirement",
    resourceId: String(requirement.id),
    before: requirement,
    after: updated,
    correlationId: input.correlationId,
  });
  return updated;
}

export async function requestRequirementInformation(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    message: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const requirement = await loadRequirementForOpportunity(
    client,
    input.opportunityId
  );
  const metadata =
    typeof requirement.metadata === "object" && requirement.metadata
      ? (requirement.metadata as Record<string, unknown>)
      : {};
  const history = Array.isArray(metadata.infoRequests)
    ? (metadata.infoRequests as Record<string, unknown>[])
    : [];

  const entry = {
    id: crypto.randomUUID(),
    message: input.message.trim(),
    requestedAt: new Date().toISOString(),
    requestedBy: input.actorUserId,
    respondedAt: null,
  };

  const { data: updated, error } = await client
    .from("enterprise_requirements")
    .update({
      readiness_status: "info_requested",
      metadata: {
        ...metadata,
        infoRequests: [...history, entry],
        latestInfoRequest: entry,
      },
    })
    .eq("id", requirement.id)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to request information", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_requirement.info_request",
    resourceType: "enterprise_requirement",
    resourceId: String(requirement.id),
    after: updated,
    reason: input.message,
    correlationId: input.correlationId,
  });
  return updated;
}

export async function respondRequirementInformation(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    clientId: string;
    response: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  await assertClientRepresentativeForClient(
    client,
    input.actorUserId,
    input.clientId
  );
  const requirement = await loadRequirementForOpportunity(
    client,
    input.opportunityId
  );
  if (requirement.readiness_status !== "info_requested") {
    throw new AppError("CONFLICT", "No information request is pending", {
      status: 409,
    });
  }

  const version = await createRequirementVersion(client, {
    opportunityId: input.opportunityId,
    rawRequirement: input.response.trim(),
    changeReason: "client_info_response",
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  const metadata =
    typeof requirement.metadata === "object" && requirement.metadata
      ? (requirement.metadata as Record<string, unknown>)
      : {};
  const latest =
    typeof metadata.latestInfoRequest === "object" && metadata.latestInfoRequest
      ? (metadata.latestInfoRequest as Record<string, unknown>)
      : null;

  const { data: updated, error } = await client
    .from("enterprise_requirements")
    .update({
      readiness_status: "submitted",
      metadata: {
        ...metadata,
        latestInfoRequest: latest
          ? { ...latest, respondedAt: new Date().toISOString() }
          : null,
      },
    })
    .eq("id", requirement.id)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to record client response", {
      cause: error,
    });
  }

  await client
    .from("enterprise_requirement_versions")
    .update({ approval_status: "submitted" })
    .eq("id", version.id);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_requirement.info_response",
    resourceType: "enterprise_requirement_version",
    resourceId: String(version.id),
    after: { version, requirement: updated },
    correlationId: input.correlationId,
  });
  return { requirement: updated, version };
}

export async function qualifyEnterpriseRequirement(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const [requirement, opportunity] = await Promise.all([
    loadRequirementForOpportunity(client, input.opportunityId),
    loadOpportunity(client, input.opportunityId),
  ]);
  if (
    !["under_review", "structuring", "submitted"].includes(
      requirement.readiness_status
    )
  ) {
    throw new AppError("CONFLICT", "Requirement not eligible for qualification", {
      status: 409,
    });
  }

  const { data: reqUpdated, error: reqErr } = await client
    .from("enterprise_requirements")
    .update({
      readiness_status: "qualified",
      structured_by: input.actorUserId,
    })
    .eq("id", requirement.id)
    .select("*")
    .single();
  if (reqErr || !reqUpdated) {
    throw new AppError("INTERNAL_ERROR", "Failed to qualify requirement", {
      cause: reqErr,
    });
  }

  const { data: oppUpdated, error: oppErr } = await client
    .from("enterprise_opportunities")
    .update({ status: "proposal_in_progress" })
    .eq("id", opportunity.id)
    .select("*")
    .single();
  if (oppErr || !oppUpdated) {
    throw new AppError("INTERNAL_ERROR", "Failed to advance opportunity", {
      cause: oppErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_requirement.qualify",
    resourceType: "enterprise_requirement",
    resourceId: String(requirement.id),
    before: requirement,
    after: reqUpdated,
    correlationId: input.correlationId,
  });
  return { requirement: reqUpdated, opportunity: oppUpdated };
}

export async function assignExpertToOpportunity(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    expertUserId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const opportunity = await loadOpportunity(client, input.opportunityId);
  const { data: updated, error } = await client
    .from("enterprise_opportunities")
    .update({
      expert_user_id: input.expertUserId,
      status:
        opportunity.status === "open" ? "qualifying" : opportunity.status,
    })
    .eq("id", input.opportunityId)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to assign expert", { cause: error });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_opportunity.assign_expert",
    resourceType: "enterprise_opportunity",
    resourceId: input.opportunityId,
    before: opportunity,
    after: updated,
    correlationId: input.correlationId,
  });
  return updated;
}

export async function closeEnterpriseOpportunity(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    outcome: "lost" | "cancelled";
    reason?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const [opportunity, requirement] = await Promise.all([
    loadOpportunity(client, input.opportunityId),
    loadRequirementForOpportunity(client, input.opportunityId).catch(() => null),
  ]);

  const { data: oppUpdated, error: oppErr } = await client
    .from("enterprise_opportunities")
    .update({ status: input.outcome })
    .eq("id", input.opportunityId)
    .select("*")
    .single();
  if (oppErr || !oppUpdated) {
    throw new AppError("INTERNAL_ERROR", "Failed to close opportunity", {
      cause: oppErr,
    });
  }

  if (requirement) {
    await client
      .from("enterprise_requirements")
      .update({ readiness_status: "rejected" })
      .eq("id", requirement.id);
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_opportunity.close",
    resourceType: "enterprise_opportunity",
    resourceId: input.opportunityId,
    before: opportunity,
    after: oppUpdated,
    reason: input.reason ?? undefined,
    correlationId: input.correlationId,
  });
  return oppUpdated;
}

export async function publishProposalToClient(
  client: SupabaseClient,
  input: {
    proposalId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: proposal, error } = await client
    .from("enterprise_solution_proposals")
    .select("*")
    .eq("id", input.proposalId)
    .single();
  if (error || !proposal) {
    throw new AppError("NOT_FOUND", "Proposal not found", { status: 404 });
  }

  const { data: updated, error: upErr } = await client
    .from("enterprise_solution_proposals")
    .update({
      internal_status: "published",
      client_facing_status: "issued",
      reviewed_by: input.actorUserId,
    })
    .eq("id", input.proposalId)
    .select("*")
    .single();
  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to publish proposal", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_proposal.publish",
    resourceType: "enterprise_solution_proposal",
    resourceId: input.proposalId,
    before: proposal,
    after: updated,
    correlationId: input.correlationId,
  });
  return updated;
}

export async function updateProjectMilestoneStatus(
  client: SupabaseClient,
  input: {
    milestoneId: string;
    status: "submitted" | "accepted" | "disputed";
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: milestone, error } = await client
    .from("enterprise_milestones")
    .select("*")
    .eq("id", input.milestoneId)
    .single();
  if (error || !milestone) {
    throw new AppError("NOT_FOUND", "Milestone not found", { status: 404 });
  }

  const allowed: Record<string, string[]> = {
    planned: ["submitted"],
    due: ["submitted"],
    submitted: ["accepted", "disputed"],
  };
  const from = String(milestone.status ?? "planned");
  if (!(allowed[from] ?? []).includes(input.status)) {
    throw new AppError(
      "CONFLICT",
      `Cannot transition milestone from ${from} to ${input.status}`,
      { status: 409 }
    );
  }

  const patch: Record<string, unknown> = { status: input.status };
  if (input.status === "submitted") {
    patch.submitted_at = new Date().toISOString();
  }
  if (input.status === "accepted") {
    patch.accepted_at = new Date().toISOString();
    patch.accepted_by = input.actorUserId;
  }

  const { data: updated, error: upErr } = await client
    .from("enterprise_milestones")
    .update(patch)
    .eq("id", input.milestoneId)
    .select("*")
    .single();
  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to update milestone", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_milestone.status",
    resourceType: "enterprise_milestone",
    resourceId: input.milestoneId,
    before: milestone,
    after: updated,
    correlationId: input.correlationId,
  });
  return updated;
}

export async function activateEnterpriseProject(
  client: SupabaseClient,
  input: {
    projectId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: project, error } = await client
    .from("enterprise_projects")
    .select("*")
    .eq("id", input.projectId)
    .single();
  if (error || !project) {
    throw new AppError("NOT_FOUND", "Project not found", { status: 404 });
  }
  if (project.status !== "setup") {
    throw new AppError("CONFLICT", "Project is not in setup status", {
      status: 409,
    });
  }
  if (!project.accepted_quote_id) {
    throw new AppError("CONFLICT", "Project requires an accepted quote", {
      status: 409,
    });
  }

  const { data: updated, error: upErr } = await client
    .from("enterprise_projects")
    .update({
      status: "active",
      metadata: {
        ...(typeof project.metadata === "object" && project.metadata
          ? (project.metadata as Record<string, unknown>)
          : {}),
        activatedAt: new Date().toISOString(),
        activatedBy: input.actorUserId,
      },
    })
    .eq("id", input.projectId)
    .select("*")
    .single();
  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate project", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_project.activate",
    resourceType: "enterprise_project",
    resourceId: input.projectId,
    before: project,
    after: updated,
    correlationId: input.correlationId,
  });
  return updated;
}

/**
 * Enterprise BDP requests handoff into canonical Enterprise Core.
 * Creates requirement v1 when absent and moves opportunity to qualifying.
 */
export async function requestEnterpriseCoreHandoff(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    rawRequirement: string;
    actorUserId: string;
    packId: string;
    correlationId?: string;
  }
) {
  const opportunity = await loadOpportunity(client, input.opportunityId);
  if (String(opportunity.attributed_bdp_user_id ?? "") !== input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Only the attributed Enterprise BDP may request handoff",
      { status: 403 }
    );
  }
  if (String(opportunity.pack_id ?? "") !== input.packId) {
    throw new AppError(
      "FORBIDDEN",
      "Opportunity is not attributed to this Enterprise BDP pack",
      { status: 403 }
    );
  }
  if (!input.rawRequirement.trim()) {
    throw new AppError("VALIDATION_ERROR", "Requirement summary is required", {
      status: 400,
    });
  }

  const { data: existingReq } = await client
    .from("enterprise_requirements")
    .select("*")
    .eq("opportunity_id", input.opportunityId)
    .maybeSingle();

  let requirement = existingReq;
  if (!requirement) {
    const { data: created, error: reqErr } = await client
      .from("enterprise_requirements")
      .insert({
        opportunity_id: input.opportunityId,
        current_version: 1,
        readiness_status: "submitted",
        structured_by: null,
        metadata: {
          handoffRequestedAt: new Date().toISOString(),
          handoffRequestedBy: input.actorUserId,
          source: "enterprise_bdp",
        },
      })
      .select("*")
      .single();
    if (reqErr || !created) {
      throw new AppError("INTERNAL_ERROR", "Failed to create requirement", {
        cause: reqErr,
      });
    }
    requirement = created;

    const { error: vErr } = await client
      .from("enterprise_requirement_versions")
      .insert({
        requirement_id: requirement.id,
        version_no: 1,
        raw_requirement: input.rawRequirement.trim(),
        change_reason: "Enterprise BDP handoff into Enterprise Core",
        created_by: input.actorUserId,
        approval_status: "submitted",
      });
    if (vErr) {
      throw new AppError("INTERNAL_ERROR", "Failed to create requirement version", {
        cause: vErr,
      });
    }
  }

  const { data: updated, error: oppErr } = await client
    .from("enterprise_opportunities")
    .update({
      status: "qualifying",
      source: opportunity.source ?? "bdp_sourced",
    })
    .eq("id", input.opportunityId)
    .select("*")
    .single();
  if (oppErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to update opportunity for handoff", {
      cause: oppErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_opportunity.request_handoff",
    resourceType: "enterprise_opportunity",
    resourceId: input.opportunityId,
    before: opportunity,
    after: updated,
    correlationId: input.correlationId,
  });

  return { opportunity: updated, requirement };
}
