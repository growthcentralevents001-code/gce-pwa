import { notFound, redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { RequirementTimeline } from "@/components/enterprise/RequirementTimeline";
import {
  RespondRequirementInfoForm,
} from "@/components/enterprise/EnterpriseClientWorkflowForms";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import {
  loadEnterpriseClientBundle,
  loadEnterpriseOpportunityDetail,
} from "@/lib/frontend/enterprise/reads";
import { opportunityStatusLabel } from "@/lib/frontend/enterprise/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Opportunity · Enterprise Client",
};

type Params = Promise<{ id: string }>;

export default async function EnterpriseOpportunityDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/enterprise/opportunities/${id}`);

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(
    () => null
  );
  if (!bundle?.client) notFound();

  const detail = await loadEnterpriseOpportunityDetail(
    admin,
    id,
    String(bundle.client.id)
  ).catch(() => null);
  if (!detail) notFound();

  const infoMessage =
    typeof detail.requirement?.metadata === "object" &&
    detail.requirement.metadata &&
    typeof (detail.requirement.metadata as Record<string, unknown>)
      .latestInfoRequest === "object"
      ? String(
          (
            (detail.requirement.metadata as Record<string, unknown>)
              .latestInfoRequest as Record<string, unknown>
          ).message ?? ""
        )
      : null;

  return (
    <main className={`mx-auto max-w-3xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={String(detail.opportunity.title ?? "Opportunity")}
        description={String(detail.opportunity.summary ?? "Enterprise requirement workflow")}
        backHref="/enterprise/opportunities"
        actions={
          <StatusBadge
            label={opportunityStatusLabel(String(detail.opportunity.status ?? ""))}
          />
        }
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold">Progress</h2>
        <RequirementTimeline
          workflow={{
            readinessStatus: String(detail.requirement?.readiness_status ?? "submitted"),
            opportunityStatus: String(detail.opportunity.status ?? "open"),
            submittedAt:
              typeof detail.requirement?.metadata === "object" &&
              detail.requirement.metadata
                ? String(
                    (detail.requirement.metadata as Record<string, unknown>)
                      .submittedAt ?? detail.requirement.created_at ?? ""
                  )
                : null,
            infoRequestedAt:
              typeof detail.requirement?.metadata === "object" &&
              detail.requirement.metadata &&
              typeof (detail.requirement.metadata as Record<string, unknown>)
                .latestInfoRequest === "object"
                ? String(
                    (
                      (detail.requirement.metadata as Record<string, unknown>)
                        .latestInfoRequest as Record<string, unknown>
                    ).requestedAt ?? ""
                  )
                : null,
            hasProposal: detail.proposals.length > 0,
            hasIssuedQuote: detail.quotes.some((q) =>
              ["issued", "viewed", "accepted"].includes(String(q.status))
            ),
            hasProject: detail.projects.length > 0,
          }}
        />
      </section>

      {detail.latestVersion ? (
        <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-4`}>
          <h2 className="text-sm font-semibold">Latest requirement</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
            {String(
              detail.latestVersion.raw_requirement ??
                detail.latestVersion.structured_scope ??
                "—"
            )}
          </p>
        </section>
      ) : null}

      {detail.requirement?.readiness_status === "info_requested" ? (
        <RespondRequirementInfoForm
          opportunityId={id}
          clientId={String(bundle.client.id)}
          message={infoMessage}
        />
      ) : null}
    </main>
  );
}
