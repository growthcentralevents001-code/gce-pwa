import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { createOrganisation } from "../organisations/create";
import {
  calculateEnterpriseEntitlement,
  ebdpPackageAmounts,
  financeCosignRequired,
  ENTERPRISE_PLATFORM_COMMISSION_BPS,
  EBDP_PACKAGE_RULE_VERSION,
  ENTERPRISE_RULE_VERSION,
  type EnterpriseBdpPackageOption,
} from "./constants";

export async function createEnterpriseBdpApplication(
  client: SupabaseClient,
  input: {
    userId: string;
    packageOption?: EnterpriseBdpPackageOption;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const option = input.packageOption ?? "finance_recovery_36000";
  const amounts = ebdpPackageAmounts(option);
  const { data, error } = await client
    .from("enterprise_bdp_packs")
    .insert({
      user_id: input.userId,
      application_status: "submitted",
      package_option: option,
      package_total_minor: amounts.packageTotalMinor,
      initial_payment_minor: amounts.initialPaymentMinor,
      recoverable_balance_minor: amounts.recoverableBalanceMinor,
      remaining_recoverable_minor: amounts.recoverableBalanceMinor,
      recovered_to_date_minor: 0,
      pricing_rule_version: EBDP_PACKAGE_RULE_VERSION,
      terms_accepted_at: null,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create Enterprise BDP pack", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_bdp.apply",
    resourceType: "enterprise_bdp_pack",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function acceptEbdpTerms(
  client: SupabaseClient,
  input: { packId: string; actorUserId: string; correlationId?: string }
) {
  const { data, error } = await client
    .from("enterprise_bdp_packs")
    .update({
      terms_accepted_at: new Date().toISOString(),
      application_status: "pending_payment",
    })
    .eq("id", input.packId)
    .eq("user_id", input.actorUserId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("FORBIDDEN", "Cannot accept terms for this pack", {
      status: 403,
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_bdp.accept_terms",
    resourceType: "enterprise_bdp_pack",
    resourceId: input.packId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function recordEbdpPackPayment(
  client: SupabaseClient,
  input: {
    packId: string;
    paymentIntentId?: string | null;
    offlinePaymentRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: existing, error: loadErr } = await client
    .from("enterprise_bdp_packs")
    .select("*")
    .eq("id", input.packId)
    .single();
  if (loadErr || !existing) {
    throw new AppError("NOT_FOUND", "Enterprise BDP pack not found", {
      status: 404,
    });
  }
  if (!existing.terms_accepted_at) {
    throw new AppError("CONFLICT", "Terms must be accepted before payment", {
      status: 409,
    });
  }
  if (
    existing.application_status !== "pending_payment" &&
    existing.application_status !== "submitted"
  ) {
    throw new AppError(
      "CONFLICT",
      "Pack is not awaiting payment evidence",
      { status: 409 }
    );
  }

  const { data, error } = await client
    .from("enterprise_bdp_packs")
    .update({
      payment_intent_id: input.paymentIntentId ?? existing.payment_intent_id,
      offline_payment_ref: input.offlinePaymentRef ?? existing.offline_payment_ref,
      application_status: "pending_approval",
    })
    .eq("id", input.packId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record pack payment", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_bdp.record_payment",
    resourceType: "enterprise_bdp_pack",
    resourceId: input.packId,
    before: existing,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function activateEnterpriseBdpPack(
  client: SupabaseClient,
  input: {
    packId: string;
    actorUserId: string;
    secondPackApproved?: boolean;
    roleAssignmentId?: string | null;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: pack, error } = await client
    .from("enterprise_bdp_packs")
    .select("*")
    .eq("id", input.packId)
    .single();
  if (error || !pack) {
    throw new AppError("NOT_FOUND", "Enterprise BDP pack not found", {
      status: 404,
    });
  }
  if (pack.user_id === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Enterprise BDP cannot self-activate", {
      status: 403,
    });
  }
  if (!pack.terms_accepted_at) {
    throw new AppError("CONFLICT", "Terms must be accepted before activation", {
      status: 409,
    });
  }
  if (pack.application_status === "active") {
    return pack;
  }
  if (pack.application_status !== "pending_approval") {
    throw new AppError(
      "CONFLICT",
      "Enterprise BDP pack must complete payment before activation review",
      { status: 409 }
    );
  }
  if (!pack.payment_intent_id && !pack.offline_payment_ref) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Franchise Pack payment evidence required before activation (FD-026)",
      { status: 400 }
    );
  }

  const metadata = {
    ...(typeof pack.metadata === "object" && pack.metadata
      ? (pack.metadata as Record<string, unknown>)
      : {}),
    ...(input.secondPackApproved ? { second_pack_approved: true } : {}),
  };

  const { data, error: upErr } = await client
    .from("enterprise_bdp_packs")
    .update({
      application_status: "active",
      activated_at: new Date().toISOString(),
      role_assignment_id: input.roleAssignmentId ?? pack.role_assignment_id,
      metadata,
    })
    .eq("id", input.packId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate Enterprise BDP pack", {
      cause: upErr,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_bdp.activate",
    resourceType: "enterprise_bdp_pack",
    resourceId: input.packId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function suspendEnterpriseBdpPack(
  client: SupabaseClient,
  input: { packId: string; actorUserId: string; reason?: string; correlationId?: string }
) {
  const { data, error } = await client
    .from("enterprise_bdp_packs")
    .update({
      application_status: "suspended",
      suspended_at: new Date().toISOString(),
    })
    .eq("id", input.packId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to suspend pack", { cause: error });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_bdp.suspend",
    resourceType: "enterprise_bdp_pack",
    resourceId: input.packId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createEnterpriseClient(
  client: SupabaseClient,
  input: {
    organisationId: string;
    displayName: string;
    industry?: string | null;
    primaryRepresentativeUserId?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("enterprise_client_profiles")
    .insert({
      organisation_id: input.organisationId,
      display_name: input.displayName,
      industry: input.industry ?? null,
      primary_representative_user_id: input.primaryRepresentativeUserId ?? null,
      status: "active",
      engagement_status: "prospect",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create Enterprise Client", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_client.create",
    resourceType: "enterprise_client_profile",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function proposeClientAttribution(
  client: SupabaseClient,
  input: {
    clientId: string;
    packId: string;
    bdpUserId: string;
    actorUserId: string;
    provenance?: string;
    basis?: string;
    correlationId?: string;
  }
) {
  const { data: pack, error: packErr } = await client
    .from("enterprise_bdp_packs")
    .select("id, user_id, application_status")
    .eq("id", input.packId)
    .single();
  if (packErr || !pack) {
    throw new AppError("NOT_FOUND", "Enterprise BDP pack not found", {
      status: 404,
    });
  }
  if (String(pack.user_id) !== input.bdpUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Pack does not belong to the specified Enterprise BDP",
      { status: 403 }
    );
  }
  if (input.actorUserId === input.bdpUserId && pack.application_status !== "active") {
    throw new AppError(
      "FORBIDDEN",
      "Active Enterprise BDP pack required to propose attribution",
      { status: 403 }
    );
  }

  const { data, error } = await client
    .from("enterprise_client_attributions")
    .insert({
      client_id: input.clientId,
      pack_id: input.packId,
      bdp_user_id: input.bdpUserId,
      status: "proposed",
      provenance: input.provenance ?? "sourced",
      basis: input.basis ?? null,
      created_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to propose client attribution", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_attr.proposed",
    resourceType: "enterprise_client_attribution",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function activateClientAttribution(
  client: SupabaseClient,
  input: {
    attributionId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: existing, error } = await client
    .from("enterprise_client_attributions")
    .select("*")
    .eq("id", input.attributionId)
    .single();
  if (error || !existing) {
    throw new AppError("NOT_FOUND", "Attribution not found", { status: 404 });
  }
  if (existing.bdp_user_id === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Enterprise BDP cannot self-approve client attribution",
      { status: 403 }
    );
  }
  const { data, error: upErr } = await client
    .from("enterprise_client_attributions")
    .update({
      status: "active",
      approved_by: input.actorUserId,
      effective_from: new Date().toISOString(),
      reason: input.reason ?? existing.reason,
    })
    .eq("id", input.attributionId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate attribution", {
      cause: upErr,
    });
  }
  if (data.pack_id) {
    await client.rpc("gce_ebdp_refresh_client_counts", { p_pack_id: data.pack_id });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_attr.activate",
    resourceType: "enterprise_client_attribution",
    resourceId: input.attributionId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

/** Prospective reassignment — closes old active attribution; earned entitlements stay. */
export async function reassignEnterpriseClient(
  client: SupabaseClient,
  input: {
    clientId: string;
    newPackId: string;
    newBdpUserId: string;
    actorUserId: string;
    reason?: string;
    effectiveFrom?: string;
    correlationId?: string;
  }
) {
  const effectiveFrom = input.effectiveFrom ?? new Date().toISOString();

  const { data: current } = await client
    .from("enterprise_client_attributions")
    .select("*")
    .eq("client_id", input.clientId)
    .eq("status", "active")
    .maybeSingle();

  if (current) {
    if (current.bdp_user_id === input.actorUserId) {
      throw new AppError(
        "FORBIDDEN",
        "Enterprise BDP cannot self-approve reassignment",
        { status: 403 }
      );
    }
    const { error: closeErr } = await client
      .from("enterprise_client_attributions")
      .update({
        status: "reassigned_closed",
        effective_to: effectiveFrom,
      })
      .eq("id", current.id);
    if (closeErr) {
      throw new AppError("INTERNAL_ERROR", "Failed to close prior attribution", {
        cause: closeErr,
      });
    }
    if (current.pack_id) {
      await client.rpc("gce_ebdp_refresh_client_counts", {
        p_pack_id: current.pack_id,
      });
    }
  }

  const { data: handover } = await client
    .from("enterprise_client_handovers")
    .insert({
      client_id: input.clientId,
      source_pack_id: current?.pack_id ?? null,
      target_pack_id: input.newPackId,
      status: "completed",
      effective_from: effectiveFrom,
      notes: input.reason ?? null,
      requested_by: input.actorUserId,
      approved_by: input.actorUserId,
      completed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  const { data: next, error } = await client
    .from("enterprise_client_attributions")
    .insert({
      client_id: input.clientId,
      pack_id: input.newPackId,
      bdp_user_id: input.newBdpUserId,
      status: "active",
      provenance: "reassignment",
      effective_from: effectiveFrom,
      created_by: input.actorUserId,
      approved_by: input.actorUserId,
      reason: input.reason ?? "Prospective reassignment (OD-027 gated)",
      metadata: { handover_id: handover?.id ?? null, prospective: true },
    })
    .select("*")
    .single();
  if (error || !next) {
    throw new AppError("INTERNAL_ERROR", "Failed to create new attribution", {
      cause: error,
    });
  }
  await client.rpc("gce_ebdp_refresh_client_counts", {
    p_pack_id: input.newPackId,
  });
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_attr.reassign",
    resourceType: "enterprise_client_attribution",
    resourceId: String(next.id),
    after: next,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return { previous: current, next, handover };
}

/** BDP proposes a corporate prospect — organisation + client profile + attribution (proposed). */
export async function proposeCorporateClient(
  client: SupabaseClient,
  input: {
    packId: string;
    bdpUserId: string;
    legalName: string;
    displayName: string;
    industry?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    basis?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const org = await createOrganisation(
    client,
    {
      kind: "enterprise_client",
      legalName: input.legalName.trim(),
      tradingName: input.displayName.trim(),
      countryCode: "IN",
    },
    { userId: input.actorUserId, correlationId: input.correlationId }
  );

  const profile = await createEnterpriseClient(client, {
    organisationId: String(org.id),
    displayName: input.displayName.trim(),
    industry: input.industry ?? null,
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  await client
    .from("enterprise_client_profiles")
    .update({
      engagement_status: "prospect",
      metadata: {
        bdpLead: true,
        contactName: input.contactName ?? null,
        contactEmail: input.contactEmail ?? null,
        contactPhone: input.contactPhone ?? null,
      },
    })
    .eq("id", profile.id);

  const attribution = await proposeClientAttribution(client, {
    clientId: String(profile.id),
    packId: input.packId,
    bdpUserId: input.bdpUserId,
    actorUserId: input.actorUserId,
    provenance: "bdp_sourced",
    basis: input.basis ?? "Corporate lead proposed by Enterprise BDP",
    correlationId: input.correlationId,
  });

  return { organisation: org, client: profile, attribution };
}

export async function createOpportunity(
  client: SupabaseClient,
  input: {
    clientId: string;
    title: string;
    summary?: string | null;
    category?: string | null;
    source?: string | null;
    attributedBdpUserId?: string | null;
    packId?: string | null;
    ownerUserId?: string | null;
    expertUserId?: string | null;
    clientRepUserId?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("enterprise_opportunities")
    .insert({
      client_id: input.clientId,
      title: input.title,
      summary: input.summary ?? null,
      category: input.category ?? null,
      source: input.source ?? null,
      status: "open",
      attributed_bdp_user_id: input.attributedBdpUserId ?? null,
      pack_id: input.packId ?? null,
      owner_user_id: input.ownerUserId ?? input.actorUserId,
      expert_user_id: input.expertUserId ?? null,
      client_rep_user_id: input.clientRepUserId ?? null,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create opportunity", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_opportunity.create",
    resourceType: "enterprise_opportunity",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createRequirementVersion(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    rawRequirement?: string | null;
    structuredScope?: string | null;
    objectives?: string | null;
    deliverables?: string | null;
    timelineNotes?: string | null;
    locations?: string | null;
    budgetGuidanceMinor?: number | null;
    constraints?: string | null;
    changeReason?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  let requirementId: string;
  const { data: existing } = await client
    .from("enterprise_requirements")
    .select("*")
    .eq("opportunity_id", input.opportunityId)
    .maybeSingle();

  if (!existing) {
    const { data: created, error } = await client
      .from("enterprise_requirements")
      .insert({
        opportunity_id: input.opportunityId,
        current_version: 1,
        readiness_status: "structuring",
        structured_by: input.actorUserId,
      })
      .select("*")
      .single();
    if (error || !created) {
      throw new AppError("INTERNAL_ERROR", "Failed to create requirement", {
        cause: error,
      });
    }
    requirementId = String(created.id);
  } else {
    requirementId = String(existing.id);
  }

  const { data: latest } = await client
    .from("enterprise_requirement_versions")
    .select("version_no")
    .eq("requirement_id", requirementId)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  const versionNo = (latest?.version_no ?? 0) + 1;

  const { data: version, error: vErr } = await client
    .from("enterprise_requirement_versions")
    .insert({
      requirement_id: requirementId,
      version_no: versionNo,
      raw_requirement: input.rawRequirement ?? null,
      structured_scope: input.structuredScope ?? null,
      objectives: input.objectives ?? null,
      deliverables: input.deliverables ?? null,
      timeline_notes: input.timelineNotes ?? null,
      locations: input.locations ?? null,
      budget_guidance_minor: input.budgetGuidanceMinor ?? null,
      constraints: input.constraints ?? null,
      change_reason: input.changeReason ?? (versionNo === 1 ? "initial" : "revision"),
      actor_user_id: input.actorUserId,
      approval_status: "draft",
    })
    .select("*")
    .single();
  if (vErr || !version) {
    throw new AppError("INTERNAL_ERROR", "Failed to create requirement version", {
      cause: vErr,
    });
  }

  await client
    .from("enterprise_requirements")
    .update({
      current_version: versionNo,
      structured_by: input.actorUserId,
      readiness_status: "structuring",
    })
    .eq("id", requirementId);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_requirement.version",
    resourceType: "enterprise_requirement_version",
    resourceId: String(version.id),
    after: version,
    correlationId: input.correlationId,
  });
  return version;
}

export async function createSolutionProposal(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    title: string;
    requirementVersionId?: string | null;
    solutionSummary?: string | null;
    assumptions?: string | null;
    exclusions?: string | null;
    pricingSummaryMinor?: number;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: latest } = await client
    .from("enterprise_solution_proposals")
    .select("version_no")
    .eq("opportunity_id", input.opportunityId)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();
  const versionNo = (latest?.version_no ?? 0) + 1;

  const { data, error } = await client
    .from("enterprise_solution_proposals")
    .insert({
      opportunity_id: input.opportunityId,
      requirement_version_id: input.requirementVersionId ?? null,
      version_no: versionNo,
      title: input.title,
      solution_summary: input.solutionSummary ?? null,
      assumptions: input.assumptions ?? null,
      exclusions: input.exclusions ?? null,
      pricing_summary_minor: input.pricingSummaryMinor ?? 0,
      internal_status: "draft",
      client_facing_status: "internal",
      prepared_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create proposal", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_proposal.create",
    resourceType: "enterprise_solution_proposal",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

function quoteRef(): string {
  return `EQ-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export async function createQuote(
  client: SupabaseClient,
  input: {
    opportunityId: string;
    clientId: string;
    proposalId?: string | null;
    requirementVersionId?: string | null;
    totalProposedMinor: number;
    lines: Array<{
      label: string;
      componentType?: string;
      sourcingVertical?: string;
      amountMinor: number;
      platformCommissionBps?: number;
      revenueComponentKey: string;
    }>;
    actorUserId: string;
    /** BDP users must not issue binding quotes (FD-038) — set allowIssue=false */
    correlationId?: string;
  }
) {
  const requiresCosign = financeCosignRequired(input.totalProposedMinor);
  const { data: quote, error } = await client
    .from("enterprise_quotes")
    .insert({
      opportunity_id: input.opportunityId,
      client_id: input.clientId,
      proposal_id: input.proposalId ?? null,
      requirement_version_id: input.requirementVersionId ?? null,
      quote_ref: quoteRef(),
      total_proposed_minor: input.totalProposedMinor,
      status: requiresCosign ? "pending_finance_cosign" : "internal_review",
      finance_cosign_required: requiresCosign,
    })
    .select("*")
    .single();
  if (error || !quote) {
    throw new AppError("INTERNAL_ERROR", "Failed to create quote", { cause: error });
  }

  if (input.lines.length) {
    const { error: lineErr } = await client.from("enterprise_quote_lines").insert(
      input.lines.map((line, idx) => ({
        quote_id: quote.id,
        line_no: idx + 1,
        label: line.label,
        component_type: line.componentType ?? "enterprise_service",
        sourcing_vertical: line.sourcingVertical ?? "enterprise",
        amount_minor: line.amountMinor,
        platform_commission_bps:
          line.platformCommissionBps ?? ENTERPRISE_PLATFORM_COMMISSION_BPS,
        revenue_component_key: line.revenueComponentKey,
      }))
    );
    if (lineErr) {
      throw new AppError("INTERNAL_ERROR", "Failed to create quote lines", {
        cause: lineErr,
      });
    }
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_quote.create",
    resourceType: "enterprise_quote",
    resourceId: String(quote.id),
    after: quote,
    correlationId: input.correlationId,
  });
  return quote;
}

export async function financeCosignQuote(
  client: SupabaseClient,
  input: {
    quoteId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: quote, error } = await client
    .from("enterprise_quotes")
    .select("*")
    .eq("id", input.quoteId)
    .single();
  if (error || !quote) {
    throw new AppError("NOT_FOUND", "Quote not found", { status: 404 });
  }
  if (!quote.finance_cosign_required) {
    throw new AppError("CONFLICT", "Finance co-sign not required for this quote", {
      status: 409,
    });
  }
  if (quote.finance_cosigned_by) {
    throw new AppError("CONFLICT", "Quote already finance co-signed", {
      status: 409,
    });
  }
  if (quote.issued_by === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Issuer cannot finance-cosign own quote", {
      status: 403,
    });
  }

  const { data, error: upErr } = await client
    .from("enterprise_quotes")
    .update({
      status: "finance_cosigned",
      finance_cosigned_by: input.actorUserId,
      finance_cosigned_at: new Date().toISOString(),
    })
    .eq("id", input.quoteId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to finance co-sign quote", {
      cause: upErr,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_quote.finance_cosign",
    resourceType: "enterprise_quote",
    resourceId: input.quoteId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function issueQuote(
  client: SupabaseClient,
  input: {
    quoteId: string;
    actorUserId: string;
    isEnterpriseBdp?: boolean;
    correlationId?: string;
  }
) {
  if (input.isEnterpriseBdp) {
    throw new AppError(
      "FORBIDDEN",
      "Enterprise BDP alone may not issue binding quotes (FD-038)",
      { status: 403 }
    );
  }
  const { data: quote, error } = await client
    .from("enterprise_quotes")
    .select("*")
    .eq("id", input.quoteId)
    .single();
  if (error || !quote) {
    throw new AppError("NOT_FOUND", "Quote not found", { status: 404 });
  }
  if (
    quote.finance_cosign_required &&
    (!quote.finance_cosigned_by || !quote.finance_cosigned_at)
  ) {
    throw new AppError(
      "FORBIDDEN",
      "Finance co-sign required before issuing quotes above ₹5,00,000 (FD-038)",
      { status: 403 }
    );
  }

  const { data, error: upErr } = await client
    .from("enterprise_quotes")
    .update({
      status: "issued",
      issued_by: input.actorUserId,
      issued_at: new Date().toISOString(),
    })
    .eq("id", input.quoteId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to issue quote", { cause: upErr });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_quote.issue",
    resourceType: "enterprise_quote",
    resourceId: input.quoteId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function acceptQuote(
  client: SupabaseClient,
  input: {
    quoteId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: quote, error } = await client
    .from("enterprise_quotes")
    .select("*")
    .eq("id", input.quoteId)
    .single();
  if (error || !quote) {
    throw new AppError("NOT_FOUND", "Quote not found", { status: 404 });
  }
  if (quote.status !== "issued" && quote.status !== "viewed") {
    throw new AppError("CONFLICT", "Only issued quotes can be accepted", {
      status: 409,
    });
  }

  const { data, error: upErr } = await client
    .from("enterprise_quotes")
    .update({
      status: "accepted",
      accepted_by: input.actorUserId,
      accepted_at: new Date().toISOString(),
    })
    .eq("id", input.quoteId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to accept quote", { cause: upErr });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_quote.accept",
    resourceType: "enterprise_quote",
    resourceId: input.quoteId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

function projectRef(): string {
  return `EP-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export async function createProjectFromAcceptedQuote(
  client: SupabaseClient,
  input: {
    quoteId: string;
    title: string;
    ownerUserId?: string | null;
    actorUserId: string;
    gceExecutionRole?: string;
    correlationId?: string;
  }
) {
  const { data: quote, error } = await client
    .from("enterprise_quotes")
    .select("*")
    .eq("id", input.quoteId)
    .single();
  if (error || !quote) {
    throw new AppError("NOT_FOUND", "Quote not found", { status: 404 });
  }
  if (quote.status !== "accepted") {
    throw new AppError("CONFLICT", "Project requires an accepted quote", {
      status: 409,
    });
  }

  const { data: existingOppProject } = await client
    .from("enterprise_projects")
    .select("id")
    .eq("opportunity_id", quote.opportunity_id)
    .in("status", ["setup", "approved", "active", "on_hold"])
    .maybeSingle();
  if (existingOppProject) {
    throw new AppError(
      "CONFLICT",
      "An active project already exists for this opportunity",
      { status: 409 }
    );
  }

  const { data: existing } = await client
    .from("enterprise_projects")
    .select("id")
    .eq("accepted_quote_id", input.quoteId)
    .maybeSingle();
  if (existing) {
    throw new AppError(
      "CONFLICT",
      "Project already exists for this accepted quote",
      { status: 409 }
    );
  }

  const { data: attr } = await client
    .from("enterprise_client_attributions")
    .select("*")
    .eq("client_id", quote.client_id)
    .eq("status", "active")
    .maybeSingle();

  const { data: project, error: pErr } = await client
    .from("enterprise_projects")
    .insert({
      client_id: quote.client_id,
      opportunity_id: quote.opportunity_id,
      accepted_quote_id: quote.id,
      project_ref: projectRef(),
      title: input.title,
      status: "setup",
      owner_user_id: input.ownerUserId ?? input.actorUserId,
      attribution_id: attr?.id ?? null,
      pack_id: attr?.pack_id ?? null,
      commercial_total_minor: quote.total_proposed_minor,
      gce_execution_role: input.gceExecutionRole ?? "platform_intermediary",
    })
    .select("*")
    .single();
  if (pErr || !project) {
    if (pErr?.code === "23505") {
      throw new AppError(
        "CONFLICT",
        "An active project already exists for this opportunity or accepted quote",
        { status: 409, cause: pErr }
      );
    }
    throw new AppError("INTERNAL_ERROR", "Failed to create project", {
      cause: pErr,
    });
  }

  const { data: lines } = await client
    .from("enterprise_quote_lines")
    .select("*")
    .eq("quote_id", quote.id)
    .order("line_no");

  if (lines?.length) {
    const components = lines.map((line, idx) => {
      const platformCommissionMinor = Math.floor(
        (Number(line.amount_minor) * Number(line.platform_commission_bps)) / 10_000
      );
      return {
        project_id: project.id,
        component_key: `c${idx + 1}`,
        label: line.label,
        component_type: line.component_type,
        sourcing_vertical: line.sourcing_vertical,
        commercial_amount_minor: line.amount_minor,
        platform_commission_bps: line.platform_commission_bps,
        platform_commission_minor: platformCommissionMinor,
        revenue_component_key: line.revenue_component_key,
        status: "planned",
      };
    });
    const { error: cErr } = await client
      .from("enterprise_project_components")
      .insert(components);
    if (cErr) {
      throw new AppError("INTERNAL_ERROR", "Failed to create project components", {
        cause: cErr,
      });
    }
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_project.create",
    resourceType: "enterprise_project",
    resourceId: String(project.id),
    after: project,
    correlationId: input.correlationId,
  });
  return project;
}

export async function addProjectMilestone(
  client: SupabaseClient,
  input: {
    projectId: string;
    name: string;
    amountMinor?: number | null;
    percentageBps?: number | null;
    dueTrigger?: string | null;
    dueOn?: string | null;
    componentId?: string | null;
    sortOrder?: number;
    actorUserId: string;
    correlationId?: string;
  }
) {
  if (input.amountMinor == null && input.percentageBps == null) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Milestone requires amount_minor or percentage_bps",
      { status: 400 }
    );
  }
  const { data, error } = await client
    .from("enterprise_milestones")
    .insert({
      project_id: input.projectId,
      component_id: input.componentId ?? null,
      name: input.name,
      amount_minor: input.amountMinor ?? null,
      percentage_bps: input.percentageBps ?? null,
      due_trigger: input.dueTrigger ?? null,
      due_on: input.dueOn ?? null,
      sort_order: input.sortOrder ?? 0,
      status: "planned",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create milestone", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_milestone.create",
    resourceType: "enterprise_milestone",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createManagedVendor(
  client: SupabaseClient,
  input: {
    businessName: string;
    category?: string | null;
    contactName?: string | null;
    contactEmail?: string | null;
    contactPhone?: string | null;
    capabilities?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("enterprise_vendors")
    .insert({
      business_name: input.businessName,
      category: input.category ?? null,
      contact_name: input.contactName ?? null,
      contact_email: input.contactEmail ?? null,
      contact_phone: input.contactPhone ?? null,
      capabilities: input.capabilities ?? null,
      login_enabled: false,
      status: "active",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create vendor", { cause: error });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_vendor.create",
    resourceType: "enterprise_vendor",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function assignVendor(
  client: SupabaseClient,
  input: {
    projectId: string;
    vendorId: string;
    componentId?: string | null;
    scope?: string | null;
    commercialAmountMinor?: number | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("enterprise_vendor_assignments")
    .insert({
      project_id: input.projectId,
      vendor_id: input.vendorId,
      component_id: input.componentId ?? null,
      scope: input.scope ?? null,
      commercial_amount_minor: input.commercialAmountMinor ?? null,
      assigned_by: input.actorUserId,
      status: "assigned",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to assign vendor", { cause: error });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_vendor.assign",
    resourceType: "enterprise_vendor_assignment",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createChangeOrder(
  client: SupabaseClient,
  input: {
    projectId: string;
    title: string;
    requestedChange: string;
    commercialImpactMinor?: number;
    timelineImpact?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("enterprise_change_orders")
    .insert({
      project_id: input.projectId,
      title: input.title,
      requested_change: input.requestedChange,
      commercial_impact_minor: input.commercialImpactMinor ?? 0,
      timeline_impact: input.timelineImpact ?? null,
      requested_by: input.actorUserId,
      status: "requested",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create change order", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_change_order.create",
    resourceType: "enterprise_change_order",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function openEnterpriseDispute(
  client: SupabaseClient,
  input: {
    clientId?: string | null;
    projectId?: string | null;
    subjectType: string;
    title: string;
    details?: string | null;
    severity?: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("enterprise_disputes")
    .insert({
      client_id: input.clientId ?? null,
      project_id: input.projectId ?? null,
      subject_type: input.subjectType,
      title: input.title,
      details: input.details ?? null,
      severity: input.severity ?? "medium",
      status: "open",
      owner_user_id: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to open dispute", { cause: error });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_dispute.open",
    resourceType: "enterprise_dispute",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/**
 * Creates Enterprise BDP entitlement boundary for a project component.
 * Claims revenue_component_key to prevent double commission across verticals.
 */
export async function createEnterpriseEntitlement(
  client: SupabaseClient,
  input: {
    earningEventKey: string;
    clientId: string;
    projectId?: string | null;
    componentId?: string | null;
    revenueComponentKey: string;
    eligibleEventRevenueMinor: number;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: attr } = await client
    .from("enterprise_client_attributions")
    .select("*")
    .eq("client_id", input.clientId)
    .eq("status", "active")
    .maybeSingle();

  const calc = calculateEnterpriseEntitlement({
    eligibleEventRevenueMinor: input.eligibleEventRevenueMinor,
    hasValidAttribution: Boolean(attr),
  });

  const { data: existingEntitlement } = await client
    .from("enterprise_revenue_entitlements")
    .select("*")
    .eq("earning_event_key", input.earningEventKey)
    .maybeSingle();
  if (existingEntitlement) {
    return existingEntitlement;
  }

  // Claim component before insert — fails if Marketplace (or other) already commissioned
  const { error: claimErr } = await client.rpc("gce_claim_revenue_component", {
    p_key: input.revenueComponentKey,
    p_vertical: "enterprise",
    p_stakeholder: calc.entitledEbdp ? "enterprise_bdp" : "none",
    p_entitlement_ref: null,
  });
  if (claimErr) {
    throw new AppError(
      "CONFLICT",
      "No double commission on this revenue component (FD-038)",
      { status: 409, cause: claimErr }
    );
  }

  const { data, error } = await client
    .from("enterprise_revenue_entitlements")
    .insert({
      earning_event_key: input.earningEventKey,
      client_id: input.clientId,
      project_id: input.projectId ?? null,
      component_id: input.componentId ?? null,
      revenue_component_key: input.revenueComponentKey,
      attribution_id: attr?.id ?? null,
      pack_id: attr?.pack_id ?? null,
      eligible_event_revenue_minor: input.eligibleEventRevenueMinor,
      platform_commission_minor: calc.platformCommissionMinor,
      ebdp_entitlement_bps: 2500,
      ebdp_entitlement_minor: calc.ebdpEntitlementMinor,
      has_valid_attribution: calc.entitledEbdp,
      state: calc.entitledEbdp ? "earned" : "estimated",
      rule_version: ENTERPRISE_RULE_VERSION,
    })
    .select("*")
    .single();
  if (error?.code === "23505") {
    const { data: raced } = await client
      .from("enterprise_revenue_entitlements")
      .select("*")
      .eq("earning_event_key", input.earningEventKey)
      .maybeSingle();
    if (raced) return raced;
  }
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create entitlement boundary", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "enterprise_entitlement.create",
    resourceType: "enterprise_revenue_entitlement",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function listEbdpPacksForUser(
  client: SupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from("enterprise_bdp_packs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list Enterprise BDP packs", {
      cause: error,
    });
  }
  return data ?? [];
}
