import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildConnectBdpDashboard,
  listConnectBdpUnitsForUser,
  type ConnectBdpDashboardReport,
} from "@/lib/architecture/connect-bdp";

export type ConnectBdpUnitRow = Record<string, unknown> & {
  id: string;
  application_status?: string;
  package_option?: string;
  circles_capacity_max?: number;
  credited_circles_count?: number;
  active_portfolio_count?: number;
  remaining_recoverable_minor?: number;
  recovered_to_date_minor?: number;
  target_circles?: number;
  target_window_months?: number;
  maintenance_compliant?: boolean | null;
  target_achieved_at?: string | null;
  activated_at?: string | null;
  created_at?: string | null;
};

export type ConnectBdpBundle = {
  units: ConnectBdpUnitRow[];
  unit: ConnectBdpUnitRow | null;
  report: ConnectBdpDashboardReport | null;
  cityAssignment: Record<string, unknown> | null;
  cityConfig: Record<string, unknown> | null;
  circleAssignments: Record<string, unknown>[];
  attributions: Record<string, unknown>[];
  disputes: Record<string, unknown>[];
  handovers: Record<string, unknown>[];
  entitlements: Record<string, unknown>[];
  recoveryEntries: Record<string, unknown>[];
};

/**
 * Load Connect BDP read models for the signed-in partner.
 * Prefer user-scoped unit list; related tables via privileged client when RLS blocks.
 */
export async function loadConnectBdpBundle(
  userClient: SupabaseClient,
  adminClient: SupabaseClient,
  userId: string,
  preferredUnitId?: string | null
): Promise<ConnectBdpBundle> {
  const units = (await listConnectBdpUnitsForUser(
    userClient,
    userId
  )) as ConnectBdpUnitRow[];

  const unit =
    (preferredUnitId
      ? units.find((u) => u.id === preferredUnitId)
      : undefined) ??
    units.find((u) => u.application_status === "active") ??
    units[0] ??
    null;

  if (!unit) {
    return {
      units,
      unit: null,
      report: null,
      cityAssignment: null,
      cityConfig: null,
      circleAssignments: [],
      attributions: [],
      disputes: [],
      handovers: [],
      entitlements: [],
      recoveryEntries: [],
    };
  }

  const unitId = unit.id;
  const client = adminClient;

  const [
    report,
    { data: cityRows },
    { data: circleRows },
    { data: attrRows },
    { data: disputeRows },
    { data: handoverRows },
    { data: entitlementRows },
    { data: recoveryRows },
  ] = await Promise.all([
    buildConnectBdpDashboard(client, unitId),
    client
      .from("connect_bdp_city_assignments")
      .select("*, connect_bdp_city_configs(*)")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(5),
    client
      .from("connect_bdp_circle_assignments")
      .select("*, connect_circles(*)")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(40),
    client
      .from("connect_bdp_member_attributions")
      .select("*")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("connect_bdp_disputes")
      .select("*")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(50),
    client
      .from("connect_bdp_handovers")
      .select("*")
      .or(`from_unit_id.eq.${unitId},to_unit_id.eq.${unitId}`)
      .order("created_at", { ascending: false })
      .limit(20),
    client
      .from("connect_bdp_commission_entitlements")
      .select("*")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(50),
    client
      .from("connect_bdp_recovery_entries")
      .select("*")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const cityAssignment = (cityRows?.[0] as Record<string, unknown>) ?? null;
  const cityCfgRaw = cityAssignment?.connect_bdp_city_configs;
  const cityConfig = Array.isArray(cityCfgRaw)
    ? ((cityCfgRaw[0] as Record<string, unknown>) ?? null)
    : ((cityCfgRaw as Record<string, unknown> | null) ?? null);

  return {
    units,
    unit,
    report,
    cityAssignment,
    cityConfig,
    circleAssignments: (circleRows as Record<string, unknown>[]) ?? [],
    attributions: (attrRows as Record<string, unknown>[]) ?? [],
    disputes: (disputeRows as Record<string, unknown>[]) ?? [],
    handovers: (handoverRows as Record<string, unknown>[]) ?? [],
    entitlements: (entitlementRows as Record<string, unknown>[]) ?? [],
    recoveryEntries: (recoveryRows as Record<string, unknown>[]) ?? [],
  };
}
