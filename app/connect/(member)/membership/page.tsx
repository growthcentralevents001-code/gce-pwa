import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Target, Tag, CircleDollarSign } from "lucide-react";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { MembershipCard } from "@/components/connect/MembershipCard";
import { CircleCard } from "@/components/connect/CircleCard";
import { KpiCard } from "@/components/connect/KpiCard";
import { LeadCard } from "@/components/connect/LeadCard";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { listMembershipTags } from "@/lib/architecture/connect/tags";
import {
  getMyReceivedLeads,
  getMySentLeads,
  presentLeadPrivacySafe,
  assertPaidMechanicsInactive,
} from "@/lib/architecture/lead-assist";
import { findSeatForMembership } from "@/lib/frontend/connect/reads";
import { CIRCLE_CAPACITY_MAX } from "@/lib/frontend/connect/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Connect · Membership",
};

export default async function ConnectMembershipPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/membership");

  const admin = createPrivilegedSupabaseClient();
  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0] ?? null;
  const tags = primary
    ? await listMembershipTags(supabase, primary.id).catch(() => [])
    : [];
  const seat = primary
    ? await findSeatForMembership(admin, primary.id).catch(() => null)
    : null;
  const circleRaw = seat?.connect_circles;
  const circle = Array.isArray(circleRaw) ? circleRaw[0] : circleRaw;

  let sent: ReturnType<typeof presentLeadPrivacySafe>[] = [];
  let receivedCount = 0;
  let paidFlags: Record<string, boolean> | null = null;
  try {
    sent = (await getMySentLeads(admin, user.id)).map(presentLeadPrivacySafe);
    receivedCount = (await getMyReceivedLeads(admin, user.id)).length;
    paidFlags = await assertPaidMechanicsInactive(admin);
  } catch {
    sent = [];
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Membership"
        description="Associate plan · activation and Circle allocation are separate."
        backHref="/dashboard/connect-member"
        backLabel="Overview"
        actions={
          <Button asChild className="min-h-11">
            <Link href="/connect/leads">Lead Assist</Link>
          </Button>
        }
      />

      {!primary ? (
        <EmptyState
          title="No membership yet"
          description="Start with Associate Membership when purchase is available for your account."
          primaryAction={{ label: "View plans", href: "/memberships" }}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <MembershipCard
              status={primary.status}
              allocationStatus={primary.allocationStatus}
              tagCount={tags.length}
            />
            {circle ? (
              <CircleCard
                name={String(circle.name)}
                city={circle.city ? String(circle.city) : null}
                lifecycleStatus={String(circle.lifecycle_status)}
                constitutionStatus={String(circle.constitution_status)}
                activeSeatCount={Number(circle.active_seat_count ?? 0)}
                capacityMax={Math.min(
                  Number(circle.capacity_max ?? CIRCLE_CAPACITY_MAX),
                  CIRCLE_CAPACITY_MAX
                )}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5">
                <h2 className="text-sm font-semibold">Circle allocation</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Status: {primary.allocationStatus.replaceAll("_", " ")}. An
                  active member may remain temporarily unallocated.
                </p>
                <Button asChild variant="outline" className="mt-4 min-h-11">
                  <Link href="/connect/waitlist">Allocation & waitlist</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Tags"
              value={`${tags.length}/4`}
              href="/connect/tags"
              icon={Tag}
            />
            <KpiCard
              label="Sent leads"
              value={String(sent.length)}
              href="/connect/leads/sent"
              icon={Target}
            />
            <KpiCard
              label="Received"
              value={String(receivedCount)}
              href="/connect/leads/received"
              icon={Users}
            />
            <KpiCard
              label="Plan"
              value="Associate"
              href="/connect/membership"
              icon={CircleDollarSign}
              hint="₹6,000 / quarter"
            />
          </div>

          <FeatureGated
            mode="disabled_in_environment"
            title="Paid Lead Assist inactive"
            description="Stage 1 Lead Assist is unpaid. Escrow, ₹500 fees, and success fees stay OFF."
          />

          {sent.length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold">Recent sent leads</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {sent.slice(0, 4).map((l) => (
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

          <p className="text-[11px] text-muted-foreground">
            Paid mechanics flags:{" "}
            {paidFlags
              ? Object.entries(paidFlags)
                  .map(([k, v]) => `${k}=${String(v)}`)
                  .join(" · ")
              : "unavailable"}
          </p>
        </div>
      )}
    </main>
  );
}
