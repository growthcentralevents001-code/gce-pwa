import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { OpportunityCard } from "@/components/enterprise/OpportunityProjectCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { opportunityStatusLabel } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Opportunities · Enterprise Client",
};

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/opportunities");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(
    () => null
  );
  const rows = (bundle?.opportunities ?? []).map((o) => ({
    ...(o as Record<string, unknown>),
    id: String(o.id),
    title: o.title,
    status: o.status,
    summary: o.summary,
    updated_at: o.updated_at,
    created_at: o.created_at,
  }));
  return (
    <main
      className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}
    >
      <PartnerPageHeader
        title="Opportunities"
        description="Organisation-scoped opportunities. Client representatives can view and accept quotes — they cannot open opportunities (EBDP / Expert write)."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="No opportunities yet"
          description="New opportunities appear when Platform or your Enterprise BDP opens them."
        />
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {rows.map((o) => (
              <OpportunityCard
                key={o.id}
                id={o.id}
                title={String(o.title ?? "Opportunity")}
                status={String(o.status ?? "")}
                summary={typeof o.summary === "string" ? o.summary : null}
              />
            ))}
          </div>
          <div className="hidden sm:block">
            <PartnerDataTable
              columns={[
                {
                  id: "title",
                  header: "Opportunity",
                  cell: (r) => String(r.title ?? "—"),
                },
                {
                  id: "status",
                  header: "Status",
                  cell: (r) => opportunityStatusLabel(String(r.status ?? "")),
                },
                {
                  id: "updated",
                  header: "Updated",
                  cell: (r) =>
                    String(r.updated_at ?? r.created_at ?? "—").slice(0, 10),
                },
              ]}
              rows={rows}
              mobileTitle={(r) => String(r.title ?? "Opportunity")}
            />
          </div>
        </>
      )}
    </main>
  );
}
