import { PartnerPageHeader, PartnerCommercialSummary, PartnerDataTable } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { RECOVERY_FORMULA_HINT, formatMinorInr, recoveryBreakdownRows, stakeholderTypeLabel } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Recovery · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/recovery");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.recoveries ?? []).map((e) => ({
    id: String(e.id),
    stakeholder_type: e.stakeholder_type,
    gross_entitlement_minor: e.gross_entitlement_minor,
    recovery_deduction_minor: e.recovery_deduction_minor,
    reversal_amount_minor: e.reversal_amount_minor,
    net_settlement_eligible_minor: e.net_settlement_eligible_minor,
  }));
  const first = rows[0];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Recoveries" description={`${RECOVERY_FORMULA_HINT} Recovery never mutates gross commission source.`} />
      {first ? (
        <PartnerCommercialSummary title="Recovery presentation" rows={recoveryBreakdownRows({
          grossEntitlementMinor: Number(first.gross_entitlement_minor ?? 0),
          recoveryDeductionMinor: Number(first.recovery_deduction_minor ?? 0),
          reversalAmountMinor: Number(first.reversal_amount_minor ?? 0),
          netSettlementEligibleMinor: Number(first.net_settlement_eligible_minor ?? 0),
        })} />
      ) : null}
      {rows.length === 0 ? <EmptyState title="No recovery deductions yet" /> : (
        <PartnerDataTable
          columns={[
            { id: "stakeholder", header: "Stakeholder", cell: (r) => stakeholderTypeLabel(String(r.stakeholder_type ?? "")) },
            { id: "gross", header: "Gross", cell: (r) => formatMinorInr(Number(r.gross_entitlement_minor ?? 0)) },
            { id: "recovery", header: "Recovery", cell: (r) => formatMinorInr(Number(r.recovery_deduction_minor ?? 0)) },
            { id: "net", header: "Net", cell: (r) => formatMinorInr(Number(r.net_settlement_eligible_minor ?? 0)) },
          ]}
          rows={rows}
          mobileTitle={(r) => stakeholderTypeLabel(String(r.stakeholder_type ?? ""))}
        />
      )}
    </main>
  );
}
