import Link from "next/link";
import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { LeadComposer } from "@/components/connect/LeadComposer";
import { LeadCard } from "@/components/connect/LeadCard";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import {
  assertPaidMechanicsInactive,
  getMySentLeads,
  presentLeadPrivacySafe,
} from "@/lib/architecture/lead-assist";
import { findSeatForMembership } from "@/lib/frontend/connect/reads";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Lead Assist · GCE Connect",
};

export default async function LeadAssistHomePage({
  searchParams,
}: {
  searchParams: Promise<{ meetingId?: string }>;
}) {
  const params = await searchParams;
  const meetingId =
    params.meetingId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      params.meetingId
    )
      ? params.meetingId
      : null;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/leads");

  const admin = createPrivilegedSupabaseClient();
  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];
  const seat = primary
    ? await findSeatForMembership(admin, primary.id).catch(() => null)
    : null;

  let sent: ReturnType<typeof presentLeadPrivacySafe>[] = [];
  try {
    sent = (await getMySentLeads(admin, user.id)).map(presentLeadPrivacySafe);
    await assertPaidMechanicsInactive(admin);
  } catch {
    sent = [];
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Lead Assist"
        description="In-app formal referrals. WhatsApp is not the canonical lead workflow."
        backHref="/dashboard/connect-member"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/connect/leads/sent">Sent</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link href="/connect/leads/received">Received</Link>
            </Button>
          </div>
        }
      />

      <FeatureGated
        className="mb-6"
        mode="disabled_in_environment"
        title="Stage 1 unpaid"
        description="No pay-to-receive, escrow, voucher conversion, success fee, or wallet monetization."
      />

      <LeadComposer
        giverMembershipId={primary?.id}
        originCircleId={(seat?.circle_id as string | undefined) ?? null}
        meetingId={meetingId}
      />

      {sent.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">Recent sent</h2>
          <div className="grid gap-3">
            {sent.slice(0, 5).map((l) => (
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
        </section>
      ) : null}
    </main>
  );
}
