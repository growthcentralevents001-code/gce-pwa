import Link from "next/link";
import { PartnerPageHeader, KpiCard, PartnerActionCenter, PartnerStatusStrip } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { ENTERPRISE_EXPERT_ROLE_LABEL, EXPERT_NO_COMMISSION_COPY, FINANCE_COSIGN_COPY } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Enterprise Platform Expert · GCE" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseExpertBundle(admin, user.id).catch(() => null);
  const report = bundle?.report;
  if (!report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader title={ENTERPRISE_EXPERT_ROLE_LABEL} description={EXPERT_NO_COMMISSION_COPY} />
        <EmptyState title="Expert dashboard unavailable" description="Assignment-scoped reads require an active Enterprise Platform Expert role." />
      </main>
    );
  }
  const actions = [
    ...(report.draftProposals > 0 ? [{ id: "drafts", title: "Draft proposals", description: `${report.draftProposals} draft(s)`, href: "/enterprise-expert/proposals", severity: "info" as const }] : []),
    ...(report.quotesPendingFinanceCosign > 0 ? [{ id: "cosign", title: "Quotes pending Finance co-sign", description: `${report.quotesPendingFinanceCosign} quote(s) — status visibility only`, href: "/enterprise-expert/proposals", severity: "warning" as const }] : []),
  ];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title={ENTERPRISE_EXPERT_ROLE_LABEL} description={EXPERT_NO_COMMISSION_COPY} actions={<Button asChild variant="outline" className="min-h-11"><Link href="/enterprise-expert/queue">Open queue</Link></Button>} />
      <PartnerStatusStrip items={[
        { id: "role", label: "Role", value: "Platform Expert", tone: "info" },
        { id: "commission", label: "Commission", value: "None automatic", tone: "neutral" },
        { id: "finance", label: "Finance authority", value: "Status only", tone: "warning" },
      ]} />
      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard label="Assigned opportunities" value={String(report.assignedOpportunities)} icon="target" />
        <KpiCard label="Draft proposals" value={String(report.draftProposals)} icon="briefcase" />
        <KpiCard label="Pending Finance co-sign" value={String(report.quotesPendingFinanceCosign)} icon="file-check" hint={FINANCE_COSIGN_COPY} />
      </div>
      <PartnerActionCenter items={actions} />
      <p className="text-xs text-muted-foreground">{FINANCE_COSIGN_COPY}. Expert does not approve Finance co-sign.</p>
    </main>
  );
}
