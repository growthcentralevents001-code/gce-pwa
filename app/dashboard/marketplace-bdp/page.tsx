import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PartnerPageHeader,
  Timeline,
} from "@/components/partner";
import { PartnerStatusStrip } from "@/components/partner/PartnerStatusStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import type { PartnerActionItem } from "@/components/partner/PartnerActionCenter";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { PartnerPipelineList } from "@/components/partner/PartnerPipelineList";
import { MarketplaceUnitCard } from "@/components/marketplace/MarketplaceUnitCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import {
  ATTRIBUTED_SPLIT_COPY,
  MARKETPLACE_BDP_ROLE_LABEL,
  MBDP_PERSON_MAX_UNITS,
  MBDP_STANDARD_MAX_VENUES,
          UNATTRIBUTED_SPLIT_COPY,
          mbdpPackageOptionLabel,
          venueStatusLabel,
} from "@/lib/frontend/marketplace/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Marketplace BDP · GCE",
};

/** MBDP-01 — Marketplace BDP overview (Checkpoint C) */
export default async function MarketplaceBdpDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/marketplace-bdp");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "marketplace-bdp",
  });

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id).catch(
    () => null
  );

  if (!identity.workspaces.includes("marketplace-bdp") && !bundle?.unit) {
    return (
      <div className="mx-auto max-w-3xl">
        <PartnerPageHeader
          title={MARKETPLACE_BDP_ROLE_LABEL}
          description="Sole Marketplace venue onboarding field relationship — venue-attribution based, not city ownership."
        />
        <EmptyState
          title="No Marketplace BDP workspace yet"
          description="Apply for a Franchise Unit, or ask Platform Ops if you expect an assignment. Marketplace Affiliate is inactive."
          primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }}
        />
      </div>
    );
  }

  if (!bundle?.unit || !bundle.report) {
    return (
      <div className="mx-auto max-w-3xl">
        <PartnerPageHeader title={MARKETPLACE_BDP_ROLE_LABEL} />
        <EmptyState
          title="Start your application"
          primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }}
        />
      </div>
    );
  }

  const { report, unit, attributions, venues } = bundle;
  const stages = [
    {
      id: "proposed",
      label: "Proposed attribution",
      count: attributions.filter((a) => a.status === "proposed").length,
      description: "Awaiting Platform confirmation — recommend ≠ approve.",
    },
    {
      id: "active",
      label: "Active attributed venues",
      count: attributions.filter((a) => a.status === "active").length,
    },
    {
      id: "other",
      label: "Other states",
      count: attributions.filter(
        (a) => !["proposed", "active"].includes(String(a.status))
      ).length,
    },
  ];

  const actions: PartnerActionItem[] = [
    ...(report.applicationStatus !== "active"
      ? [
          {
            id: "unit",
            title: "Unit activation pending",
            description: String(report.applicationStatus).replace(/_/g, " "),
            href: "/marketplace-bdp/units",
            severity: "warning" as const,
          },
        ]
      : []),
    ...(report.proposedAttributions > 0
      ? [
          {
            id: "attr",
            title: `${report.proposedAttributions} proposed attribution(s)`,
            description: "Platform confirmation required.",
            href: "/marketplace-bdp/attribution",
            severity: "warning" as const,
          },
        ]
      : []),
    {
      id: "venues",
      title: "Venue portfolio",
      description: "Review onboarding and operational alerts.",
      href: "/marketplace-bdp/venues",
      severity: "info" as const,
      icon: "store" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <PartnerPageHeader
        title="Marketplace BDP overview"
        description="Venue onboarding recommendations, portfolio, and entitlement display. Platform Marketplace Ops final-approves. Settlement remains Finance Ops."
        actions={
          <Button asChild className="min-h-11">
            <Link href="/marketplace-bdp/venues">Venues</Link>
          </Button>
        }
      />

      <PartnerStatusStrip
        items={[
          {
            id: "app",
            label: "Application",
            value: String(report.applicationStatus).replace(/_/g, " "),
            tone:
              report.applicationStatus === "active" ? "success" : "pending",
          },
          {
            id: "pkg",
            label: "Package",
            value: mbdpPackageOptionLabel(report.packageOption),
            tone: "info",
          },
          {
            id: "cap",
            label: "Unit capacity",
            value: `${report.activeVenueCount} / ${report.venueCapacity}`,
            tone: "neutral",
          },
          {
            id: "person",
            label: "Person limits",
            value: `${bundle.units.length}/${MBDP_PERSON_MAX_UNITS} units · max ${MBDP_STANDARD_MAX_VENUES}`,
            tone: "neutral",
          },
        ]}
      />

      <PartnerActionCenter items={actions} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <MarketplaceUnitCard
            unitLabel={`Unit ${String(unit.id).slice(0, 8)}`}
            status={String(unit.application_status ?? report.applicationStatus)}
            activeVenues={report.activeVenueCount}
            capacity={report.venueCapacity}
            unitIndex={1}
            totalUnits={bundle.units.length}
            href="/marketplace-bdp/units"
          />
          <PartnerPipelineList
            title="Venue onboarding / attribution pipeline"
            stages={stages}
          />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <PartnerCommercialSummary
            rows={[
              {
                id: "gross",
                label: "Gross MBDP entitlement",
                amountMinor: report.grossMbdpEntitlementMinor,
                hint: ATTRIBUTED_SPLIT_COPY,
              },
              {
                id: "recovery",
                label: "Recovery deductions",
                amountMinor: report.recoveryDeductionsMinor,
              },
              {
                id: "net",
                label: "Payable position (display)",
                amountMinor: report.netMbdpPayableMinor,
                emphasize: true,
                hint: "Not settlement execution",
              },
            ]}
            footerNote={UNATTRIBUTED_SPLIT_COPY}
          />
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold">Recent portfolio signals</h2>
        <div className="mt-4">
          <Timeline
            items={venues.slice(0, 5).map((v) => ({
              id: String(v.id),
              title: String(v.display_name ?? "Venue"),
              description: venueStatusLabel(String(v.status ?? "")),
              at: v.created_at ? String(v.created_at) : null,
            }))}
          />
        </div>
      </section>
    </div>
  );
}
