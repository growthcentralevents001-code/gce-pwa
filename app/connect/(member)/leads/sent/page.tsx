import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { FilteredLeadList } from "@/components/connect/FilteredLeadList";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import {
  getMySentLeads,
  presentLeadPrivacySafe,
} from "@/lib/architecture/lead-assist";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Sent leads · GCE Connect",
};

export default async function SentLeadsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/leads/sent");

  const admin = createPrivilegedSupabaseClient();
  let sent: ReturnType<typeof presentLeadPrivacySafe>[] = [];
  try {
    sent = (await getMySentLeads(admin, user.id)).map(presentLeadPrivacySafe);
  } catch {
    sent = [];
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Sent leads"
        description="Statuses come from assist_leads.work_status — not a simplified client machine."
        backHref="/connect/leads"
        backLabel="Lead Assist"
      />

      {sent.length === 0 ? (
        <EmptyState
          title="No sent leads"
          primaryAction={{ label: "Compose", href: "/connect/leads" }}
        />
      ) : (
        <FilteredLeadList
          items={sent}
          emptyTitle="No referrals match this filter"
          emptyAction={{ label: "Compose", href: "/connect/leads" }}
        />
      )}
    </main>
  );
}
