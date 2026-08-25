import type { SupabaseClient } from "@supabase/supabase-js";

export async function buildEbdpDashboard(
  client: SupabaseClient,
  packId: string
) {
  const { data: pack } = await client
    .from("enterprise_bdp_packs")
    .select("*")
    .eq("id", packId)
    .maybeSingle();
  if (!pack) return null;

  const { data: attrs } = await client
    .from("enterprise_client_attributions")
    .select("id, status, client_id")
    .eq("pack_id", packId);

  const activeClients = (attrs ?? []).filter((a) => a.status === "active");
  const clientIds = activeClients.map((a) => a.client_id);

  let openOpportunities = 0;
  let activeProjects = 0;
  if (clientIds.length) {
    const { count: oppCount } = await client
      .from("enterprise_opportunities")
      .select("id", { count: "exact", head: true })
      .in("client_id", clientIds)
      .in("status", ["open", "qualifying", "proposal_in_progress", "quoting"]);
    openOpportunities = oppCount ?? 0;

    const { count: projCount } = await client
      .from("enterprise_projects")
      .select("id", { count: "exact", head: true })
      .eq("pack_id", packId)
      .in("status", ["setup", "approved", "active", "on_hold"]);
    activeProjects = projCount ?? 0;
  }

  const { data: ents } = await client
    .from("enterprise_revenue_entitlements")
    .select("ebdp_entitlement_minor, state")
    .eq("pack_id", packId);

  const grossEligible = (ents ?? []).reduce(
    (sum, e) => sum + Number(e.ebdp_entitlement_minor ?? 0),
    0
  );

  let openDisputes = 0;
  if (clientIds.length) {
    const { count } = await client
      .from("enterprise_disputes")
      .select("id", { count: "exact", head: true })
      .eq("status", "open")
      .in("client_id", clientIds);
    openDisputes = count ?? 0;
  }

  const { count: handovers } = await client
    .from("enterprise_client_handovers")
    .select("id", { count: "exact", head: true })
    .or(`source_pack_id.eq.${packId},target_pack_id.eq.${packId}`);

  return {
    packId: String(pack.id),
    applicationStatus: String(pack.application_status),
    packageOption: String(pack.package_option),
    remainingRecoverableMinor: Number(pack.remaining_recoverable_minor),
    activeClientCount: Number(pack.active_client_count),
    clientsCapacity: Number(pack.clients_capacity_max),
    attributedClients: activeClients.length,
    proposedAttributions: (attrs ?? []).filter((a) => a.status === "proposed")
      .length,
    openOpportunities,
    activeProjects,
    grossEligibleCommissionMinor: grossEligible,
    openDisputes,
    reassignmentEvents: handovers ?? 0,
  };
}

export async function buildEnterpriseClientDashboard(
  client: SupabaseClient,
  clientId: string
) {
  const { data: profile } = await client
    .from("enterprise_client_profiles")
    .select("*")
    .eq("id", clientId)
    .maybeSingle();
  if (!profile) return null;

  const { count: opportunities } = await client
    .from("enterprise_opportunities")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId);

  const { count: quotesPending } = await client
    .from("enterprise_quotes")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId)
    .in("status", ["issued", "viewed"]);

  const { count: projects } = await client
    .from("enterprise_projects")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId);

  const { data: projectRows } = await client
    .from("enterprise_projects")
    .select("id")
    .eq("client_id", clientId);
  const projectIds = (projectRows ?? []).map((p) => p.id);

  let milestonesDue = 0;
  if (projectIds.length) {
    const { count } = await client
      .from("enterprise_milestones")
      .select("id", { count: "exact", head: true })
      .in("project_id", projectIds)
      .in("status", ["due", "submitted"]);
    milestonesDue = count ?? 0;
  }

  const { count: disputes } = await client
    .from("enterprise_disputes")
    .select("id", { count: "exact", head: true })
    .eq("client_id", clientId)
    .neq("status", "resolved");

  return {
    clientId: String(profile.id),
    displayName: String(profile.display_name),
    status: String(profile.status),
    engagementStatus: String(profile.engagement_status),
    opportunities: opportunities ?? 0,
    quotesAwaitingAcceptance: quotesPending ?? 0,
    projects: projects ?? 0,
    milestonesDue,
    openDisputes: disputes ?? 0,
  };
}

export async function buildExpertDashboard(
  client: SupabaseClient,
  expertUserId: string
) {
  const { count: assignedOpps } = await client
    .from("enterprise_opportunities")
    .select("id", { count: "exact", head: true })
    .eq("expert_user_id", expertUserId)
    .not("status", "in", '("won","lost","cancelled","archived")');

  const { count: draftProposals } = await client
    .from("enterprise_solution_proposals")
    .select("id", { count: "exact", head: true })
    .eq("prepared_by", expertUserId)
    .eq("internal_status", "draft");

  const { count: pendingCosign } = await client
    .from("enterprise_quotes")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending_finance_cosign");

  return {
    expertUserId,
    assignedOpportunities: assignedOpps ?? 0,
    draftProposals: draftProposals ?? 0,
    quotesPendingFinanceCosign: pendingCosign ?? 0,
  };
}

export async function listClientsForRepresentative(
  client: SupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from("enterprise_client_profiles")
    .select("id, display_name, status, engagement_status")
    .or(`primary_representative_user_id.eq.${userId}`);
  if (error) return [];
  return data ?? [];
}

export async function canActorReadEnterpriseClient(
  client: SupabaseClient,
  input: {
    userId: string;
    clientId: string;
    packIds: string[];
    isPlatformAdmin: boolean;
  }
): Promise<boolean> {
  if (input.isPlatformAdmin) return true;
  const reps = await listClientsForRepresentative(client, input.userId);
  if (reps.some((c) => String(c.id) === input.clientId)) return true;
  if (input.packIds.length) {
    const { data } = await client
      .from("enterprise_client_attributions")
      .select("id")
      .eq("client_id", input.clientId)
      .in("pack_id", input.packIds)
      .limit(1);
    if (data && data.length > 0) return true;
  }
  const { data: assigned } = await client
    .from("enterprise_opportunities")
    .select("id")
    .eq("client_id", input.clientId)
    .eq("expert_user_id", input.userId)
    .limit(1);
  return Boolean(assigned && assigned.length > 0);
}
