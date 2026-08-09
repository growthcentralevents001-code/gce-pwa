import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerPipelineList } from "@/components/partner/PartnerPipelineList";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { AttributionProposeForm } from "@/components/partner/AttributionProposeForm";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import { attributionStatusLabel } from "@/lib/frontend/partner/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Members · Connect BDP",
};

/** CBDP-05 — Member sourcing / attribution portfolio */
export default async function ConnectBdpMembersPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/members");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Members" />
        <EmptyState
          title="No unit"
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const rows = bundle.attributions.map((a) => ({
    id: String(a.id),
    membershipId: String(a.membership_id ?? "—"),
    status: String(a.status ?? ""),
    provenance: a.provenance ? String(a.provenance) : "—",
    createdAt: a.created_at ? String(a.created_at) : null,
  }));

  const stages = [
    {
      id: "proposed",
      label: "Proposed",
      count: rows.filter((r) => r.status === "proposed").length,
      description: "Awaiting Platform confirmation.",
    },
    {
      id: "pending_evidence",
      label: "Pending evidence",
      count: rows.filter((r) => r.status === "pending_evidence").length,
    },
    {
      id: "active",
      label: "Attributed",
      count: rows.filter((r) => r.status === "active").length,
    },
    {
      id: "unattributed",
      label: "Organic / unattributed",
      count: rows.filter((r) => r.status === "unattributed").length,
      description: attributionStatusLabel("unattributed"),
    },
    {
      id: "disputed",
      label: "Disputed / other",
      count: rows.filter((r) =>
        ["disputed", "suspended", "reassigned_closed", "voided"].includes(
          r.status
        )
      ).length,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Member sourcing & attribution"
        description="Propose attribution only. Platform confirms. Organic membership without Connect BDP attribution remains valid."
        backHref="/dashboard/connect-bdp"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <PartnerPipelineList title="Pipeline" stages={stages} />
        </div>
        <div className="lg:col-span-3">
          <AttributionProposeForm unitId={bundle.unit.id} />
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold">Attribution portfolio</h2>
        <PartnerDataTable
          rows={rows}
          mobileTitle={(r) => `Membership ${r.membershipId.slice(0, 8)}`}
          columns={[
            {
              id: "membership",
              header: "Membership",
              cell: (r) => (
                <span className="tabular-nums">{r.membershipId.slice(0, 8)}</span>
              ),
            },
            {
              id: "status",
              header: "Attribution",
              cell: (r) => (
                <StatusBadge
                  label={attributionStatusLabel(r.status)}
                  tone={
                    r.status === "active"
                      ? "success"
                      : r.status === "unattributed"
                        ? "info"
                        : "pending"
                  }
                />
              ),
            },
            {
              id: "provenance",
              header: "Provenance",
              cell: (r) => r.provenance,
            },
            {
              id: "created",
              header: "Created",
              cell: (r) =>
                r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("en-IN")
                  : "—",
            },
          ]}
          empty={
            <EmptyState
              title="No attribution records"
              description="Sourced members will appear here once proposed or attributed by platform records."
            />
          }
        />
      </section>
    </main>
  );
}
