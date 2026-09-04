import Link from "next/link";
import { PartnerPageHeader, PartnerActionCenter, PartnerStatusStrip } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { ENTERPRISE_EXPERT_ROLE_LABEL, EXPERT_NO_COMMISSION_COPY, FINANCE_COSIGN_COPY } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";

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
      <div className="mx-auto max-w-3xl">
        <PartnerPageHeader title={ENTERPRISE_EXPERT_ROLE_LABEL} description={EXPERT_NO_COMMISSION_COPY} />
        <EmptyState title="Expert dashboard unavailable" description="Assignment-scoped reads require an active Enterprise Platform Expert role." />
      </div>
    );
  }
  const actions = [
    ...(report.draftProposals > 0 ? [{ id: "drafts", title: "Draft proposals", description: `${report.draftProposals} draft(s)`, href: "/enterprise-expert/proposals", severity: "info" as const }] : []),
    ...(report.quotesPendingFinanceCosign > 0 ? [{ id: "cosign", title: "Quotes pending Finance co-sign", description: `${report.quotesPendingFinanceCosign} quote(s) — status visibility only`, href: "/enterprise-expert/proposals", severity: "warning" as const }] : []),
  ];
  return (
    <div className="space-y-8">
      <PartnerPageHeader title={ENTERPRISE_EXPERT_ROLE_LABEL} description={EXPERT_NO_COMMISSION_COPY} actions={<Button asChild variant="outline" className="min-h-11"><Link href="/enterprise-expert/queue">Open queue</Link></Button>} />
      <PartnerStatusStrip items={[
        { id: "role", label: "Role", value: "Platform Expert", tone: "info" },
        { id: "commission", label: "Commission", value: "None automatic", tone: "neutral" },
        { id: "finance", label: "Finance authority", value: "Status only", tone: "warning" },
        { id: "opps", label: "Assigned opportunities", value: String(report.assignedOpportunities) },
        { id: "drafts", label: "Draft proposals", value: String(report.draftProposals) },
      ]} />
      <PartnerActionCenter items={actions} />
      <p className="text-xs text-muted-foreground">{FINANCE_COSIGN_COPY}. Expert does not approve Finance co-sign.</p>
    </div>
  );
}
