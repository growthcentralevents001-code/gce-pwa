import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { DisputeCard } from "@/components/partner/DisputeCard";
import { DisputeOpenForm } from "@/components/partner/DisputeOpenForm";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Disputes · Connect BDP",
};

/** CBDP-09 — Disputes */
export default async function ConnectBdpDisputesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/disputes");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Disputes" />
        <EmptyState
          title="No unit"
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Disputes"
        description="First-level handling by Connect BDP. Unresolved cases escalate to Platform Relationship Manager. Final authority remains platform-governed."
        backHref="/dashboard/connect-bdp"
      />

      <DisputeOpenForm unitId={bundle.unit.id} />

      {bundle.disputes.length === 0 ? (
        <EmptyState title="No disputes" description="Open disputes will appear here." />
      ) : (
        <div className="space-y-4">
          {bundle.disputes.map((d) => (
            <DisputeCard
              key={String(d.id)}
              id={String(d.id)}
              subject={String(d.subject ?? "Dispute")}
              status={String(d.status ?? "open")}
              details={d.details ? String(d.details) : null}
              timeline={[
                {
                  id: "opened",
                  title: "Opened",
                  at: d.created_at ? String(d.created_at) : null,
                  tone: "pending",
                },
                ...(d.escalated_at
                  ? [
                      {
                        id: "escalated",
                        title: "Escalated to PRM",
                        at: String(d.escalated_at),
                        tone: "warning" as const,
                      },
                    ]
                  : []),
                ...(d.resolved_at
                  ? [
                      {
                        id: "resolved",
                        title: "Resolved",
                        at: String(d.resolved_at),
                        tone: "success" as const,
                      },
                    ]
                  : []),
              ]}
            />
          ))}
        </div>
      )}
    </main>
  );
}
