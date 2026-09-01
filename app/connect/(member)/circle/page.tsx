import Link from "next/link";
import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { CircleCard } from "@/components/connect/CircleCard";
import { CircleDirectory } from "@/components/connect/CircleDirectory";
import { CircleMeetingsPanel } from "@/components/connect/CircleMeetingsPanel";
import { PowerSectorGrid } from "@/components/connect/PowerSectorGrid";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import {
  findSeatForMembership,
  getActiveConnectBdpForCircle,
  loadCircleBundle,
} from "@/lib/frontend/connect/reads";
import {
  listCircleMeetings,
  partitionCircleMeetings,
} from "@/lib/architecture/connect/meetings";
import {
  CIRCLE_CAPACITY_MAX,
  countMembersByPowerSector,
  circleRemainingSeatsLabel,
  formatConstitutionLabel,
  formatLifecycleLabel,
  specialisationsByPowerSector,
} from "@/lib/frontend/connect/format";
import { CONNECT_BDP_ROLE_LABEL } from "@/lib/frontend/partner/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "My Circle · GCE Connect",
};

export default async function MyCirclePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/circle");

  const admin = createPrivilegedSupabaseClient();
  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];
  if (!primary) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <ConnectPageHeader title="My Circle" backHref="/dashboard/connect-member" />
        <EmptyState
          title="No membership"
          description="Circle access requires a Connect membership."
          primaryAction={{ label: "Membership", href: "/connect/membership" }}
        />
      </main>
    );
  }

  const seat = await findSeatForMembership(admin, primary.id).catch(() => null);
  const circleId = seat?.circle_id as string | undefined;

  if (!circleId) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <ConnectPageHeader
          title="My Circle"
          description="You are not allocated to a Circle seat yet."
          backHref="/dashboard/connect-member"
        />
        <EmptyState
          title="Temporarily unallocated"
          description={`Allocation status: ${primary.allocationStatus}. Active membership does not require immediate allocation.`}
          primaryAction={{ label: "Waitlist / allocation", href: "/connect/waitlist" }}
          secondaryAction={{ label: "Membership", href: "/connect/membership" }}
        />
        <section className="mt-10">
          <h2 className="mb-3 text-sm font-semibold">GC Power Sectors</h2>
          <PowerSectorGrid />
        </section>
      </main>
    );
  }

  const [bundle, connectBdp, meetings] = await Promise.all([
    loadCircleBundle(admin, circleId),
    getActiveConnectBdpForCircle(admin, circleId).catch(() => null),
    listCircleMeetings(admin, circleId).catch(() => []),
  ]);
  const { circle, availability, directory } = bundle;
  const capacityMax = Math.min(circle.capacityMax, CIRCLE_CAPACITY_MAX);
  const sectorCounts = countMembersByPowerSector(directory);
  const sectorSpecs = specialisationsByPowerSector(directory);
  const meetingPartition = partitionCircleMeetings(meetings);
  const isFull = availability.remaining <= 0;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title={circle.name}
        description={`${circle.city} · ${availability.activeSeats} / ${capacityMax} members · ${circleRemainingSeatsLabel(availability.activeSeats, capacityMax)}`}
        backHref="/dashboard/connect-member"
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/connect/governance">Governance</Link>
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <CircleCard
          name={circle.name}
          city={circle.city}
          lifecycleStatus={circle.lifecycleStatus}
          constitutionStatus={circle.constitutionStatus}
          activeSeatCount={circle.activeSeatCount}
          capacityMax={capacityMax}
          href="/connect/circle"
        />
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Circle status</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusBadge
              label={`Lifecycle · ${formatLifecycleLabel(circle.lifecycleStatus)}`}
              tone="pending"
            />
            <StatusBadge
              label={`Constitution · ${formatConstitutionLabel(circle.constitutionStatus)}`}
              tone="neutral"
            />
            {isFull ? (
              <StatusBadge label="Circle full" tone="warning" />
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {availability.activeSeats} active seat
            {availability.activeSeats === 1 ? "" : "s"} · {availability.remaining}{" "}
            remaining · hard cap {CIRCLE_CAPACITY_MAX} (no seat 41).
          </p>
          {connectBdp ? (
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {CONNECT_BDP_ROLE_LABEL}:
              </span>{" "}
              {connectBdp.partnerName?.trim() ||
                "Assigned partner (name on file with platform)"}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" className="min-h-11">
              <Link href="/connect/leads">Lead Assist</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="min-h-11">
              <Link href="/connect/specialisation">Specialisation</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="min-h-11">
              <Link href="/connect/tags">Tags</Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <CircleMeetingsPanel
          upcoming={meetingPartition.upcoming}
          previous={meetingPartition.previous}
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold">GC Power Sectors</h2>
        <PowerSectorGrid
          memberCounts={sectorCounts}
          specialisationsBySector={sectorSpecs}
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold">
          Member directory ({directory.length})
        </h2>
        <CircleDirectory members={directory} />
      </section>
    </main>
  );
}
