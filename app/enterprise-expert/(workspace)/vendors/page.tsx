import { PartnerPageHeader } from "@/components/partner";
import { VendorRecordCard } from "@/components/enterprise/ProjectOpsCards";
import { CreateVendorForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { VENDOR_MANAGED_RECORD_COPY } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Vendors · Enterprise Expert" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert/vendors");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseExpertBundle(admin, user.id).catch(() => null);
  const vendors = bundle?.vendors ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Vendor coordination" description={VENDOR_MANAGED_RECORD_COPY} />
      {vendors.length === 0 ? <EmptyState title="No vendor records" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{vendors.map((v) => (
          <VendorRecordCard key={String(v.id)} businessName={String(v.business_name ?? "Vendor")} category={typeof v.category === "string" ? v.category : null} status={typeof v.status === "string" ? v.status : null} />
        ))}</div>
      )}
      <CreateVendorForm />
    </main>
  );
}
