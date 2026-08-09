import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerPageHeader, Timeline } from "@/components/partner";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import {
  applicationStatusLabel,
  formatMinorInr,
  packageCanonicalAmounts,
  packageOptionLabel,
  CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR,
} from "@/lib/frontend/partner/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Unit & package · Connect BDP",
};

/** CBDP-03 — Unit / package commercial status */
export default async function ConnectBdpUnitPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect-bdp/unit");

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id);

  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Unit & package" />
        <EmptyState
          title="No Franchise Unit yet"
          description="Submit an application to create your Connect BDP unit."
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const unit = bundle.unit;
  const amounts = packageCanonicalAmounts(String(unit.package_option));
  const report = bundle.report;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Unit & package"
        description="Package and activation status from platform records. Payment ≠ activation."
        backHref="/dashboard/connect-bdp"
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/connect-bdp/city">City assignment</Link>
          </Button>
        }
      />

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              {packageOptionLabel(String(unit.package_option))}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Unit {unit.id.slice(0, 8)} · Circles capacity max{" "}
              {String(unit.circles_capacity_max ?? 5)}
            </p>
          </div>
          <StatusBadge
            label={applicationStatusLabel(String(unit.application_status))}
            tone={
              unit.application_status === "active" ? "success" : "pending"
            }
          />
        </div>
        <dl className="mt-5 grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Package total</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {formatMinorInr(amounts.totalMinor)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Initial</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {formatMinorInr(amounts.initialMinor)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Recoverable</dt>
            <dd className="mt-1 font-semibold tabular-nums">
              {formatMinorInr(amounts.recoverableMinor)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          Finance recovery cap per cycle:{" "}
          {formatMinorInr(CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR)}. Activation
          requires Platform approval — Connect BDP cannot self-activate.
        </p>
      </section>

      {report ? (
        <PartnerCommercialSummary
          title="Recovery position"
          rows={[
            {
              id: "recovered",
              label: "Recovered to date",
              amountMinor: report.recoveredToDateMinor,
            },
            {
              id: "remaining",
              label: "Remaining recoverable",
              amountMinor: report.remainingRecoverableMinor,
              emphasize: true,
            },
            {
              id: "gross",
              label: "Gross commission (all entitlements)",
              amountMinor: report.grossEligibleCommissionMinor,
            },
            {
              id: "recoveryDed",
              label: "Recovery deductions applied",
              amountMinor: report.recoveryDeductionsMinor,
            },
            {
              id: "net",
              label: "Payable position (display)",
              amountMinor: report.netPayableCommissionMinor,
              hint: "Not a settlement execution",
            },
          ]}
        />
      ) : null}

      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <h2 className="text-base font-semibold">Activation timeline</h2>
        <div className="mt-4">
          <Timeline
            items={[
              {
                id: "draft",
                title: "Application created",
                at: unit.created_at ? String(unit.created_at) : null,
              },
              {
                id: "status",
                title: applicationStatusLabel(String(unit.application_status)),
                tone:
                  unit.application_status === "active" ? "success" : "pending",
              },
              ...(unit.activated_at
                ? [
                    {
                      id: "activated",
                      title: "Platform activation",
                      at: String(unit.activated_at),
                      tone: "success" as const,
                    },
                  ]
                : []),
            ]}
          />
        </div>
      </section>

      <FeatureGated
        mode="disabled_in_environment"
        title="Live package payment"
        description="Live payment capture and settlement flags remain inactive. Status recording may exist for sandbox/ops flows only."
      />
    </main>
  );
}
