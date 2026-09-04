import { PartnerPageHeader } from "@/components/partner";
import { SubmitClientRequirementForm } from "@/components/enterprise/EnterpriseClientWorkflowForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Submit requirement · GCE Enterprise",
};

export default async function EnterpriseIntakePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/enterprise/intake");
  }

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(
    () => null
  );

  if (!bundle?.client) {
    return (
      <main className="mx-auto max-w-lg px-4 py-8 pb-16">
        <PartnerPageHeader
          title="Enterprise requirement intake"
          description="Submit a corporate or B2B requirement for structured GCE Enterprise review."
          backHref="/enterprise"
        />
        <EmptyState
          title="No Enterprise Client organisation linked"
          description="Your account must be linked as an Enterprise Client representative before submitting requirements."
          primaryAction={{ label: "Enterprise overview", href: "/enterprise" }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-8 pb-16 space-y-6">
      <PartnerPageHeader
        title="Submit requirement"
        description={`Organisation: ${String(bundle.client.display_name ?? "Enterprise Client")}. GCE reviews every submission — no guaranteed outcomes.`}
        backHref="/dashboard/enterprise-client"
      />
      <SubmitClientRequirementForm clientId={String(bundle.client.id)} />
    </main>
  );
}
