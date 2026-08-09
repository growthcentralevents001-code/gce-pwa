import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { LeadCard } from "@/components/connect/LeadCard";
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
        <div className="grid gap-3">
          {sent.map((l) => (
            <LeadCard
              key={l.id}
              id={l.id}
              title={l.title}
              workStatus={l.workStatus}
              city={l.city}
              urgency={l.urgency}
            />
          ))}
        </div>
      )}
    </main>
  );
}
