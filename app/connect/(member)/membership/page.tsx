import Link from "next/link";
import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { MembershipCard } from "@/components/connect/MembershipCard";
import { MembershipSubmitButton } from "@/components/connect/MembershipSubmitButton";
import { CircleCard } from "@/components/connect/CircleCard";
import { KpiCard } from "@/components/connect/KpiCard";
import { LeadCard } from "@/components/connect/LeadCard";
import { Timeline } from "@/components/connect/Timeline";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { listMembershipsForUser, listMembershipEvents } from "@/lib/architecture/connect/memberships";
import { membershipStatusLabel } from "@/lib/frontend/connect/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
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
  const events = primary
    ? await listMembershipEvents(supabase, primary.id).catch(() => [])
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
          primaryAction={{ label: "Start application", href: "/memberships/apply" }}
        />
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-2">
            <MembershipCard
              status={primary.status}
              allocationStatus={primary.allocationStatus}
              tagCount={tags.length}
              businessName={primary.businessName}
            />
            {primary.status === "draft" ? (
              <div className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
                <h2 className="text-sm font-semibold">Complete your application</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your draft is saved. Submit when ready, or continue editing.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <MembershipSubmitButton membershipId={primary.id} />
                  <Button asChild variant="outline" className="min-h-11">
                    <Link href="/memberships/apply">Edit application</Link>
                  </Button>
                </div>
              </div>
            ) : null}
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
              icon="tag"
            />
            <KpiCard
              label="Sent leads"
              value={String(sent.length)}
              href="/connect/leads/sent"
              icon="target"
            />
            <KpiCard
              label="Received"
              value={String(receivedCount)}
              href="/connect/leads/received"
              icon="users"
            />
            <KpiCard
              label="Plan"
              value="Associate"
              href="/connect/membership"
              icon="circle-dollar"
              hint="₹6,000 / quarter"
            />
          </div>

          <FeatureGated
            mode="disabled_in_environment"
            title="Paid Lead Assist inactive"
            description="Stage 1 Lead Assist is unpaid. Escrow, ₹500 fees, and success fees stay OFF."
          />

          {events.length > 0 ? (
            <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
              <h2 className="text-base font-semibold">Application history</h2>
              <div className="mt-4">
                <Timeline
                  items={events.map((ev) => ({
                    id: String(ev.id),
                    title:
                      ev.to_status
                        ? membershipStatusLabel(String(ev.to_status))
                        : String(ev.event_type ?? "Event"),
                    at: ev.created_at ? String(ev.created_at) : null,
                    tone:
                      ev.to_status === "active"
                        ? ("success" as const)
                        : ("pending" as const),
                  }))}
                />
              </div>
            </section>
          ) : null}

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
