import { PartnerPageHeader, PartnerDataTable, PartnerCommercialSummary } from "@/components/partner";
import { EntitlementSummaryCard } from "@/components/finance/FinanceCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { GROSS_IMMUTABLE_COPY, entitlementStatusLabel, formatMinorInr, stakeholderTypeLabel, recoveryBreakdownRows } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Entitlements · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/entitlements");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.entitlements ?? []).map((e) => ({
    id: String(e.id),
    stakeholder_type: e.stakeholder_type,
    status: e.status,
    revenue_component_key: e.revenue_component_key,
    gross_entitlement_minor: e.gross_entitlement_minor,
    recovery_deduction_minor: e.recovery_deduction_minor,
    reversal_amount_minor: e.reversal_amount_minor,
    net_settlement_eligible_minor: e.net_settlement_eligible_minor,
  }));
  const sample = rows[0];
  const reversals = bundle?.reversals ?? [];
  const corrections = bundle?.corrections ?? [];
  const ledger = bundle?.ledgerEntries ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Stakeholder entitlements" description={`${GROSS_IMMUTABLE_COPY} Backend-calculated only — no client commission math.`} />
      {sample ? (
        <PartnerCommercialSummary
          title="Sample recovery breakdown (first row)"
          rows={recoveryBreakdownRows({
            grossEntitlementMinor: Number(sample.gross_entitlement_minor ?? 0),
            recoveryDeductionMinor: Number(sample.recovery_deduction_minor ?? 0),
            reversalAmountMinor: Number(sample.reversal_amount_minor ?? 0),
            netSettlementEligibleMinor: Number(sample.net_settlement_eligible_minor ?? 0),
          })}
        />
      ) : null}
      {rows.length === 0 ? <EmptyState title="No entitlements" /> : (
        <>
          <div className="grid gap-3 lg:hidden">{rows.slice(0, 12).map((r) => (
            <EntitlementSummaryCard key={r.id} stakeholderType={String(r.stakeholder_type ?? "")} status={String(r.status ?? "")} grossEntitlementMinor={Number(r.gross_entitlement_minor ?? 0)} recoveryDeductionMinor={Number(r.recovery_deduction_minor ?? 0)} reversalAmountMinor={Number(r.reversal_amount_minor ?? 0)} netSettlementEligibleMinor={Number(r.net_settlement_eligible_minor ?? 0)} revenueComponentKey={typeof r.revenue_component_key === "string" ? r.revenue_component_key : undefined} />
          ))}</div>
          <div className="hidden lg:block">
            <PartnerDataTable
              columns={[
                { id: "stakeholder", header: "Stakeholder", cell: (r) => stakeholderTypeLabel(String(r.stakeholder_type ?? "")) },
                { id: "component", header: "Revenue component", cell: (r) => String(r.revenue_component_key ?? "—") },
                { id: "status", header: "Status", cell: (r) => entitlementStatusLabel(String(r.status ?? "")) },
                { id: "gross", header: "Gross", cell: (r) => formatMinorInr(Number(r.gross_entitlement_minor ?? 0)) },
                { id: "net", header: "Net eligible", cell: (r) => formatMinorInr(Number(r.net_settlement_eligible_minor ?? 0)) },
              ]}
              rows={rows}
              mobileTitle={(r) => stakeholderTypeLabel(String(r.stakeholder_type ?? ""))}
            />
          </div>
        </>
      )}
      <section>
        <h2 className="mb-2 text-base font-semibold">Adjustments / reversals / corrections</h2>
        <p className="mb-3 text-xs text-muted-foreground">Original gross is not overwritten. Reversal and correction rows are separate.</p>
        {(reversals.length + corrections.length) === 0 ? <p className="text-sm text-muted-foreground">No reversals or corrections yet.</p> : (
          <ul className="space-y-2 text-sm">
            {reversals.slice(0, 10).map((r) => (
              <li key={String(r.id)}>Reversal · {formatMinorInr(Number(r.amount_minor ?? 0))} · {String(r.reason ?? "").slice(0, 80)}</li>
            ))}
            {corrections.slice(0, 10).map((c) => (
              <li key={String(c.id)}>Correction · {formatMinorInr(Number(c.amount_minor ?? 0))} · {String(c.reason ?? "").slice(0, 80)}</li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="mb-2 text-base font-semibold">Ledger (read-only)</h2>
        <p className="mb-3 text-xs text-muted-foreground">No editable cells. No save ledger. Imbalance is reported as exception — not repaired in UI.</p>
        {ledger.length === 0 ? <p className="text-sm text-muted-foreground">No ledger entries loaded.</p> : (
            <PartnerDataTable
              columns={[
                { id: "id", header: "Entry", cell: (r) => String(r.id).slice(0, 8) },
                { id: "side", header: "Side", cell: (r) => String(r.direction ?? "—") },
                { id: "amt", header: "Amount", cell: (r) => formatMinorInr(Number(r.amount_minor ?? 0)) },
                { id: "acct", header: "Account", cell: (r) => String(r.ledger_account_id ?? "—").slice(0, 8), hideOnMobile: true },
              ]}
              rows={ledger.slice(0, 40).map((l) => ({
                id: String(l.id),
                direction: l.direction,
                amount_minor: l.amount_minor,
                ledger_account_id: l.ledger_account_id,
              }))}
              mobileTitle={(r) => `Ledger ${String(r.id).slice(0, 8)}`}
            />
        )}
      </section>
    </main>
  );
}
