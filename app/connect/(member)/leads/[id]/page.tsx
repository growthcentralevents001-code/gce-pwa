import { notFound, redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { LeadActions } from "@/components/connect/LeadActions";
import { Timeline } from "@/components/connect/Timeline";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { listActiveSpecialisations } from "@/lib/architecture/connect/specialisations";
import { findAssociateTag } from "@/lib/architecture/connect/tagCatalog";
import {
  getLatestLeadRequirement,
  getLeadDomainTimeline,
  getLeadOutcomeConfirmation,
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
  const [sent, received, requirement, timeline, outcome, specialisations] =
    await Promise.all([
      getMySentLeads(admin, user.id).catch(() => []),
      getMyReceivedLeads(admin, user.id).catch(() => []),
      getLatestLeadRequirement(admin, id).catch(() => null),
      getLeadDomainTimeline(admin, id).catch(() => []),
      getLeadOutcomeConfirmation(admin, id).catch(() => null),
      listActiveSpecialisations(admin).catch(() => []),
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

  const spec = specialisations.find(
    (s) =>
      s.id ===
      (requirement?.specialisationId ?? lead.specialisation_id ?? "")
  );
  const tagLabels = (requirement?.tagCodes ?? [])
    .map((code) => findAssociateTag(code)?.label ?? code)
    .filter(Boolean);

  const timelineItems =
    timeline.length > 0
      ? timeline
      : [
          {
            id: "created",
            title: "Referral created",
            at: lead.created_at ?? null,
            tone: "pending" as const,
          },
          {
            id: "status",
            title: `Current status · ${safe.workStatus.replaceAll("_", " ")}`,
            description:
              "Routing is Circle-first → cross-Circle → wider → Opportunity Desk",
            tone: "neutral" as const,
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
        description="Classification and ranking never override eligibility, RBAC, or privacy. Deterministic backend rules remain authoritative."
      />

      <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold">Requirement</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
          {requirement?.requirementSummary ?? "—"}
        </p>
        {requirement?.requirementDetails ? (
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
            {requirement.requirementDetails}
          </p>
        ) : null}
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {spec ? (
            <>
              <div>
                <dt className="text-muted-foreground">GC Power Sector</dt>
                <dd className="font-medium">
                  {spec.powerSector?.replaceAll("_", " ") ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Specialisation</dt>
                <dd className="font-medium">{spec.label}</dd>
              </div>
            </>
          ) : null}
          {tagLabels.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Tags</dt>
              <dd className="font-medium">{tagLabels.join(" · ")}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      {outcome ? (
        <section className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Dual confirmation</h2>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Giver</dt>
              <dd className="font-medium">
                {outcome.giverStatus ?? "pending"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Receiver</dt>
              <dd className="font-medium">
                {outcome.receiverStatus ?? "pending"}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Outcome status</dt>
              <dd className="font-medium">{outcome.status}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-muted-foreground">
            Dual confirmation does not create GCE revenue, commission, settlement,
            or payout.
          </p>
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Journey</h2>
        <Timeline items={timelineItems} />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Actions</h2>
        <LeadActions
          leadId={id}
          workStatus={safe.workStatus}
          contactAvailable={safe.contactAvailable}
          role={role}
          outcome={outcome}
        />
      </section>
    </main>
  );
}
