import Link from "next/link";
import { PartnerPageHeader } from "@/components/partner";
import { EbdpApplyForm } from "@/components/enterprise/EbdpApplyForm";
import { EbdpPackLifecycleCard } from "@/components/enterprise/EbdpPackLifecycleCard";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listEbdpPacksForUser } from "@/lib/architecture/enterprise";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { ENTERPRISE_BDP_ROLE_LABEL } from "@/lib/frontend/enterprise/format";

export const metadata = { robots: { index: false, follow: false }, title: "Apply · Enterprise BDP" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const packs = user
    ? await listEbdpPacksForUser(supabase, user.id).catch(() => [])
    : [];
  const hasActive = packs.some((p) => p.application_status === "active");
  const inFlight = packs.some(
    (p) =>
      p.application_status !== "active" &&
      p.application_status !== "rejected" &&
      p.application_status !== "terminated"
  );

  return (
    <main className={`mx-auto max-w-3xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={`${ENTERPRISE_BDP_ROLE_LABEL} application`}
        description="Franchise Pack application with platform review. Client-based attribution — no territory ownership."
        backHref="/enterprise-bdp"
        backLabel="Opportunity"
        actions={
          hasActive ? (
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/dashboard/enterprise-bdp">Workspace</Link>
            </Button>
          ) : null
        }
      />

      {packs.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Your applications</h2>
          {packs.map((pack) => (
            <EbdpPackLifecycleCard
              key={String(pack.id)}
              pack={{
                id: String(pack.id),
                application_status: String(pack.application_status),
                package_option: String(pack.package_option),
                terms_accepted_at: pack.terms_accepted_at as string | null,
                payment_intent_id: pack.payment_intent_id as string | null,
                offline_payment_ref: pack.offline_payment_ref as string | null,
                created_at: pack.created_at as string | null,
              }}
            />
          ))}
        </div>
      ) : null}

      {!hasActive && !inFlight ? <EbdpApplyForm /> : null}
    </main>
  );
}
