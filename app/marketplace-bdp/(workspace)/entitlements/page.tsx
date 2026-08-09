import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import {
  ATTRIBUTED_SPLIT_COPY,
  UNATTRIBUTED_SPLIT_COPY,
  formatMinorInr,
} from "@/lib/frontend/marketplace/format";

export const metadata = { robots: { index: false, follow: false }, title: "Entitlements · Marketplace BDP" };

export default async function MbdpEntitlementsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace-bdp/entitlements");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);
  if (!bundle.unit || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Entitlements" />
        <EmptyState title="No unit" primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }} />
      </main>
    );
  }
  const report = bundle.report;
  const rows = bundle.entitlements.map((e) => ({
    id: String(e.id),
    state: String(e.state ?? ""),
    mbdp: Number(e.mbdp_share_minor ?? 0),
    venue: Number(e.venue_share_minor ?? 0),
    gce: Number(e.gce_share_minor ?? 0),
    attributed: Boolean(e.has_valid_attribution),
    key: String(e.earning_event_key ?? "—"),
  }));

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Entitlements"
        description="Amounts from backend entitlements. Frontend does not calculate 80/10/10 or 80/0/20 splits."
        backHref="/dashboard/marketplace-bdp"
      />
      <PartnerCommercialSummary
        rows={[
          { id: "gross", label: "Gross MBDP entitlement", amountMinor: report.grossMbdpEntitlementMinor, hint: ATTRIBUTED_SPLIT_COPY },
          { id: "recovery", label: "Recovery deductions", amountMinor: report.recoveryDeductionsMinor },
          { id: "net", label: "Payable position (display)", amountMinor: report.netMbdpPayableMinor, emphasize: true },
        ]}
        footerNote={UNATTRIBUTED_SPLIT_COPY}
      />
      <PartnerDataTable
        rows={rows}
        mobileTitle={(r) => r.key}
        columns={[
          { id: "key", header: "Earning event", cell: (r) => r.key },
          { id: "state", header: "State", cell: (r) => <StatusBadge label={r.state.replace(/_/g, " ")} /> },
          { id: "attr", header: "Attribution", cell: (r) => (r.attributed ? "Attributed" : "Unattributed (MBDP 0%)") },
          { id: "mbdp", header: "MBDP share", cell: (r) => formatMinorInr(r.mbdp) },
        ]}
        empty={<EmptyState title="No entitlements yet" />}
      />
      <FeatureGated mode="disabled_in_environment" title="Settlement & payout" description="Marketplace BDP may view entitlements. Settlement/payout remain Finance Ops." />
    </main>
  );
}
