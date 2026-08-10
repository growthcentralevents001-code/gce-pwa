import { PartnerPageHeader, PartnerCommercialSummary, PartnerDataTable } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseBdpBundle } from "@/lib/frontend/enterprise/reads";
import { EBDP_ENTITLEMENT_COPY, formatMinorInr } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Entitlements · Enterprise BDP" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-bdp/entitlements");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseBdpBundle(supabase, admin, user.id).catch(() => null);
  const ents = (bundle?.entitlements ?? []).map((e) => ({
    id: String(e.id),
    revenue_component_key: e.revenue_component_key,
    ebdp_entitlement_minor: e.ebdp_entitlement_minor,
    state: e.state,
  }));
  const gross = bundle?.report?.grossEligibleCommissionMinor ?? 0;
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Entitlements" description={EBDP_ENTITLEMENT_COPY} />
      <PartnerCommercialSummary
        rows={[
          { id: "gross", label: "Gross EBDP entitlement", amountMinor: gross, emphasize: true },
          { id: "rows", label: "Entitlement rows", value: String(ents.length) },
          { id: "payout", label: "Payout", value: "Not executed in this workspace" },
        ]}
        footerNote="Settlement and payout belong to Finance (Batch 7). Do not treat project value × 25% as entitlement."
      />
      {ents.length === 0 ? (
        <EmptyState title="No entitlement rows yet" />
      ) : (
        <PartnerDataTable
          columns={[
            { id: "key", header: "Revenue component", cell: (r) => String(r.revenue_component_key ?? "—") },
            { id: "amt", header: "EBDP entitlement", cell: (r) => formatMinorInr(Number(r.ebdp_entitlement_minor ?? 0)) },
            { id: "state", header: "State", cell: (r) => String(r.state ?? "—").replace(/_/g, " ") },
          ]}
          rows={ents}
          mobileTitle={(r) => String(r.revenue_component_key ?? "Entitlement")}
        />
      )}
    </main>
  );
}
