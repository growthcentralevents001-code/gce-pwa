import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import {
  formatCommissionRateLabel,
  formatMinorInr,
} from "@/lib/frontend/partner/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Entitlements · Connect BDP",
};

/** CBDP-08 — Commission / recovery entitlements (read-only finance display) */
export default async function ConnectBdpEntitlementsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/entitlements");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Entitlements" />
        <EmptyState
          title="No unit"
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const report = bundle.report;
  const rows = bundle.entitlements.map((e) => ({
    id: String(e.id),
    state: String(e.state ?? ""),
    gross: Number(e.gross_commission_minor ?? 0),
    bps: Number(e.commission_bps ?? 2000),
    key: String(e.earning_event_key ?? "—"),
    createdAt: e.created_at ? String(e.created_at) : null,
  }));

  const recoveryRows = bundle.recoveryEntries.map((r) => ({
    id: String(r.id),
    recovered: Number(r.recovered_minor ?? 0),
    cycle: String(r.cycle_key ?? "—"),
    createdAt: r.created_at ? String(r.created_at) : null,
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Entitlements"
        description={`Canonical Connect BDP commission rate: ${formatCommissionRateLabel()} of attributed eligible Connect subscription revenue. Display only — no settlement or payout.`}
        backHref="/dashboard/connect-bdp"
      />

      <PartnerCommercialSummary
        rows={[
          {
            id: "gross",
            label: "Gross commission",
            amountMinor: report.grossEligibleCommissionMinor,
            hint: "Not net payable",
          },
          {
            id: "recovery",
            label: "Recovery deductions",
            amountMinor: report.recoveryDeductionsMinor,
          },
          {
            id: "net",
            label: "Payable / settlement position",
            amountMinor: report.netPayableCommissionMinor,
            emphasize: true,
            hint: "Finance Ops executes settlement (Batch 7)",
          },
          {
            id: "remaining",
            label: "Remaining recoverable balance",
            amountMinor: report.remainingRecoverableMinor,
          },
        ]}
        footerNote="Do not equate gross commission with net payable. Recovery is applied by finance services."
      />

      <section>
        <h2 className="mb-3 text-base font-semibold">Commission entitlements</h2>
        <PartnerDataTable
          rows={rows}
          mobileTitle={(r) => r.key}
          columns={[
            {
              id: "key",
              header: "Earning event",
              cell: (r) => r.key,
            },
            {
              id: "state",
              header: "State",
              cell: (r) => (
                <StatusBadge label={r.state.replace(/_/g, " ")} tone="pending" />
              ),
            },
            {
              id: "bps",
              header: "Rate",
              cell: (r) => formatCommissionRateLabel(r.bps),
            },
            {
              id: "gross",
              header: "Gross",
              cell: (r) => formatMinorInr(r.gross),
            },
          ]}
          empty={
            <EmptyState title="No entitlements recorded yet" />
          }
        />
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold">Recovery entries</h2>
        <PartnerDataTable
          rows={recoveryRows}
          mobileTitle={(r) => r.cycle}
          columns={[
            {
              id: "cycle",
              header: "Cycle",
              cell: (r) => r.cycle,
            },
            {
              id: "recovered",
              header: "Recovered",
              cell: (r) => formatMinorInr(r.recovered),
            },
            {
              id: "created",
              header: "Recorded",
              cell: (r) =>
                r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-IN")
                  : "—",
            },
          ]}
          empty={<EmptyState title="No recovery entries" />}
        />
      </section>

      <FeatureGated
        mode="disabled_in_environment"
        title="Settlement & payout"
        description="Connect BDP may view entitlement summaries. Settlement, payout, ledger mutation, and tax calculation remain Finance Ops."
      />
    </main>
  );
}
