import { PartnerPageHeader } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false }, title: "Requirements · Enterprise Client" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/requirements");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(() => null);
  const rows = bundle?.requirements ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Requirement briefs" description="Structured requirement versions for your organisation. Expert may refine scope; you review inputs." />
      {rows.length === 0 ? (
        <EmptyState title="No requirement versions" description="Requirement versions appear after opportunity intake." />
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={String(r.id)} className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">Version {String(r.version_number ?? "—")}</p>
                  <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{String(r.structured_scope ?? r.raw_requirement ?? "No scope text")}</p>
                </div>
                <StatusBadge label={String(r.status ?? "draft").replace(/_/g, " ")} tone="neutral" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
