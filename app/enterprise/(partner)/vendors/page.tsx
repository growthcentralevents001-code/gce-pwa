import { PartnerPageHeader } from "@/components/partner";
import { VendorRecordCard } from "@/components/enterprise/ProjectOpsCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { VENDOR_MANAGED_RECORD_COPY } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Vendors · Enterprise Client" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/vendors");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(() => null);
  const rows = bundle?.vendors ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Vendors" description={VENDOR_MANAGED_RECORD_COPY} />
      {rows.length === 0 ? (
        <EmptyState title="No vendor records visible" description="Only vendors linked to your projects are shown." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((v) => (
            <VendorRecordCard
              key={String(v.id)}
              businessName={String(v.business_name ?? "Vendor")}
              category={typeof v.category === "string" ? v.category : null}
              status={typeof v.status === "string" ? v.status : null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
