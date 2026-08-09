import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { LeadCard } from "@/components/connect/LeadCard";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyReceivedLeads } from "@/lib/architecture/lead-assist";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Received leads · GCE Connect",
};

export default async function ReceivedLeadsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/leads/received");

  const admin = createPrivilegedSupabaseClient();
  let rows: Awaited<ReturnType<typeof getMyReceivedLeads>> = [];
  try {
    rows = await getMyReceivedLeads(admin, user.id);
  } catch {
    rows = [];
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Received leads"
        description="Assignments only — candidates are not shown. Candidate ≠ assignment."
        backHref="/connect/leads"
        backLabel="Lead Assist"
      />

      {rows.length === 0 ? (
        <EmptyState title="No received assignments" />
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => {
            const lead = Array.isArray(row.assist_leads)
              ? row.assist_leads[0]
              : row.assist_leads;
            if (!lead) return null;
            return (
              <LeadCard
                key={row.id}
                id={String(lead.id)}
                title={String(lead.title)}
                workStatus={String(lead.work_status ?? row.status ?? "offered")}
                city={lead.city ? String(lead.city) : null}
                urgency={lead.urgency ? String(lead.urgency) : null}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
