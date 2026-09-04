import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { ProposeAttributionForm, ProposeCorporateClientForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseBdpBundle } from "@/lib/frontend/enterprise/reads";
import { attributionStatusLabel } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Clients · Enterprise BDP" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-bdp/clients");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseBdpBundle(supabase, admin, user.id).catch(() => null);
  const rows = (bundle?.attributions ?? []).map((a) => {
    const c = a.enterprise_client_profiles;
    const profile = Array.isArray(c) ? c[0] : c;
    return {
      id: String(a.id),
      clientName: String((profile as Record<string, unknown> | null)?.display_name ?? a.client_id ?? "Client"),
      status: String(a.status ?? ""),
      clientId: String(a.client_id ?? ""),
    };
  });
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Client portfolio" description="Attributed Enterprise Clients for your pack. Propose ≠ activate. No territory ownership." />
      {rows.length === 0 ? (
        <EmptyState title="No attributed clients yet" description="Propose attribution when you have a client ID. Platform activates." />
      ) : (
        <PartnerDataTable
          columns={[
            { id: "client", header: "Client", cell: (r) => r.clientName },
            { id: "status", header: "Attribution", cell: (r) => attributionStatusLabel(r.status) },
            { id: "id", header: "Client ID", cell: (r) => r.clientId.slice(0, 8), hideOnMobile: true },
          ]}
          rows={rows}
          mobileTitle={(r) => r.clientName}
        />
      )}
      {bundle?.pack && bundle.pack.application_status === "active" ? (
        <>
          <ProposeCorporateClientForm packId={String(bundle.pack.id)} />
          <ProposeAttributionForm packId={bundle.pack.id} bdpUserId={user.id} />
        </>
      ) : null}
    </main>
  );
}
