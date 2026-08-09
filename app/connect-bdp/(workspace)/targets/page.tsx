import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { TargetProgressCard } from "@/components/partner/TargetProgressCard";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import {
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
  maintenanceStatusLabel,
  targetProgressLabel,
} from "@/lib/frontend/partner/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Targets · Connect BDP",
};

/** CBDP-07 — Targets / maintenance */
export default async function ConnectBdpTargetsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/targets");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Targets" />
        <EmptyState
          title="No unit"
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const report = bundle.report;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Targets & maintenance"
        description={`Canonical development target: ${CONNECT_BDP_TARGET_CIRCLES} Circles in ${CONNECT_BDP_TARGET_MONTHS} months. Values below come from the unit report.`}
        backHref="/dashboard/connect-bdp"
      />

      <TargetProgressCard
        credited={report.creditedCircles}
        target={report.targetCircles}
        monthsElapsed={report.monthsElapsed}
        targetMonths={report.targetMonths}
        achievedAt={report.targetAchievedAt}
      />

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <h2 className="text-base font-semibold">Maintenance</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <StatusBadge
            label={maintenanceStatusLabel(report.maintenanceStatus)}
            tone={
              report.maintenanceStatus === "review_required"
                ? "warning"
                : report.maintenanceStatus === "compliant"
                  ? "success"
                  : "neutral"
            }
          />
          <p className="text-sm text-muted-foreground">
            Progress {targetProgressLabel(report.creditedCircles, report.targetCircles)}{" "}
            · Active portfolio {report.activeCirclePortfolio}
          </p>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Maintenance requirement follows backend unit state (maintain credited /
          active Circles per operating duties). Grace/stability windows remain
          unresolved policy (OD-021) — not invented here.
        </p>
      </section>

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.muted} p-5`}>
        <h2 className="text-sm font-semibold">Target credit rule</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>
            One Circle receives one target credit at formal activation (15 approved
            + paid members).
          </li>
          <li>No additional credit at 20 or 40 members.</li>
          <li>Stale 10-Circle targets are not used.</li>
        </ul>
      </section>
    </main>
  );
}
