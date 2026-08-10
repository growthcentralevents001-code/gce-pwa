import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildEbdpDashboard,
  buildEnterpriseClientDashboard,
  buildExpertDashboard,
  listClientsForRepresentative,
  listEbdpPacksForUser,
} from "@/lib/architecture/enterprise";

export type EnterpriseClientRow = Record<string, unknown> & { id: string };
export type EbdpPackRow = Record<string, unknown> & { id: string };

export type EnterpriseClientBundle = {
  clients: EnterpriseClientRow[];
  client: EnterpriseClientRow | null;
  report: Awaited<ReturnType<typeof buildEnterpriseClientDashboard>>;
  opportunities: Record<string, unknown>[];
  requirements: Record<string, unknown>[];
  proposals: Record<string, unknown>[];
  quotes: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  milestones: Record<string, unknown>[];
  components: Record<string, unknown>[];
  changeOrders: Record<string, unknown>[];
  vendors: Record<string, unknown>[];
  vendorAssignments: Record<string, unknown>[];
  disputes: Record<string, unknown>[];
};

export type EnterpriseBdpBundle = {
  packs: EbdpPackRow[];
  pack: EbdpPackRow | null;
  report: Awaited<ReturnType<typeof buildEbdpDashboard>>;
  attributions: Record<string, unknown>[];
  clients: Record<string, unknown>[];
  opportunities: Record<string, unknown>[];
  proposals: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  entitlements: Record<string, unknown>[];
  handovers: Record<string, unknown>[];
  disputes: Record<string, unknown>[];
};

export type EnterpriseExpertBundle = {
  report: Awaited<ReturnType<typeof buildExpertDashboard>>;
  opportunities: Record<string, unknown>[];
  requirements: Record<string, unknown>[];
  proposals: Record<string, unknown>[];
  quotes: Record<string, unknown>[];
  projects: Record<string, unknown>[];
  components: Record<string, unknown>[];
  vendors: Record<string, unknown>[];
  vendorAssignments: Record<string, unknown>[];
};

export async function loadEnterpriseClientBundle(
  userClient: SupabaseClient,
  adminClient: SupabaseClient,
  userId: string,
  preferredClientId?: string | null
): Promise<EnterpriseClientBundle> {
  const clients = (await listClientsForRepresentative(
    userClient,
    userId
  )) as EnterpriseClientRow[];
  const client =
    (preferredClientId
      ? clients.find((c) => c.id === preferredClientId)
      : undefined) ??
    clients[0] ??
    null;

  if (!client) {
    return {
      clients,
      client: null,
      report: null,
      opportunities: [],
      requirements: [],
      proposals: [],
      quotes: [],
      projects: [],
      milestones: [],
      components: [],
      changeOrders: [],
      vendors: [],
      vendorAssignments: [],
      disputes: [],
    };
  }

  const clientId = client.id;
  const db = adminClient;

  const [report, oppsRes, quotesRes, projectsRes, disputesRes] =
    await Promise.all([
      buildEnterpriseClientDashboard(db, clientId),
      db
        .from("enterprise_opportunities")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(80),
      db
        .from("enterprise_quotes")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_projects")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_disputes")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

  const opportunities = (oppsRes.data as Record<string, unknown>[]) ?? [];
  const quotes = (quotesRes.data as Record<string, unknown>[]) ?? [];
  const projects = (projectsRes.data as Record<string, unknown>[]) ?? [];
  const disputes = (disputesRes.data as Record<string, unknown>[]) ?? [];
  const oppIds = opportunities.map((o) => String(o.id)).filter(Boolean);
  const projectIds = projects.map((p) => String(p.id)).filter(Boolean);

  let requirements: Record<string, unknown>[] = [];
  let proposals: Record<string, unknown>[] = [];
  if (oppIds.length) {
    const { data: reqRoots } = await db
      .from("enterprise_requirements")
      .select("id, opportunity_id, readiness_status")
      .in("opportunity_id", oppIds)
      .limit(80);
    const reqIds = (reqRoots ?? []).map((r) => String(r.id)).filter(Boolean);
    const [reqRes, propRes] = await Promise.all([
      reqIds.length
        ? db
            .from("enterprise_requirement_versions")
            .select("*")
            .in("requirement_id", reqIds)
            .order("version_no", { ascending: false })
            .limit(80)
        : Promise.resolve({ data: [] as Record<string, unknown>[] }),
      db
        .from("enterprise_solution_proposals")
        .select("*")
        .in("opportunity_id", oppIds)
        .order("created_at", { ascending: false })
        .limit(60),
    ]);
    const rootById = new Map(
      (reqRoots ?? []).map((r) => [String(r.id), r] as const)
    );
    requirements = ((reqRes.data as Record<string, unknown>[]) ?? []).map(
      (v) => {
        const root = rootById.get(String(v.requirement_id));
        return {
          ...v,
          opportunity_id: root?.opportunity_id,
          status: v.approval_status ?? root?.readiness_status,
          version_number: v.version_no,
        };
      }
    );
    proposals = (propRes.data as Record<string, unknown>[]) ?? [];
  }

  let milestones: Record<string, unknown>[] = [];
  let components: Record<string, unknown>[] = [];
  let changeOrders: Record<string, unknown>[] = [];
  let vendorAssignments: Record<string, unknown>[] = [];
  if (projectIds.length) {
    const [msRes, compRes, coRes, vaRes] = await Promise.all([
      db
        .from("enterprise_milestones")
        .select("*")
        .in("project_id", projectIds)
        .order("sort_order", { ascending: true })
        .limit(120),
      db
        .from("enterprise_project_components")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
        .limit(120),
      db
        .from("enterprise_change_orders")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_vendor_assignments")
        .select("*, enterprise_vendors(*)")
        .in("project_id", projectIds)
        .limit(80),
    ]);
    milestones = (msRes.data as Record<string, unknown>[]) ?? [];
    components = ((compRes.data as Record<string, unknown>[]) ?? []).map((c) => ({
      ...c,
      name: c.label ?? c.component_key,
      amount_minor: c.commercial_amount_minor,
    }));
    changeOrders = (coRes.data as Record<string, unknown>[]) ?? [];
    vendorAssignments = (vaRes.data as Record<string, unknown>[]) ?? [];
  }

  const vendorIds = [
    ...new Set(
      vendorAssignments
        .map((a) => String(a.vendor_id ?? ""))
        .filter(Boolean)
    ),
  ];
  let vendors: Record<string, unknown>[] = [];
  if (vendorIds.length) {
    const { data } = await db
      .from("enterprise_vendors")
      .select("id, business_name, category, status")
      .in("id", vendorIds)
      .limit(80);
    vendors = (data as Record<string, unknown>[]) ?? [];
  }

  return {
    clients,
    client,
    report,
    opportunities,
    requirements,
    proposals,
    quotes,
    projects,
    milestones,
    components,
    changeOrders,
    vendors,
    vendorAssignments,
    disputes,
  };
}

export async function loadEnterpriseBdpBundle(
  userClient: SupabaseClient,
  adminClient: SupabaseClient,
  userId: string,
  preferredPackId?: string | null
): Promise<EnterpriseBdpBundle> {
  const packs = (await listEbdpPacksForUser(
    userClient,
    userId
  )) as EbdpPackRow[];
  const pack =
    (preferredPackId
      ? packs.find((p) => p.id === preferredPackId)
      : undefined) ??
    packs.find((p) => p.application_status === "active") ??
    packs[0] ??
    null;

  if (!pack) {
    return {
      packs,
      pack: null,
      report: null,
      attributions: [],
      clients: [],
      opportunities: [],
      proposals: [],
      projects: [],
      entitlements: [],
      handovers: [],
      disputes: [],
    };
  }

  const packId = pack.id;
  const db = adminClient;

  const [report, attrsRes, entsRes, projectsRes, handoversRes] =
    await Promise.all([
      buildEbdpDashboard(db, packId),
      db
        .from("enterprise_client_attributions")
        .select("*, enterprise_client_profiles(*)")
        .eq("pack_id", packId)
        .order("created_at", { ascending: false })
        .limit(100),
      db
        .from("enterprise_revenue_entitlements")
        .select("*")
        .eq("pack_id", packId)
        .order("created_at", { ascending: false })
        .limit(50),
      db
        .from("enterprise_projects")
        .select("*")
        .eq("pack_id", packId)
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_client_handovers")
        .select("*")
        .or(`source_pack_id.eq.${packId},target_pack_id.eq.${packId}`)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);

  const attributions = (attrsRes.data as Record<string, unknown>[]) ?? [];
  const entitlements = (entsRes.data as Record<string, unknown>[]) ?? [];
  const projects = (projectsRes.data as Record<string, unknown>[]) ?? [];
  const handovers = (handoversRes.data as Record<string, unknown>[]) ?? [];

  const clients = attributions
    .map((a) => {
      const c = a.enterprise_client_profiles;
      return Array.isArray(c) ? c[0] : c;
    })
    .filter(Boolean) as Record<string, unknown>[];

  const clientIds = [
    ...new Set(
      attributions.map((a) => String(a.client_id ?? "")).filter(Boolean)
    ),
  ];

  let opportunities: Record<string, unknown>[] = [];
  let proposals: Record<string, unknown>[] = [];
  let disputes: Record<string, unknown>[] = [];
  if (clientIds.length) {
    const [oppRes, disputeRes] = await Promise.all([
      db
        .from("enterprise_opportunities")
        .select("*")
        .in("client_id", clientIds)
        .order("created_at", { ascending: false })
        .limit(80),
      db
        .from("enterprise_disputes")
        .select("*")
        .in("client_id", clientIds)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);
    opportunities = (oppRes.data as Record<string, unknown>[]) ?? [];
    disputes = (disputeRes.data as Record<string, unknown>[]) ?? [];
    const oppIds = opportunities.map((o) => String(o.id)).filter(Boolean);
    if (oppIds.length) {
      const { data } = await db
        .from("enterprise_solution_proposals")
        .select("*")
        .in("opportunity_id", oppIds)
        .order("created_at", { ascending: false })
        .limit(60);
      proposals = (data as Record<string, unknown>[]) ?? [];
    }
  }

  return {
    packs,
    pack,
    report,
    attributions,
    clients,
    opportunities,
    proposals,
    projects,
    entitlements,
    handovers,
    disputes,
  };
}

export async function loadEnterpriseExpertBundle(
  adminClient: SupabaseClient,
  userId: string
): Promise<EnterpriseExpertBundle> {
  const db = adminClient;
  const [report, oppRes, propRes, quoteRes, projectRes, vendorRes] =
    await Promise.all([
      buildExpertDashboard(db, userId),
      db
        .from("enterprise_opportunities")
        .select("*")
        .eq("expert_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(80),
      db
        .from("enterprise_solution_proposals")
        .select("*")
        .eq("prepared_by", userId)
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_quotes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60),
      db
        .from("enterprise_vendors")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(80),
    ]);

  const opportunities = (oppRes.data as Record<string, unknown>[]) ?? [];
  const proposals = (propRes.data as Record<string, unknown>[]) ?? [];
  const quotes = (quoteRes.data as Record<string, unknown>[]) ?? [];
  const projects = (projectRes.data as Record<string, unknown>[]) ?? [];
  const vendors = (vendorRes.data as Record<string, unknown>[]) ?? [];

  const oppIds = opportunities.map((o) => String(o.id)).filter(Boolean);
  let requirements: Record<string, unknown>[] = [];
  if (oppIds.length) {
    const { data: reqRoots } = await db
      .from("enterprise_requirements")
      .select("id, opportunity_id, readiness_status")
      .in("opportunity_id", oppIds)
      .limit(80);
    const reqIds = (reqRoots ?? []).map((r) => String(r.id)).filter(Boolean);
    if (reqIds.length) {
      const { data } = await db
        .from("enterprise_requirement_versions")
        .select("*")
        .in("requirement_id", reqIds)
        .order("version_no", { ascending: false })
        .limit(80);
      const rootById = new Map(
        (reqRoots ?? []).map((r) => [String(r.id), r] as const)
      );
      requirements = ((data as Record<string, unknown>[]) ?? []).map((v) => {
        const root = rootById.get(String(v.requirement_id));
        return {
          ...v,
          opportunity_id: root?.opportunity_id,
          status: v.approval_status ?? root?.readiness_status,
          version_number: v.version_no,
        };
      });
    }
  }

  const projectIds = projects.map((p) => String(p.id)).filter(Boolean);
  let components: Record<string, unknown>[] = [];
  let vendorAssignments: Record<string, unknown>[] = [];
  if (projectIds.length) {
    const [compRes, vaRes] = await Promise.all([
      db
        .from("enterprise_project_components")
        .select("*")
        .in("project_id", projectIds)
        .limit(120),
      db
        .from("enterprise_vendor_assignments")
        .select("*")
        .in("project_id", projectIds)
        .limit(80),
    ]);
    components = ((compRes.data as Record<string, unknown>[]) ?? []).map((c) => ({
      ...c,
      name: c.label ?? c.component_key,
      amount_minor: c.commercial_amount_minor,
    }));
    vendorAssignments = (vaRes.data as Record<string, unknown>[]) ?? [];
  }

  return {
    report,
    opportunities,
    requirements,
    proposals,
    quotes,
    projects,
    components,
    vendors,
    vendorAssignments,
  };
}
