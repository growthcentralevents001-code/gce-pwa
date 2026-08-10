import { PartnerPageHeader, DisputeCard } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Disputes · Enterprise Client",
};

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/disputes");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(
    () => null
  );
  const rows = bundle?.disputes ?? [];
  return (
    <main
      className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}
    >
      <PartnerPageHeader
        title="Disputes"
        description="Organisation-scoped Enterprise disputes. Resolution follows backend RBAC."
      />
      {rows.length === 0 ? (
        <EmptyState title="No disputes" />
      ) : (
        <div className="grid gap-3">
          {rows.map((d) => (
            <DisputeCard
              key={String(d.id)}
              id={String(d.id)}
              subject={String(d.title ?? "Dispute")}
              status={String(d.status ?? "open")}
              details={typeof d.details === "string" ? d.details : null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
