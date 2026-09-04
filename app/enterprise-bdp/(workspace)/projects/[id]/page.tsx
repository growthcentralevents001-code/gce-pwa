import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseBdpProjectDetail } from "@/lib/frontend/enterprise/reads";
import {
  EBDP_ENTITLEMENT_COPY,
  formatMinorInr,
  milestoneStatusLabel,
  projectStatusLabel,
} from "@/lib/frontend/enterprise/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Project · Enterprise BDP",
};

export default async function EnterpriseBdpProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/enterprise-bdp/projects/${id}`);

  const detail = await loadEnterpriseBdpProjectDetail(
    supabase,
    createPrivilegedSupabaseClient(),
    user.id,
    id
  );
  if (!detail) notFound();

  const { project, milestones, quotes, entitlements } = detail;

  return (
    <main className={`mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={String(project.title ?? "Attributed project")}
        description="Read-only project status for your attributed Enterprise work."
        backHref="/enterprise-bdp/pipeline"
        backLabel="Pipeline"
        actions={
          <StatusBadge
            label={projectStatusLabel(String(project.status ?? ""))}
            tone="neutral"
          />
        }
      />

      <section className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          Ref {String(project.project_ref ?? project.id).slice(0, 12)} · Commercial total{" "}
          {formatMinorInr(Number(project.commercial_total_minor ?? 0))}
        </p>
        <p className="text-xs text-muted-foreground">{EBDP_ENTITLEMENT_COPY}</p>
      </section>

      {quotes.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">Quotation status</h2>
          <PartnerDataTable
            columns={[
              { id: "ref", header: "Quote", cell: (r) => String(r.quote_ref ?? r.id).slice(0, 10) },
              { id: "status", header: "Status", cell: (r) => String(r.status ?? "").replace(/_/g, " ") },
              {
                id: "total",
                header: "Proposed",
                cell: (r) => formatMinorInr(Number(r.total_proposed_minor ?? 0)),
                hideOnMobile: true,
              },
            ]}
            rows={quotes.map((q) => ({
              id: String(q.id),
              quote_ref: q.quote_ref,
              status: q.status,
              total_proposed_minor: q.total_proposed_minor,
            }))}
            mobileTitle={(r) => String(r.quote_ref ?? r.id)}
          />
        </section>
      ) : null}

      {milestones.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">Milestones</h2>
          <PartnerDataTable
            columns={[
              { id: "name", header: "Milestone", cell: (r) => String(r.name ?? "") },
              {
                id: "status",
                header: "Status",
                cell: (r) => milestoneStatusLabel(String(r.status ?? "")),
              },
            ]}
            rows={milestones.map((m) => ({
              id: String(m.id),
              name: m.name,
              status: m.status,
            }))}
            mobileTitle={(r) => String(r.name ?? r.id)}
          />
        </section>
      ) : null}

      {entitlements.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold">Eligible earning records</h2>
          <PartnerDataTable
            columns={[
              {
                id: "platform",
                header: "Platform commission",
                cell: (r) => formatMinorInr(Number(r.platform_commission_minor ?? 0)),
              },
              {
                id: "ebdp",
                header: "EBDP entitlement",
                cell: (r) => formatMinorInr(Number(r.ebdp_entitlement_minor ?? 0)),
              },
              { id: "state", header: "State", cell: (r) => String(r.state ?? "") },
            ]}
            rows={entitlements.map((e) => ({
              id: String(e.id),
              platform_commission_minor: e.platform_commission_minor,
              ebdp_entitlement_minor: e.ebdp_entitlement_minor,
              state: e.state,
            }))}
            mobileTitle={(r) => String(r.state ?? r.id)}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Calculated entitlement is not payout proof. Settlement execution remains gated.
          </p>
        </section>
      ) : (
        <p className="text-sm text-muted-foreground">
          No eligible earning records yet — entitlement requires governed platform commission recognition on eligible project components.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Need execution changes? Contact your Platform Expert or Ops — Enterprise BDP does not manage project execution here.
      </p>
      <Link href="/enterprise-bdp/entitlements" className="text-sm text-primary hover:underline">
        View all entitlements →
      </Link>
    </main>
  );
}
