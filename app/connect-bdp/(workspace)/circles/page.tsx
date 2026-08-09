import { redirect } from "next/navigation";
import { PartnerPageHeader, CircleCard } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import {
  CONNECT_BDP_CIRCLES_PER_UNIT,
  unitCircleCapacityLabel,
} from "@/lib/frontend/partner/format";
import { CIRCLE_CAPACITY_MAX } from "@/lib/frontend/connect/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Circles · Connect BDP",
};

/** CBDP-06 — Circle portfolio / formation */
export default async function ConnectBdpCirclesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/circles");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Circles" />
        <EmptyState
          title="No unit"
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const activeCount = bundle.circleAssignments.filter(
    (c) => String(c.status) === "active"
  ).length;
  const capacityMax = Number(
    bundle.unit.circles_capacity_max ?? CONNECT_BDP_CIRCLES_PER_UNIT
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Circle portfolio"
        description="Formation and portfolio Circles for this Franchise Unit. Max 5 Circles per unit. Max 40 members per Circle. Frontend cannot force activation."
        backHref="/dashboard/connect-bdp"
      />

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.glassLight} p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Unit Circle capacity
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {unitCircleCapacityLabel(activeCount, capacityMax)}
            </p>
          </div>
          <StatusBadge
            label={
              activeCount >= capacityMax
                ? "Unit at capacity"
                : "Capacity available"
            }
            tone={activeCount >= capacityMax ? "warning" : "success"}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Backend blocks Circle 6 for a capped unit. Target credit is once at 15
          approved + paid members — not again at 20 or 40.
        </p>
      </section>

      {bundle.circleAssignments.length === 0 ? (
        <EmptyState
          title="No Circles assigned"
          description="Circle assignment is Platform-controlled. Formation progress appears here once Circles are linked to your unit."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bundle.circleAssignments.map((row) => {
            const circleRaw = row.connect_circles;
            const circle = Array.isArray(circleRaw)
              ? circleRaw[0]
              : circleRaw;
            const c = (circle ?? {}) as Record<string, unknown>;
            const name = String(c.name ?? `Circle ${String(row.circle_id).slice(0, 8)}`);
            const seats = Number(
              c.active_seat_count ?? c.approved_paid_count ?? 0
            );
            return (
              <div key={String(row.id)} className="space-y-2">
                <CircleCard
                  name={name}
                  city={c.city ? String(c.city) : null}
                  lifecycleStatus={String(c.lifecycle_status ?? "formation")}
                  constitutionStatus={String(
                    c.constitution_status ?? "formation_circle"
                  )}
                  activeSeatCount={Math.min(seats, CIRCLE_CAPACITY_MAX)}
                  capacityMax={CIRCLE_CAPACITY_MAX}
                  href="/connect-bdp/targets"
                />
                <div className="flex flex-wrap gap-2 px-1">
                  <StatusBadge
                    label={`Assignment ${String(row.status)}`}
                    tone="neutral"
                  />
                  {row.target_credited === true ||
                  row.credited === true ||
                  c.target_credited === true ? (
                    <StatusBadge label="Target credited" tone="success" />
                  ) : (
                    <StatusBadge
                      label="Credit pending activation (15)"
                      tone="pending"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <h2 className="text-base font-semibold">Governance setup note</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Where Connect BDP assists governance establishment, use Governing Body,
          Circle Finance Coordinator, and Sergeant-at-Arms. Connect BDP does not
          permanently control Circle governance. Treasurer is legacy.
        </p>
      </section>
    </main>
  );
}
