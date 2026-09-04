import { redirect } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  ConnectCircleStructurePanel,
  type CircleStructureSummary,
} from "@/components/ops/ConnectCircleStructurePanel";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadCircleBundle } from "@/lib/frontend/connect/reads";
import {
  listCircleMeetings,
  partitionCircleMeetings,
} from "@/lib/architecture/connect/meetings";
import {
  countMembersByPowerSector,
  specialisationsByPowerSector,
  CIRCLE_CAPACITY_MAX,
} from "@/lib/frontend/connect/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Circle structure · Connect Ops",
};

export default async function ConnectOpsCirclesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/connect/circles");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (!actorHasOpsAdminPermission(entitlements.activeAssignments, "ops.connect")) {
    redirect("/ops");
  }

  const admin = createPrivilegedSupabaseClient();
  const { data: rows } = await admin
    .from("connect_circles")
    .select(
      "id,name,city,active_seat_count,capacity_max,lifecycle_status,constitution_status"
    )
    .not("lifecycle_status", "eq", "draft")
    .order("name")
    .limit(30);

  const summaries: CircleStructureSummary[] = [];
  for (const row of rows ?? []) {
    try {
      const bundle = await loadCircleBundle(admin, String(row.id));
      const meetings = await listCircleMeetings(admin, String(row.id)).catch(
        () => []
      );
      const upcoming = partitionCircleMeetings(meetings).upcoming;
      summaries.push({
        id: String(row.id),
        name: String(row.name),
        city: String(row.city),
        activeSeats: bundle.availability.activeSeats,
        capacityMax: bundle.availability.capacityMax,
        remaining: bundle.availability.remaining,
        lifecycleStatus: String(row.lifecycle_status),
        constitutionStatus: String(row.constitution_status),
        sectorCounts: countMembersByPowerSector(bundle.directory),
        sectorSpecs: specialisationsByPowerSector(bundle.directory),
        upcomingMeetingLabel: upcoming
          ? new Date(upcoming.scheduledAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })
          : null,
      });
    } catch {
      const activeSeats = Number(row.active_seat_count ?? 0);
      const capacityMax = Math.min(
        Number(row.capacity_max ?? CIRCLE_CAPACITY_MAX),
        CIRCLE_CAPACITY_MAX
      );
      summaries.push({
        id: String(row.id),
        name: String(row.name),
        city: String(row.city),
        activeSeats,
        capacityMax,
        remaining: Math.max(0, capacityMax - activeSeats),
        lifecycleStatus: String(row.lifecycle_status),
        constitutionStatus: String(row.constitution_status),
        sectorCounts: {},
        sectorSpecs: {},
        upcomingMeetingLabel: null,
      });
    }
  }

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Circle structure"
        description="Read-only capacity and GC Power Sector distribution. Allocation remains server-authorized — no seat 41."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Connect Ops", href: "/ops/connect" },
          { label: "Circle structure" },
        ]}
        secondaryActions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/ops/connect">Back to Connect Ops</Link>
          </Button>
        }
      />
      <ConnectCircleStructurePanel circles={summaries} />
    </main>
  );
}
