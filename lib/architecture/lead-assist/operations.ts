import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { assertFeatureEnabled, isFeatureEnabled } from "../feature-flags/flags";
import {
  DeterministicLeadAssistProvider,
  type LeadAssistAiProvider,
  validateAiStructuredOutput,
  assertNoToolActionPayload,
} from "./ai-provider";
import {
  DEFAULT_LEAD_TTL_HOURS,
  DUPLICATE_WINDOW_MINUTES,
  LEAD_ASSIST_RULE_VERSION,
  LOW_CONFIDENCE_BPS,
  PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF,
  RATE_LIMIT_LEADS_PER_HOUR,
  WORK_STATUS_TRANSITIONS,
} from "./constants";
import type { CreateLeadInput } from "./schemas";

const defaultProvider = new DeterministicLeadAssistProvider();

async function emitEvent(
  client: SupabaseClient,
  eventType: string,
  leadId: string | null,
  actorUserId: string | null,
  payload: Record<string, unknown> = {}
) {
  await client.from("assist_domain_events").insert({
    event_type: eventType,
    lead_id: leadId,
    actor_user_id: actorUserId,
    payload: {
      ...payload,
      analytics: true,
      ruleVersion: LEAD_ASSIST_RULE_VERSION,
    },
  });
}

function assertWorkTransition(from: string, to: string) {
  const allowed = WORK_STATUS_TRANSITIONS[from] ?? [];
  if (!allowed.includes(to)) {
    throw new AppError(
      "INVALID_TRANSITION",
      `Invalid lead work transition ${from} → ${to}`,
      { status: 409 }
    );
  }
}

async function assertStage1Unpaid(client: SupabaseClient) {
  await assertFeatureEnabled(client, "lead_assist_stage1");
  for (const key of PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF) {
    const on = await isFeatureEnabled(client, key);
    if (on) {
      throw new AppError(
        "FEATURE_DISABLED",
        `Paid Lead Assist flag must remain OFF: ${key}`,
        { status: 403, details: { key } }
      );
    }
  }
}

async function enforceRateLimit(client: SupabaseClient, userId: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await client
    .from("assist_leads")
    .select("id", { count: "exact", head: true })
    .eq("giver_user_id", userId)
    .gte("created_at", since);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Rate limit check failed", {
      cause: error,
    });
  }
  if ((count ?? 0) >= RATE_LIMIT_LEADS_PER_HOUR) {
    throw new AppError("RATE_LIMITED", "Lead creation rate limit exceeded", {
      status: 429,
    });
  }
}

export async function createLead(
  client: SupabaseClient,
  input: CreateLeadInput & {
    giverUserId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  await assertStage1Unpaid(client);
  await enforceRateLimit(client, input.giverUserId);

  if (input.specialisationId) {
    const { data: spec } = await client
      .from("business_specialisations")
      .select("id")
      .eq("id", input.specialisationId)
      .maybeSingle();
    if (!spec) {
      throw new AppError("VALIDATION_ERROR", "Invalid specialisation", {
        status: 400,
      });
    }
  }

  if (input.giverMembershipId) {
    const { data: m } = await client
      .from("connect_memberships")
      .select("id,user_id,status")
      .eq("id", input.giverMembershipId)
      .maybeSingle();
    if (!m || m.user_id !== input.giverUserId) {
      throw new AppError("FORBIDDEN", "Membership does not belong to giver", {
        status: 403,
      });
    }
    if (
      ["suspended", "terminated", "expired", "cancelled"].includes(
        String(m.status)
      )
    ) {
      throw new AppError(
        "FORBIDDEN",
        "Inactive membership cannot create formal leads",
        { status: 403 }
      );
    }
  }

  const leadRef = `AL-${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
  const expiresAt = new Date(
    Date.now() + DEFAULT_LEAD_TTL_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data: lead, error } = await client
    .from("assist_leads")
    .insert({
      lead_ref: leadRef,
      giver_user_id: input.giverUserId,
      giver_membership_id: input.giverMembershipId ?? null,
      origin_circle_id: input.originCircleId ?? null,
      source: "in_app",
      title: input.title,
      work_status: "draft",
      quality_status: "unverified",
      privacy_level: input.privacyLevel,
      specialisation_id: input.specialisationId ?? null,
      city: input.city ?? null,
      district: input.district ?? null,
      state: input.state ?? null,
      urgency: input.urgency,
      budget_indication_minor: input.budgetIndicationMinor ?? null,
      contact_reveal_state: "masked",
      expires_at: expiresAt,
      metadata: {
        idempotencyKey: input.idempotencyKey ?? null,
        ruleVersion: LEAD_ASSIST_RULE_VERSION,
      },
    })
    .select("*")
    .single();

  if (error || !lead) {
    throw new AppError("INTERNAL_ERROR", "Failed to create lead", {
      cause: error,
    });
  }

  await client.from("assist_lead_requirement_versions").insert({
    lead_id: lead.id,
    version_no: 1,
    requirement_summary: input.requirementSummary,
    requirement_details: input.requirementDetails ?? null,
    specialisation_id: input.specialisationId ?? null,
    tag_codes: input.tagCodes,
    city: input.city ?? null,
    district: input.district ?? null,
    state: input.state ?? null,
    timeline_notes: input.timelineNotes ?? null,
    urgency: input.urgency,
    budget_indication_minor: input.budgetIndicationMinor ?? null,
    confidentiality_preference: input.confidentialityPreference ?? null,
    actor_user_id: input.actorUserId,
    change_reason: "create",
  });

  await emitEvent(client, "lead_created", lead.id, input.actorUserId, {
    leadRef,
  });
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "lead_assist.create",
    resourceType: "assist_lead",
    resourceId: String(lead.id),
    after: { id: lead.id, work_status: lead.work_status },
    correlationId: input.correlationId,
  });

  return lead;
}

export async function updateLeadDraft(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    title?: string;
    requirementSummary?: string;
    requirementDetails?: string | null;
    specialisationId?: string | null;
    tagCodes?: string[];
    city?: string | null;
    district?: string | null;
    state?: string | null;
    urgency?: string;
    privacyLevel?: string;
    correlationId?: string;
  }
) {
  await assertStage1Unpaid(client);
  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });
  if (lead.giver_user_id !== input.actorUserId) {
    throw new AppError("FORBIDDEN", "Only giver may edit draft", { status: 403 });
  }
  if (lead.work_status !== "draft") {
    throw new AppError("INVALID_TRANSITION", "Only drafts can be updated", {
      status: 409,
    });
  }

  const patch: Record<string, unknown> = {};
  if (input.title) patch.title = input.title;
  if (input.specialisationId !== undefined)
    patch.specialisation_id = input.specialisationId;
  if (input.city !== undefined) patch.city = input.city;
  if (input.district !== undefined) patch.district = input.district;
  if (input.state !== undefined) patch.state = input.state;
  if (input.urgency) patch.urgency = input.urgency;
  if (input.privacyLevel) patch.privacy_level = input.privacyLevel;

  const { data: updated, error } = await client
    .from("assist_leads")
    .update(patch)
    .eq("id", input.leadId)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to update draft", {
      cause: error,
    });
  }

  if (
    input.requirementSummary ||
    input.requirementDetails !== undefined ||
    input.tagCodes
  ) {
    const { data: latest } = await client
      .from("assist_lead_requirement_versions")
      .select("version_no")
      .eq("lead_id", input.leadId)
      .order("version_no", { ascending: false })
      .limit(1)
      .maybeSingle();
    const next = (latest?.version_no ?? 0) + 1;
    await client.from("assist_lead_requirement_versions").insert({
      lead_id: input.leadId,
      version_no: next,
      requirement_summary:
        input.requirementSummary ?? updated.title,
      requirement_details: input.requirementDetails ?? null,
      specialisation_id: updated.specialisation_id,
      tag_codes: input.tagCodes ?? [],
      city: updated.city,
      district: updated.district,
      state: updated.state,
      urgency: updated.urgency,
      actor_user_id: input.actorUserId,
      change_reason: "draft_update",
    });
  }

  return updated;
}

export async function submitLead(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    correlationId?: string;
    provider?: LeadAssistAiProvider;
  }
) {
  await assertStage1Unpaid(client);
  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });
  if (lead.giver_user_id !== input.actorUserId) {
    throw new AppError("FORBIDDEN", "Only giver may submit", { status: 403 });
  }
  assertWorkTransition(lead.work_status, "submitted");

  const { data: submitted, error } = await client
    .from("assist_leads")
    .update({
      work_status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", input.leadId)
    .eq("work_status", "draft")
    .select("*")
    .single();
  if (error || !submitted) {
    throw new AppError("CONFLICT", "Lead submit race or invalid state", {
      status: 409,
      cause: error,
    });
  }

  await emitEvent(client, "lead_submitted", input.leadId, input.actorUserId, {});
  await detectLeadDuplicates(client, {
    leadId: input.leadId,
    actorUserId: input.actorUserId,
  });

  // classify + route automatically
  await client
    .from("assist_leads")
    .update({ work_status: "classifying" })
    .eq("id", input.leadId);
  const classified = await classifyLead(client, {
    leadId: input.leadId,
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
    provider: input.provider,
  });
  return classified;
}

export async function classifyLead(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    correlationId?: string;
    provider?: LeadAssistAiProvider;
  }
) {
  await assertStage1Unpaid(client);
  const provider = input.provider ?? defaultProvider;
  const aiEnabled = await isFeatureEnabled(client, "ai_lead_classification");

  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });

  const { data: req } = await client
    .from("assist_lead_requirement_versions")
    .select("*")
    .eq("lead_id", input.leadId)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: specs } = await client
    .from("business_specialisations")
    .select("id,code,label")
    .limit(500);

  let specialisationCodeHint: string | null = null;
  if (lead.specialisation_id) {
    const hit = (specs ?? []).find((s) => s.id === lead.specialisation_id);
    specialisationCodeHint = hit?.code ?? null;
  }

  let result;
  try {
    if (!aiEnabled) {
      throw new Error("AI classification flag off — using fallback");
    }
    result = await provider.classify({
      purpose: "classification",
      requirementText: `${lead.title}\n${req?.requirement_summary ?? ""}\n${req?.requirement_details ?? ""}`,
      specialisationCodeHint,
      tagCodeHints: req?.tag_codes ?? [],
      cityHint: lead.city,
      stateHint: lead.state,
      canonicalSpecialisations: (specs ?? []).map((s) => ({
        id: s.id,
        code: s.code,
        label: s.label,
      })),
    });
    assertNoToolActionPayload(result.output);
    validateAiStructuredOutput(result.output);
  } catch {
    result = await defaultProvider.classify({
      purpose: "classification",
      requirementText: `${lead.title}\n${req?.requirement_summary ?? ""}`,
      specialisationCodeHint,
      tagCodeHints: req?.tag_codes ?? [],
      cityHint: lead.city,
      stateHint: lead.state,
      canonicalSpecialisations: (specs ?? []).map((s) => ({
        id: s.id,
        code: s.code,
        label: s.label,
      })),
    });
    result = { ...result, status: "fallback" as const };
  }

  // Map suggestion to canonical IDs only
  let finalSpecId =
    result.output.suggestedSpecialisationId ?? lead.specialisation_id ?? null;
  if (result.output.suggestedSpecialisationCode && !finalSpecId) {
    const hit = (specs ?? []).find(
      (s) =>
        s.code.toLowerCase() ===
        result.output.suggestedSpecialisationCode!.toLowerCase()
    );
    finalSpecId = hit?.id ?? null;
  }
  if (
    finalSpecId &&
    !(specs ?? []).some((s) => s.id === finalSpecId)
  ) {
    finalSpecId = lead.specialisation_id ?? null;
  }

  const { data: run } = await client
    .from("assist_lead_ai_runs")
    .insert({
      lead_id: input.leadId,
      provider: result.provider,
      model_id: result.modelId,
      purpose: "classification",
      prompt_template_version: result.promptTemplateVersion,
      confidence_bps: result.confidenceBps,
      review_required: result.reviewRequired,
      status: result.status,
      structured_output: result.output,
      error_message: result.errorMessage ?? null,
      cost_metadata: result.costMetadata ?? {},
    })
    .select("*")
    .single();

  await client
    .from("assist_lead_ai_classifications")
    .update({ is_canonical: false })
    .eq("lead_id", input.leadId)
    .eq("is_canonical", true);

  const { data: classification } = await client
    .from("assist_lead_ai_classifications")
    .insert({
      lead_id: input.leadId,
      ai_run_id: run?.id ?? null,
      suggested_specialisation_id: finalSpecId,
      suggested_tag_codes: result.output.suggestedTagCodes,
      extracted_city: result.output.extractedCity ?? null,
      extracted_state: result.output.extractedState ?? null,
      urgency: result.output.urgency,
      confidence_bps: result.confidenceBps,
      ranking_reasons: result.output.rankingReasons,
      review_required: result.reviewRequired,
      review_reason: result.output.reviewReason ?? null,
      final_specialisation_id: finalSpecId,
      is_canonical: true,
    })
    .select("*")
    .single();

  if (finalSpecId && !lead.specialisation_id) {
    await client
      .from("assist_leads")
      .update({ specialisation_id: finalSpecId })
      .eq("id", input.leadId);
  }

  await emitEvent(client, "ai_classified", input.leadId, input.actorUserId, {
    confidenceBps: result.confidenceBps,
    reviewRequired: result.reviewRequired,
    provider: result.provider,
  });

  if (
    result.reviewRequired ||
    result.confidenceBps < LOW_CONFIDENCE_BPS ||
    lead.privacy_level === "manual_review"
  ) {
    await client
      .from("assist_leads")
      .update({ work_status: "review_required", quality_status: "unverified" })
      .eq("id", input.leadId);
    await enqueueOpportunityDesk(client, {
      leadId: input.leadId,
      reason: result.reviewRequired
        ? "low_ai_confidence"
        : "privacy_review",
      actorUserId: input.actorUserId,
    });
    return { leadId: input.leadId, classification, desk: true };
  }

  await client
    .from("assist_leads")
    .update({
      work_status: "classified",
      quality_status: "preliminarily_verified",
    })
    .eq("id", input.leadId);

  return routeLead(client, {
    leadId: input.leadId,
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });
}

type CandidateRow = {
  candidate_user_id: string;
  candidate_membership_id: string | null;
  candidate_circle_id: string | null;
  routing_tier: "circle_first" | "cross_circle" | "wider_network";
  score_bps: number;
  match_features: Record<string, unknown>;
  ranking_reasons: string[];
  eligible: boolean;
  ineligibility_reason: string | null;
};

async function buildEligibleCandidates(
  client: SupabaseClient,
  lead: {
    id: string;
    giver_user_id: string;
    origin_circle_id: string | null;
    specialisation_id: string | null;
    city: string | null;
    state: string | null;
  },
  tagCodes: string[]
): Promise<CandidateRow[]> {
  const { data: memberships } = await client
    .from("connect_memberships")
    .select(
      "id,user_id,status,allocation_status,specialisation_id,preferred_city,preferred_state"
    )
    .eq("status", "active")
    .neq("user_id", lead.giver_user_id)
    .limit(500);

  const rows: CandidateRow[] = [];
  for (const m of memberships ?? []) {
    // Hard eligibility
    if (["suspended", "terminated", "expired"].includes(String(m.status))) {
      continue;
    }

    let eligible = true;
    let ineligibility: string | null = null;
    const reasons: string[] = [];
    let score = 0;
    const features: Record<string, unknown> = {};

    if (
      lead.specialisation_id &&
      m.specialisation_id === lead.specialisation_id
    ) {
      score += 4000;
      reasons.push("specialisation_match");
      features.specialisation = true;
    } else if (lead.specialisation_id) {
      // Wrong specialisation is a hard filter when target set
      eligible = false;
      ineligibility = "wrong_specialisation";
    }

    if (tagCodes.length > 0) {
      const { data: tags } = await client
        .from("membership_tags")
        .select("tag_key,status")
        .eq("membership_id", m.id)
        .eq("status", "active");
      const keys = new Set((tags ?? []).map((t) => t.tag_key.toLowerCase()));
      const tagHits = tagCodes.filter((t) => keys.has(t.toLowerCase()));
      if (tagHits.length > 0) {
        score += Math.min(3000, tagHits.length * 1000);
        reasons.push("tag_match");
        features.tagHits = tagHits;
      }
    }

    const { data: seat } = await client
      .from("connect_circle_seats")
      .select("id,circle_id,status")
      .eq("membership_id", m.id)
      .in("status", ["allocated", "protected_grace"])
      .maybeSingle();

    let tier: CandidateRow["routing_tier"] = "wider_network";
    if (seat?.circle_id && lead.origin_circle_id) {
      if (seat.circle_id === lead.origin_circle_id) {
        tier = "circle_first";
        score += 2500;
        reasons.push("circle_first");
        features.circleMatch = true;
      } else {
        tier = "cross_circle";
        score += 1000;
        reasons.push("cross_circle");
        features.crossCircle = true;
      }
    } else if (seat?.circle_id) {
      tier = "cross_circle";
      score += 800;
      reasons.push("has_active_seat");
    }

    if (lead.city && m.preferred_city) {
      if (
        String(m.preferred_city).toLowerCase() ===
        String(lead.city).toLowerCase()
      ) {
        score += 800;
        reasons.push("city_match");
      }
    }
    if (lead.state && m.preferred_state) {
      if (
        String(m.preferred_state).toLowerCase() ===
        String(lead.state).toLowerCase()
      ) {
        score += 400;
        reasons.push("state_match");
      }
    }

    // Circle-specific routing requires active seat when origin circle set
    if (lead.origin_circle_id && tier === "circle_first" && !seat) {
      eligible = false;
      ineligibility = "no_active_seat";
    }

    rows.push({
      candidate_user_id: m.user_id,
      candidate_membership_id: m.id,
      candidate_circle_id: seat?.circle_id ?? null,
      routing_tier: tier,
      score_bps: Math.min(10000, score),
      match_features: features,
      ranking_reasons: reasons,
      eligible,
      ineligibility_reason: ineligibility,
    });
  }

  // Circle-first sort: eligible circle_first, then cross_circle, then wider
  const tierRank = { circle_first: 0, cross_circle: 1, wider_network: 2 };
  return rows.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    const tr = tierRank[a.routing_tier] - tierRank[b.routing_tier];
    if (tr !== 0) return tr;
    return b.score_bps - a.score_bps;
  });
}

export async function generateLeadCandidates(
  client: SupabaseClient,
  input: { leadId: string; actorUserId: string }
) {
  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });

  const { data: req } = await client
    .from("assist_lead_requirement_versions")
    .select("tag_codes")
    .eq("lead_id", input.leadId)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();

  const ranked = await buildEligibleCandidates(
    client,
    lead,
    req?.tag_codes ?? []
  );

  // Replace candidates atomically-ish
  await client
    .from("assist_lead_routing_candidates")
    .delete()
    .eq("lead_id", input.leadId);

  if (ranked.length > 0) {
    const { error } = await client.from("assist_lead_routing_candidates").insert(
      ranked.slice(0, 50).map((c) => ({
        lead_id: input.leadId,
        ...c,
      }))
    );
    if (error) {
      throw new AppError("INTERNAL_ERROR", "Failed to store candidates", {
        cause: error,
      });
    }
  }

  await emitEvent(client, "candidate_generated", input.leadId, input.actorUserId, {
    count: ranked.filter((r) => r.eligible).length,
  });

  return ranked;
}

export async function routeLead(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    correlationId?: string;
    autoAssignTop?: boolean;
  }
) {
  await assertStage1Unpaid(client);
  await client
    .from("assist_leads")
    .update({ work_status: "routing" })
    .eq("id", input.leadId);

  const candidates = await generateLeadCandidates(client, input);
  const eligible = candidates.filter((c) => c.eligible);

  if (eligible.length === 0) {
    await client
      .from("assist_leads")
      .update({ work_status: "review_required" })
      .eq("id", input.leadId);
    await enqueueOpportunityDesk(client, {
      leadId: input.leadId,
      reason: "no_eligible_candidate",
      actorUserId: input.actorUserId,
    });
    return { leadId: input.leadId, assigned: null, desk: true };
  }

  // Ambiguous: multiple equally strong top scores → desk
  const top = eligible[0];
  const ties = eligible.filter(
    (c) =>
      c.routing_tier === top.routing_tier &&
      Math.abs(c.score_bps - top.score_bps) < 50
  );
  if (ties.length > 3 || input.autoAssignTop === false) {
    await client
      .from("assist_leads")
      .update({ work_status: "routed" })
      .eq("id", input.leadId);
    await enqueueOpportunityDesk(client, {
      leadId: input.leadId,
      reason: "multiple_equally_strong_candidates",
      actorUserId: input.actorUserId,
    });
    await emitEvent(client, "lead_routed", input.leadId, input.actorUserId, {
      desk: true,
    });
    return { leadId: input.leadId, assigned: null, desk: true, candidates: ties };
  }

  await client
    .from("assist_leads")
    .update({ work_status: "routed" })
    .eq("id", input.leadId);

  // Prefer Circle-first top; do not auto-assign if privacy restricted
  const { data: lead } = await client
    .from("assist_leads")
    .select("privacy_level")
    .eq("id", input.leadId)
    .single();

  if (
    lead?.privacy_level === "restricted" ||
    lead?.privacy_level === "manual_review"
  ) {
    await enqueueOpportunityDesk(client, {
      leadId: input.leadId,
      reason: "privacy_review",
      actorUserId: input.actorUserId,
    });
    return { leadId: input.leadId, assigned: null, desk: true };
  }

  const assignment = await assignLead(client, {
    leadId: input.leadId,
    receiverUserId: top.candidate_user_id,
    receiverMembershipId: top.candidate_membership_id,
    receiverCircleId: top.candidate_circle_id,
    assignmentSource: "system",
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  return { leadId: input.leadId, assigned: assignment, desk: false };
}

export async function assignLead(
  client: SupabaseClient,
  input: {
    leadId: string;
    receiverUserId: string;
    receiverMembershipId?: string | null;
    receiverCircleId?: string | null;
    assignmentSource: "system" | "desk" | "manual";
    actorUserId: string;
    correlationId?: string;
  }
) {
  await assertStage1Unpaid(client);

  // Verify receiver still eligible
  if (input.receiverMembershipId) {
    const { data: m } = await client
      .from("connect_memberships")
      .select("status,user_id")
      .eq("id", input.receiverMembershipId)
      .maybeSingle();
    if (!m || m.user_id !== input.receiverUserId || m.status !== "active") {
      throw new AppError(
        "VALIDATION_ERROR",
        "Receiver membership not eligible",
        { status: 400 }
      );
    }
  }

  // Close previous active assignment if any (reassignment path)
  const { data: prev } = await client
    .from("assist_lead_assignments")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("is_active", true)
    .maybeSingle();

  if (prev) {
    await client
      .from("assist_lead_assignments")
      .update({
        is_active: false,
        status: "reassigned_closed",
      })
      .eq("id", prev.id);
    await client.from("assist_lead_assignment_events").insert({
      assignment_id: prev.id,
      lead_id: input.leadId,
      from_status: prev.status,
      to_status: "reassigned_closed",
      actor_user_id: input.actorUserId,
      reason: "superseded_by_new_assignment",
    });
  }

  const { data: assignment, error } = await client
    .from("assist_lead_assignments")
    .insert({
      lead_id: input.leadId,
      receiver_user_id: input.receiverUserId,
      receiver_membership_id: input.receiverMembershipId ?? null,
      receiver_circle_id: input.receiverCircleId ?? null,
      status: "assigned",
      assignment_source: input.assignmentSource,
      assigned_by: input.actorUserId,
      is_active: true,
    })
    .select("*")
    .single();

  if (error || !assignment) {
    throw new AppError("CONFLICT", "Failed to create unique active assignment", {
      status: 409,
      cause: error,
    });
  }

  await client.from("assist_lead_assignment_events").insert({
    assignment_id: assignment.id,
    lead_id: input.leadId,
    from_status: null,
    to_status: "assigned",
    actor_user_id: input.actorUserId,
    reason: input.assignmentSource,
  });

  if (prev) {
    await client.from("assist_lead_reassignments").insert({
      lead_id: input.leadId,
      from_assignment_id: prev.id,
      to_assignment_id: assignment.id,
      reason: "reassignment",
      actor_user_id: input.actorUserId,
      contact_access_revoked: true,
    });
    await client
      .from("assist_leads")
      .update({
        work_status: "reassigned",
        contact_reveal_state: "masked",
      })
      .eq("id", input.leadId);
  }

  await client
    .from("assist_leads")
    .update({ work_status: "offered" })
    .eq("id", input.leadId);

  await emitEvent(client, "lead_assigned", input.leadId, input.actorUserId, {
    assignmentId: assignment.id,
    receiverUserId: input.receiverUserId,
  });
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "lead_assist.assign",
    resourceType: "assist_lead_assignment",
    resourceId: String(assignment.id),
    after: assignment,
    correlationId: input.correlationId,
  });

  return assignment;
}

export async function acceptLead(
  client: SupabaseClient,
  input: { leadId: string; actorUserId: string; correlationId?: string }
) {
  const { data: assignment } = await client
    .from("assist_lead_assignments")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("is_active", true)
    .maybeSingle();
  if (!assignment || assignment.receiver_user_id !== input.actorUserId) {
    throw new AppError("FORBIDDEN", "Not the assigned receiver", {
      status: 403,
    });
  }
  if (assignment.status !== "assigned") {
    throw new AppError("INVALID_TRANSITION", "Assignment not awaiting accept", {
      status: 409,
    });
  }

  const { data: updated, error } = await client
    .from("assist_lead_assignments")
    .update({
      status: "accepted",
      responded_at: new Date().toISOString(),
    })
    .eq("id", assignment.id)
    .eq("status", "assigned")
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("CONFLICT", "Accept race", { status: 409, cause: error });
  }

  await client.from("assist_lead_assignment_events").insert({
    assignment_id: assignment.id,
    lead_id: input.leadId,
    from_status: "assigned",
    to_status: "accepted",
    actor_user_id: input.actorUserId,
  });
  await client
    .from("assist_leads")
    .update({ work_status: "accepted" })
    .eq("id", input.leadId);
  await emitEvent(client, "lead_accepted", input.leadId, input.actorUserId, {});
  return updated;
}

export async function declineLead(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: assignment } = await client
    .from("assist_lead_assignments")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("is_active", true)
    .maybeSingle();
  if (!assignment || assignment.receiver_user_id !== input.actorUserId) {
    throw new AppError("FORBIDDEN", "Not the assigned receiver", {
      status: 403,
    });
  }

  const { data: updated, error } = await client
    .from("assist_lead_assignments")
    .update({
      status: "declined",
      responded_at: new Date().toISOString(),
      decline_reason: input.reason ?? null,
      is_active: false,
    })
    .eq("id", assignment.id)
    .eq("is_active", true)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("CONFLICT", "Decline race", { status: 409, cause: error });
  }

  await client.from("assist_lead_assignment_events").insert({
    assignment_id: assignment.id,
    lead_id: input.leadId,
    from_status: assignment.status,
    to_status: "declined",
    actor_user_id: input.actorUserId,
    reason: input.reason ?? null,
  });
  await client
    .from("assist_leads")
    .update({ work_status: "declined" })
    .eq("id", input.leadId);
  await enqueueOpportunityDesk(client, {
    leadId: input.leadId,
    reason: "reassignment_required",
    actorUserId: input.actorUserId,
  });
  await emitEvent(client, "lead_declined", input.leadId, input.actorUserId, {
    reason: input.reason ?? null,
  });
  return updated;
}

export async function revealLeadContact(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  await assertFeatureEnabled(client, "contact_reveal");
  if (await isFeatureEnabled(client, "paid_contact_reveal")) {
    throw new AppError(
      "FEATURE_DISABLED",
      "Paid contact reveal is inactive (Stage 1)",
      { status: 403 }
    );
  }

  const { data: assignment } = await client
    .from("assist_lead_assignments")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("is_active", true)
    .maybeSingle();

  if (
    !assignment ||
    assignment.receiver_user_id !== input.actorUserId ||
    !["accepted", "assigned"].includes(assignment.status)
  ) {
    throw new AppError(
      "FORBIDDEN",
      "Contact reveal requires active authorised assignment",
      { status: 403 }
    );
  }

  if (assignment.status === "assigned") {
    // Must accept first for contact reveal in Stage 1
    throw new AppError(
      "FORBIDDEN",
      "Accept the lead before revealing contact",
      { status: 403 }
    );
  }

  const { data: lead } = await client
    .from("assist_leads")
    .select("giver_user_id,contact_reveal_state")
    .eq("id", input.leadId)
    .single();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });

  const { data: giver } = await client
    .from("users")
    .select("id,email,phone,name")
    .eq("id", lead.giver_user_id)
    .maybeSingle();

  const fields = ["name", "email"].filter(
    (f) => giver && (giver as Record<string, unknown>)[f]
  );

  await client.from("assist_contact_reveal_events").insert({
    lead_id: input.leadId,
    assignment_id: assignment.id,
    viewer_user_id: input.actorUserId,
    fields_revealed: fields,
    reason: input.reason ?? "receiver_accepted",
  });

  await client
    .from("assist_leads")
    .update({
      contact_reveal_state: "revealed",
      work_status: "contact_revealed",
    })
    .eq("id", input.leadId);

  await emitEvent(client, "contact_revealed", input.leadId, input.actorUserId, {
    fields,
  });
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "lead_assist.contact_reveal",
    resourceType: "assist_lead",
    resourceId: input.leadId,
    after: { fields },
    correlationId: input.correlationId,
  });

  return {
    leadId: input.leadId,
    contact: {
      fullName: giver?.name ?? null,
      email: giver?.email ?? null,
      phone: null as string | null,
    },
    revealedAt: new Date().toISOString(),
  };
}

export async function reassignLead(
  client: SupabaseClient,
  input: {
    leadId: string;
    receiverUserId: string;
    receiverMembershipId?: string | null;
    receiverCircleId?: string | null;
    reason: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  return assignLead(client, {
    leadId: input.leadId,
    receiverUserId: input.receiverUserId,
    receiverMembershipId: input.receiverMembershipId,
    receiverCircleId: input.receiverCircleId,
    assignmentSource: "desk",
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });
}

export async function expireLead(
  client: SupabaseClient,
  input: { leadId: string; actorUserId: string; reason?: string }
) {
  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });

  await client
    .from("assist_leads")
    .update({
      work_status: "expired",
      metadata: {
        ...(typeof lead.metadata === "object" && lead.metadata
          ? lead.metadata
          : {}),
        expiryReason: input.reason ?? "ttl",
      },
    })
    .eq("id", input.leadId);

  await client
    .from("assist_lead_assignments")
    .update({ status: "expired", is_active: false })
    .eq("lead_id", input.leadId)
    .eq("is_active", true);

  await emitEvent(client, "lead_expired", input.leadId, input.actorUserId, {});
  return { leadId: input.leadId, workStatus: "expired" };
}

export async function submitLeadOutcome(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    amountMinor: number;
    notes?: string;
    correlationId?: string;
  }
) {
  await assertStage1Unpaid(client);
  if (input.amountMinor < 0) {
    throw new AppError("VALIDATION_ERROR", "Amount must be non-negative", {
      status: 400,
    });
  }

  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) throw new AppError("NOT_FOUND", "Lead not found", { status: 404 });

  const { data: assignment } = await client
    .from("assist_lead_assignments")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("is_active", true)
    .maybeSingle();

  const isGiver = lead.giver_user_id === input.actorUserId;
  const isReceiver = assignment?.receiver_user_id === input.actorUserId;
  if (!isGiver && !isReceiver) {
    throw new AppError("FORBIDDEN", "Not a party to this lead", {
      status: 403,
    });
  }

  let { data: outcome } = await client
    .from("assist_lead_outcomes")
    .select("*")
    .eq("lead_id", input.leadId)
    .in("status", ["pending", "disputed"])
    .maybeSingle();

  if (!outcome) {
    const { data: created, error } = await client
      .from("assist_lead_outcomes")
      .insert({
        lead_id: input.leadId,
        outcome_type: "closed_business",
        status: "pending",
        creates_finance_transaction: false,
      })
      .select("*")
      .single();
    if (error || !created) {
      throw new AppError("INTERNAL_ERROR", "Failed to create outcome", {
        cause: error,
      });
    }
    outcome = created;
  }

  const party = isGiver ? "giver" : "receiver";
  await client.from("assist_closed_business_confirmations").upsert(
    {
      outcome_id: outcome.id,
      lead_id: input.leadId,
      party,
      party_user_id: input.actorUserId,
      amount_minor: input.amountMinor,
      notes: input.notes ?? null,
    },
    { onConflict: "outcome_id,party" }
  );

  const patch =
    party === "giver"
      ? {
          giver_status: "submitted",
          giver_amount_minor: input.amountMinor,
          giver_submitted_at: new Date().toISOString(),
          declared_amount_minor: input.amountMinor,
        }
      : {
          receiver_status: "submitted",
          receiver_amount_minor: input.amountMinor,
          receiver_submitted_at: new Date().toISOString(),
        };

  await client
    .from("assist_lead_outcomes")
    .update({ ...patch, creates_finance_transaction: false })
    .eq("id", outcome.id);

  await client
    .from("assist_leads")
    .update({ work_status: "outcome_pending" })
    .eq("id", input.leadId);

  await emitEvent(
    client,
    "outcome_confirmation_requested",
    input.leadId,
    input.actorUserId,
    { party, amountMinor: input.amountMinor }
  );

  const { data: reconciled } = await client.rpc("gce_assist_reconcile_outcome", {
    p_outcome_id: outcome.id,
  });

  // Hard finance boundary: never post revenue from outcome
  const financeCount = await client
    .from("revenue_components")
    .select("id", { count: "exact", head: true })
    .eq("domain_object_type", "assist_lead")
    .eq("domain_object_id", input.leadId);

  if ((financeCount.count ?? 0) > 0) {
    throw new AppError(
      "INTERNAL_ERROR",
      "Lead Assist must not create revenue components",
      { status: 500 }
    );
  }

  if (reconciled?.status === "disputed") {
    await emitEvent(client, "outcome_mismatch", input.leadId, input.actorUserId, {});
    await enqueueOpportunityDesk(client, {
      leadId: input.leadId,
      reason: "manual_escalation",
      actorUserId: input.actorUserId,
    });
  }

  if (reconciled?.status === "confirmed") {
    await emitEvent(client, "lead_converted", input.leadId, input.actorUserId, {
      confirmedAmountMinor: reconciled.confirmed_amount_minor,
      financePosted: false,
    });
  }

  return reconciled ?? outcome;
}

export async function confirmLeadOutcome(
  client: SupabaseClient,
  input: {
    leadId: string;
    actorUserId: string;
    amountMinor: number;
    notes?: string;
    correlationId?: string;
  }
) {
  return submitLeadOutcome(client, input);
}

export async function enqueueOpportunityDesk(
  client: SupabaseClient,
  input: {
    leadId: string;
    reason: string;
    actorUserId: string;
    priority?: string;
  }
) {
  const deskOn = await isFeatureEnabled(client, "opportunity_desk");
  if (!deskOn) return null;

  const { data: existing } = await client
    .from("assist_opportunity_desk_queue")
    .select("*")
    .eq("lead_id", input.leadId)
    .eq("reason", input.reason)
    .in("status", ["open", "in_progress"])
    .maybeSingle();
  if (existing) return existing;

  const { data, error } = await client
    .from("assist_opportunity_desk_queue")
    .insert({
      lead_id: input.leadId,
      reason: input.reason,
      priority: input.priority ?? "normal",
      status: "open",
    })
    .select("*")
    .single();
  if (error) {
    // unique race — treat as idempotent
    const { data: again } = await client
      .from("assist_opportunity_desk_queue")
      .select("*")
      .eq("lead_id", input.leadId)
      .eq("reason", input.reason)
      .in("status", ["open", "in_progress"])
      .maybeSingle();
    if (again) return again;
    throw new AppError("INTERNAL_ERROR", "Failed to enqueue desk item", {
      cause: error,
    });
  }

  await emitEvent(
    client,
    "opportunity_desk_review_required",
    input.leadId,
    input.actorUserId,
    { reason: input.reason }
  );
  return data;
}

export async function reviewOpportunityDeskItem(
  client: SupabaseClient,
  input: {
    queueId: string;
    actorUserId: string;
    notes?: string;
    finalSpecialisationId?: string | null;
    assignReceiverUserId?: string | null;
    assignMembershipId?: string | null;
    assignCircleId?: string | null;
    resolve?: boolean;
    correlationId?: string;
  }
) {
  const { data: item } = await client
    .from("assist_opportunity_desk_queue")
    .select("*")
    .eq("id", input.queueId)
    .maybeSingle();
  if (!item) throw new AppError("NOT_FOUND", "Queue item not found", { status: 404 });

  if (input.finalSpecialisationId) {
    await client
      .from("assist_leads")
      .update({ specialisation_id: input.finalSpecialisationId })
      .eq("id", item.lead_id);
    await client
      .from("assist_lead_ai_classifications")
      .update({
        final_specialisation_id: input.finalSpecialisationId,
        reviewed_by: input.actorUserId,
        override_reason: input.notes ?? "desk_override",
      })
      .eq("lead_id", item.lead_id)
      .eq("is_canonical", true);
    await emitEvent(client, "human_reviewed", item.lead_id, input.actorUserId, {
      finalSpecialisationId: input.finalSpecialisationId,
    });
  }

  let assignment = null;
  if (input.assignReceiverUserId) {
    assignment = await assignLead(client, {
      leadId: item.lead_id,
      receiverUserId: input.assignReceiverUserId,
      receiverMembershipId: input.assignMembershipId,
      receiverCircleId: input.assignCircleId,
      assignmentSource: "desk",
      actorUserId: input.actorUserId,
      correlationId: input.correlationId,
    });
  }

  if (input.resolve !== false) {
    await client
      .from("assist_opportunity_desk_queue")
      .update({
        status: "resolved",
        notes: input.notes ?? null,
        resolved_at: new Date().toISOString(),
        resolved_by: input.actorUserId,
        owner_user_id: input.actorUserId,
      })
      .eq("id", input.queueId);
  }

  return { item, assignment };
}

export async function detectLeadDuplicates(
  client: SupabaseClient,
  input: { leadId: string; actorUserId: string }
) {
  const { data: lead } = await client
    .from("assist_leads")
    .select("*")
    .eq("id", input.leadId)
    .maybeSingle();
  if (!lead) return [];

  const since = new Date(
    Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { data: candidates } = await client
    .from("assist_leads")
    .select("id,title,specialisation_id,city")
    .eq("giver_user_id", lead.giver_user_id)
    .neq("id", lead.id)
    .gte("created_at", since)
    .limit(20);

  const flags = [];
  for (const c of candidates ?? []) {
    const sameTitle =
      String(c.title).trim().toLowerCase() ===
      String(lead.title).trim().toLowerCase();
    const sameSpec =
      c.specialisation_id &&
      c.specialisation_id === lead.specialisation_id;
    const sameCity =
      c.city &&
      lead.city &&
      String(c.city).toLowerCase() === String(lead.city).toLowerCase();
    if (sameTitle || (sameSpec && sameCity)) {
      const { data: flag } = await client
        .from("assist_lead_duplicate_flags")
        .insert({
          lead_id: lead.id,
          related_lead_id: c.id,
          signal: sameTitle ? "same_title_window" : "same_spec_city_window",
          status: "suspected",
        })
        .select("*")
        .single();
      if (flag) flags.push(flag);
    }
  }

  if (flags.length > 0) {
    await enqueueOpportunityDesk(client, {
      leadId: input.leadId,
      reason: "duplicate_suspected",
      actorUserId: input.actorUserId,
    });
  }

  return flags;
}

export async function getMySentLeads(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("assist_leads")
    .select("*")
    .eq("giver_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to list sent leads", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function getMyReceivedLeads(client: SupabaseClient, userId: string) {
  const { data: assignments, error } = await client
    .from("assist_lead_assignments")
    .select("*, assist_leads(*)")
    .eq("receiver_user_id", userId)
    .order("assigned_at", { ascending: false })
    .limit(50);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to list received leads", {
      cause: error,
    });
  }
  return assignments ?? [];
}

export async function getOpportunityDeskQueue(client: SupabaseClient) {
  const { data, error } = await client
    .from("assist_opportunity_desk_queue")
    .select("*, assist_leads(id,lead_ref,title,work_status,privacy_level)")
    .in("status", ["open", "in_progress"])
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to load desk queue", {
      cause: error,
    });
  }
  return data ?? [];
}

/** Privacy-safe presentation for non-authorised viewers (candidates never get this via RLS). */
export function presentLeadPrivacySafe(lead: {
  id: string;
  title: string;
  work_status: string;
  city?: string | null;
  state?: string | null;
  urgency?: string;
  contact_reveal_state?: string;
}) {
  return {
    id: lead.id,
    title: lead.title,
    workStatus: lead.work_status,
    city: lead.city ?? null,
    state: lead.state ?? null,
    urgency: lead.urgency ?? "normal",
    contactAvailable: lead.contact_reveal_state === "revealed",
    // never include email/phone here
  };
}

export async function assertPaidMechanicsInactive(client: SupabaseClient) {
  const results: Record<string, boolean> = {};
  for (const key of PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF) {
    results[key] = await isFeatureEnabled(client, key);
  }
  const anyOn = Object.values(results).some(Boolean);
  if (anyOn) {
    throw new AppError(
      "CONFIGURATION_ERROR",
      "Paid Lead Assist mechanics unexpectedly enabled",
      { details: results }
    );
  }
  return results;
}
