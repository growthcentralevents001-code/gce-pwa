import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getApprovalQueue,
  getExceptionQueue,
  getOpsDashboard,
  listCases,
  searchOpsEntities,
  type OpsVertical,
} from "@/lib/architecture/ops-admin";

/** Soft-load ops dashboard cards — never invent metrics on failure. */
export async function loadOpsDashboardCards(
  client: SupabaseClient,
  vertical?: OpsVertical | null
) {
  try {
    return (await getOpsDashboard(client, { vertical: vertical ?? null })).cards;
  } catch {
    return null;
  }
}

export async function loadApprovals(
  client: SupabaseClient,
  vertical?: OpsVertical | null
) {
  try {
    return await getApprovalQueue(client, { vertical: vertical ?? null });
  } catch {
    return [];
  }
}

export async function loadExceptions(
  client: SupabaseClient,
  vertical?: OpsVertical | null
) {
  try {
    return await getExceptionQueue(client, { vertical: vertical ?? null });
  } catch {
    return [];
  }
}

export async function loadCases(
  client: SupabaseClient,
  filters?: { vertical?: OpsVertical | null; status?: string | null }
) {
  try {
    return await listCases(client, filters);
  } catch {
    return [];
  }
}

export async function loadOpsSearch(client: SupabaseClient, q: string) {
  try {
    return await searchOpsEntities(client, q);
  } catch {
    return { cases: [], approvals: [], exceptions: [] };
  }
}

export async function loadComplianceHolds(
  client: SupabaseClient,
  options?: { status?: string | null; limit?: number }
) {
  try {
    let q = client
      .from("compliance_holds")
      .select(
        "id, subject_type, subject_id, reason, status, scope, release_conditions, started_at, released_at, created_at, created_by, released_by"
      )
      .order("created_at", { ascending: false })
      .limit(options?.limit ?? 50);
    if (options?.status) q = q.eq("status", options.status);
    const { data } = await q;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function loadModerationActions(
  client: SupabaseClient,
  limit = 40
) {
  try {
    const { data } = await client
      .from("ops_moderation_actions")
      .select(
        "id, subject_type, subject_id, action, reason, actor_user_id, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function loadIncidents(client: SupabaseClient, limit = 50) {
  try {
    const { data } = await client
      .from("incident_signals")
      .select("*")
      .in("status", ["candidate", "acknowledged", "investigating"])
      .order("last_seen_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function loadRiskSignals(client: SupabaseClient, limit = 30) {
  try {
    const { data } = await client
      .from("risk_signals")
      .select(
        "id, signal_type, category, review_status, recommendation, auto_action_applied, created_at"
      )
      .eq("review_status", "open")
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}
