import { notFound, redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { LeadActions } from "@/components/connect/LeadActions";
import { Timeline } from "@/components/connect/Timeline";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import {
  getMyReceivedLeads,
  getMySentLeads,
  presentLeadPrivacySafe,
} from "@/lib/architecture/lead-assist";
import { leadStatusTone } from "@/lib/frontend/connect/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Lead detail · GCE Connect",
};

type Params = Promise<{ id: string }>;

export default async function LeadDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/connect/leads/${id}`)}`);
  }

  const admin = createPrivilegedSupabaseClient();
  const [sent, received] = await Promise.all([
    getMySentLeads(admin, user.id).catch(() => []),
    getMyReceivedLeads(admin, user.id).catch(() => []),
  ]);

  const sentLead = sent.find((l) => l.id === id);
  const receivedRow = received.find((r) => {
    const lead = Array.isArray(r.assist_leads)
      ? r.assist_leads[0]
      : r.assist_leads;
    return lead && String(lead.id) === id;
  });
  const receivedLead = receivedRow
    ? Array.isArray(receivedRow.assist_leads)
      ? receivedRow.assist_leads[0]
      : receivedRow.assist_leads
    : null;

  if (!sentLead && !receivedLead) notFound();

  const lead = sentLead ?? receivedLead!;
  const safe = presentLeadPrivacySafe(lead);
  const role =
    sentLead && receivedLead ? "both" : sentLead ? "giver" : "receiver";

  const timeline = [
    {
      id: "created",
      title: "Lead created",
      at: lead.created_at ?? null,
      tone: "pending" as const,
    },
    {
      id: "status",
      title: `Status · ${safe.workStatus.replaceAll("_", " ")}`,
      description: "Routing is Circle-first → cross-Circle → wider → Opportunity Desk",
      tone: "neutral" as const,
    },
    {
      id: "contact",
      title: safe.contactAvailable
        ? "Contact revealed"
        : "Contact hidden until server authorization",
      tone: safe.contactAvailable ? ("success" as const) : ("warning" as const),
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title={safe.title}
        description={[safe.city, safe.state, safe.urgency]
          .filter(Boolean)
          .join(" · ")}
        backHref={
          role === "receiver" ? "/connect/leads/received" : "/connect/leads/sent"
        }
        actions={
          <StatusBadge
            label={safe.workStatus.replaceAll("_", " ")}
            tone={leadStatusTone(safe.workStatus)}
          />
        }
      />

      <FeatureGated
        className="mb-6"
        mode="unavailable"
        title="AI assist is advisory"
        description="If classification/ranking appears later, it never overrides eligibility, RBAC, or privacy. Deterministic backend rules remain authoritative."
      />

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold">Summary</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {lead.requirement_summary ?? "—"}
        </p>
        {lead.requirement_details ? (
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {String(lead.requirement_details)}
          </p>
        ) : null}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Activity</h2>
        <Timeline items={timeline} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Actions</h2>
        <LeadActions
          leadId={id}
          workStatus={safe.workStatus}
          contactAvailable={safe.contactAvailable}
          role={role}
        />
      </section>
    </main>
  );
}
