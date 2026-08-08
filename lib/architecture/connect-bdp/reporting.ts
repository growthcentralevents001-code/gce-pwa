import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
} from "./constants";

export type ConnectBdpDashboardReport = {
  unitId: string;
  applicationStatus: string;
  packageOption: string;
  remainingRecoverableMinor: number;
  recoveredToDateMinor: number;
  creditedCircles: number;
  activeCirclePortfolio: number;
  targetCircles: number;
  targetMonths: number;
  monthsElapsed: number | null;
  targetAchievedAt: string | null;
  maintenanceStatus: string;
  openDisputes: number;
  attributedMemberships: number;
  grossEligibleCommissionMinor: number;
  recoveryDeductionsMinor: number;
  netPayableCommissionMinor: number;
};

export async function buildConnectBdpDashboard(
  client: SupabaseClient,
  unitId: string
): Promise<ConnectBdpDashboardReport | null> {
  const { data: unit } = await client
    .from("connect_bdp_units")
    .select("*")
    .eq("id", unitId)
    .maybeSingle();
  if (!unit) return null;

  const start = unit.target_start_at
    ? new Date(unit.target_start_at)
    : unit.activated_at
      ? new Date(unit.activated_at)
      : null;
  const monthsElapsed = start
    ? Math.max(
        0,
        Math.floor(
          (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
        )
      )
    : null;

  const [
    { count: openDisputes },
    { count: attributions },
    { data: ents },
    { data: recoveryRows },
  ] = await Promise.all([
    client
      .from("connect_bdp_disputes")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", unitId)
      .in("status", ["open", "bdp_first_level", "escalated_prm", "under_review"]),
    client
      .from("connect_bdp_member_attributions")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", unitId)
      .eq("status", "active"),
    client
      .from("connect_bdp_commission_entitlements")
      .select("gross_commission_minor")
      .eq("unit_id", unitId),
    client
      .from("connect_bdp_recovery_entries")
      .select("recovered_minor")
      .eq("unit_id", unitId),
  ]);

  const entitlements = ents ?? [];
  const gross = entitlements.reduce(
    (s, e) => s + Number(e.gross_commission_minor ?? 0),
    0
  );
  const recovery = (recoveryRows ?? []).reduce(
    (s, e) => s + Number(e.recovered_minor ?? 0),
    0
  );
  const net = Math.max(0, gross - recovery);
  const maintenanceCompliant = unit.maintenance_compliant !== false;
  const maintenanceStatus =
    unit.target_achieved_at == null
      ? "not_applicable"
      : maintenanceCompliant
        ? "compliant"
        : "review_required";

  return {
    unitId: String(unit.id),
    applicationStatus: String(unit.application_status),
    packageOption: String(unit.package_option),
    remainingRecoverableMinor: Number(unit.remaining_recoverable_minor ?? 0),
    recoveredToDateMinor: Number(unit.recovered_to_date_minor ?? 0),
    creditedCircles: Number(unit.credited_circles_count ?? 0),
    activeCirclePortfolio: Number(unit.active_portfolio_count ?? 0),
    targetCircles: Number(unit.target_circles ?? CONNECT_BDP_TARGET_CIRCLES),
    targetMonths: Number(unit.target_window_months ?? CONNECT_BDP_TARGET_MONTHS),
    monthsElapsed,
    targetAchievedAt: unit.target_achieved_at
      ? String(unit.target_achieved_at)
      : null,
    maintenanceStatus,
    openDisputes: openDisputes ?? 0,
    attributedMemberships: attributions ?? 0,
    grossEligibleCommissionMinor: gross,
    recoveryDeductionsMinor: recovery,
    netPayableCommissionMinor: net,
  };
}
