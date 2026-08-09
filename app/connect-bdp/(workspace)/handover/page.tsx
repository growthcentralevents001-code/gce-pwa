import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { HandoverSummary } from "@/components/partner/HandoverSummary";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Handover · Connect BDP",
};

/** CBDP-10 — Handover / reassignment presentation */
export default async function ConnectBdpHandoverPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/handover");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Handover" />
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
        title="Handover & reassignment"
        description="Prospective effect by default. Historical attribution and earned commission are not rewritten client-side. Platform approval required."
        backHref="/dashboard/connect-bdp"
      />

      {bundle.handovers.length === 0 ? (
        <EmptyState
          title="No handover records"
          description="When Platform initiates a unit handover, status will appear here."
        />
      ) : (
        <div className="space-y-4">
          {bundle.handovers.map((h) => (
            <HandoverSummary
              key={String(h.id)}
              status={String(h.status ?? "pending")}
              fromUnitId={h.from_unit_id ? String(h.from_unit_id) : null}
              toUnitId={h.to_unit_id ? String(h.to_unit_id) : null}
              notes={h.notes ? String(h.notes) : null}
              effectiveAt={
                h.effective_at
                  ? String(h.effective_at)
                  : h.created_at
                    ? String(h.created_at)
                    : null
              }
              timeline={[
                {
                  id: "created",
                  title: "Handover recorded",
                  at: h.created_at ? String(h.created_at) : null,
                },
                ...(h.approved_at
                  ? [
                      {
                        id: "approved",
                        title: "Platform approved",
                        at: String(h.approved_at),
                        tone: "success" as const,
                      },
                    ]
                  : []),
              ]}
            />
          ))}
        </div>
      )}

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <h2 className="text-base font-semibold">Reassignment principle</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reassignment is prospective unless a more specific Founder Decision
          provides otherwise. Connect BDP cannot silently transfer ownership
          semantics or rewrite historical commission.
        </p>
      </section>

      <FeatureGated
        mode="unavailable"
        title="Self-serve handover"
        description="Creating or approving handovers is Platform-gated. This workspace displays status only."
      />
    </main>
  );
}
