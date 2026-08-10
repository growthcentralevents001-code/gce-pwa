import { PartnerPageHeader, HandoverSummary, PartnerDataTable } from "@/components/partner";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseBdpBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Handover · Enterprise BDP",
};

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-bdp/handover");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseBdpBundle(supabase, admin, user.id).catch(
    () => null
  );
  const rows = (bundle?.handovers ?? []).map((h) => ({
    id: String(h.id),
    status: h.status,
    source_pack_id: h.source_pack_id,
    target_pack_id: h.target_pack_id,
    effective_from: h.effective_from,
    created_at: h.created_at,
    client_id: h.client_id,
  }));
  const latest = rows[0];
  return (
    <main
      className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}
    >
      <PartnerPageHeader
        title="Reassignment / handover"
        description="Prospective by default. Historical entitlement is not rewritten in the UI. OD-027 cut-off remains unresolved."
      />
      {latest ? (
        <HandoverSummary
          status={String(latest.status ?? "open")}
          fromUnitId={
            typeof latest.source_pack_id === "string"
              ? latest.source_pack_id
              : null
          }
          toUnitId={
            typeof latest.target_pack_id === "string"
              ? latest.target_pack_id
              : null
          }
          notes="Client reassignment is prospective by default. Platform attribution authority controls activation."
          effectiveAt={
            typeof latest.effective_from === "string"
              ? latest.effective_from
              : typeof latest.created_at === "string"
                ? latest.created_at
                : null
          }
        />
      ) : (
        <EmptyState
          title="No handover events"
          description="When Platform reassigns a client, prospective handover status appears here."
        />
      )}
      <FeatureGated
        title="Self-serve reassignment request"
        description="Platform-gated reassignment API exists; EBDP self-serve request console is incomplete (BG-24)."
        mode="coming_later"
      />
      {rows.length > 0 ? (
        <PartnerDataTable
          columns={[
            {
              id: "client",
              header: "Client",
              cell: (r) => String(r.client_id ?? "—").slice(0, 8),
            },
            {
              id: "status",
              header: "Status",
              cell: (r) => String(r.status ?? "—").replace(/_/g, " "),
            },
            {
              id: "eff",
              header: "Effective",
              cell: (r) =>
                String(r.effective_from ?? r.created_at ?? "—").slice(0, 10),
            },
          ]}
          rows={rows}
          mobileTitle={(r) => `Handover ${String(r.id).slice(0, 8)}`}
        />
      ) : null}
    </main>
  );
}
