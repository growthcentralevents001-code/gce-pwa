import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import {
  CITY_TIER_MAX_UNITS,
  cityTierCap,
  cityTierLabel,
} from "@/lib/frontend/partner/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "City assignment · Connect BDP",
};

/** CBDP-04 — City / unit assignment (display only; Platform assigns) */
export default async function ConnectBdpCityPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/city");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="City assignment" />
        <EmptyState
          title="No unit"
          description="Apply first to receive a platform city assignment."
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const tier = bundle.cityConfig
    ? String(bundle.cityConfig.tier ?? "")
    : "";
  const cap = tier ? cityTierCap(tier) : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="City assignment"
        description="Performance-protected assigned territory — not permanent city ownership. Caps are platform maxima, not guarantees."
        backHref="/dashboard/connect-bdp"
      />

      {bundle.cityAssignment && bundle.cityConfig ? (
        <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">
                {String(bundle.cityConfig.city ?? "Assigned city")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {bundle.cityConfig.state
                  ? String(bundle.cityConfig.state)
                  : null}
                {bundle.cityAssignment.zone_code
                  ? ` · Zone ${String(bundle.cityAssignment.zone_code)}`
                  : null}
              </p>
            </div>
            <StatusBadge
              label={String(bundle.cityAssignment.status ?? "active")}
              tone="success"
            />
          </div>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <dt className="text-muted-foreground">City tier</dt>
              <dd className="mt-1 font-medium">{cityTierLabel(tier)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tier maximum units</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {cap ?? "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Assignment is Platform-determined. This view does not imply exclusivity
            beyond what the backend assignment record states.
          </p>
        </section>
      ) : (
        <EmptyState
          title="No city assignment yet"
          description="Platform Ops assigns city/zone after application review. Connect BDP cannot self-assign territory."
        />
      )}

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.muted} p-5`}>
        <h2 className="text-sm font-semibold">Canonical city-tier caps</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>Tier 1 — max {CITY_TIER_MAX_UNITS.tier_1} Franchise Units</li>
          <li>Tier 2 — max {CITY_TIER_MAX_UNITS.tier_2} Franchise Units</li>
          <li>Tier 3 — max {CITY_TIER_MAX_UNITS.tier_3} Franchise Units</li>
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Stale 5/2/1 city-cap narratives are not used. Caps are maxima, not
          appointment guarantees.
        </p>
      </section>
    </main>
  );
}
