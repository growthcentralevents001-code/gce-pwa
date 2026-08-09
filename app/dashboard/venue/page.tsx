import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, CircleDollarSign, Store, TicketCheck } from "lucide-react";
import {
  PartnerPageHeader,
  KpiCard,
} from "@/components/partner";
import { PartnerStatusStrip } from "@/components/partner/PartnerStatusStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { PartnerRelationshipCard } from "@/components/marketplace/PartnerRelationshipCard";
import { EventManagementCard, OfferManagementCard } from "@/components/marketplace/EventOfferCards";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";
import {
  VENUE_PARTNER_ROLE_LABEL,
  formatMinorInr,
  venueStatusLabel,
  OFFER_CLAIM_VALIDITY_HOURS,
} from "@/lib/frontend/marketplace/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Venue Partner · GCE",
};

/** VEN-01 — Venue Partner overview (replaces legacy client dashboard) */
export default async function VenueDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/venue");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "venue",
  });

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id).catch(
    () => null
  );

  if (!identity.workspaces.includes("venue") && !bundle?.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader
          title={VENUE_PARTNER_ROLE_LABEL}
          description="Venue organisation workspace for Marketplace Events, Offers, bookings, and check-in."
        />
        <EmptyState
          title="No Venue workspace yet"
          description="Complete Venue onboarding or ask Platform Ops if you expect a venue_representative assignment."
          primaryAction={{ label: "Apply", href: "/venue/apply" }}
        />
      </main>
    );
  }

  if (!bundle?.venue || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader title={VENUE_PARTNER_ROLE_LABEL} />
        <EmptyState
          title="No Marketplace Venue linked"
          description="Link or apply for a Venue organisation to unlock operational tools."
          primaryAction={{ label: "Apply", href: "/venue/apply" }}
        />
      </main>
    );
  }

  const { report, venue, events, offers, bookings, claims, entitlements } =
    bundle;
  const venueShare = entitlements.reduce(
    (s, e) => s + Number(e.venue_share_minor ?? 0),
    0
  );

  const actions = [
    ...(report.status !== "active"
      ? [
          {
            id: "status",
            title: "Venue status action needed",
            description: venueStatusLabel(report.status),
            href: "/venue/profile",
            severity: "warning" as const,
          },
        ]
      : []),
    {
      id: "checkin",
      title: "Check-in console",
      description: "Handheld-first ticket verification",
      href: "/venue/check-in",
      severity: "info" as const,
      icon: TicketCheck,
    },
    {
      id: "offers",
      title: "Offer redemptions",
      description: `${claims.length} claim record(s) loaded`,
      href: "/venue/redemptions",
      severity: "info" as const,
    },
  ];

  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={report.displayName}
        description={`${report.city} · Marketplace Venue operations. Settlement/payout remain Finance Ops.`}
        actions={
          <Button asChild className="min-h-11">
            <Link href="/venue/events/new">New Event</Link>
          </Button>
        }
      />

      <PartnerStatusStrip
        items={[
          {
            id: "status",
            label: "Venue status",
            value: venueStatusLabel(report.status),
            tone: report.status === "active" ? "success" : "pending",
          },
          {
            id: "events",
            label: "Events",
            value: String(report.eventCount),
            tone: "neutral",
          },
          {
            id: "offers",
            label: "Offers",
            value: String(report.offerCount),
            tone: "neutral",
          },
          {
            id: "bookings",
            label: "Bookings (loaded)",
            value: String(bookings.length),
            tone: "neutral",
          },
        ]}
      />

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Events" value={`${report.eventCount}`} href="/venue/events" icon={Calendar} />
        <KpiCard label="Offers" value={`${report.offerCount}`} href="/venue/offers" icon={Store} />
        <KpiCard label="Claims" value={`${claims.length}`} href="/venue/redemptions" icon={TicketCheck} />
        <KpiCard
          label="Venue entitlement"
          value={formatMinorInr(venueShare)}
          hint="Backend shares only"
          href="/venue/entitlements"
          icon={CircleDollarSign}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <PartnerRelationshipCard
            mbdpUserId={report.attributedMbdpUserId}
            unitId={report.attributedUnitId}
          />
          <section>
            <h2 className="mb-3 text-base font-semibold">Recent Events</h2>
            {events.length === 0 ? (
              <EmptyState title="No Events yet" primaryAction={{ label: "Create", href: "/venue/events/new" }} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {events.slice(0, 4).map((e) => (
                  <EventManagementCard
                    key={String(e.id)}
                    title={String(e.title ?? "Event")}
                    status={String(e.status ?? "draft")}
                    startsAt={e.starts_at ? String(e.starts_at) : null}
                    capacity={typeof e.capacity === "number" ? e.capacity : null}
                    priceMinor={typeof e.price_minor === "number" ? e.price_minor : null}
                    href={`/venue/events/${e.id}`}
                  />
                ))}
              </div>
            )}
          </section>
          <section>
            <h2 className="mb-3 text-base font-semibold">Recent Offers</h2>
            {offers.length === 0 ? (
              <EmptyState title="No Offer Events yet" primaryAction={{ label: "Offers", href: "/venue/offers" }} />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {offers.slice(0, 4).map((o) => (
                  <OfferManagementCard
                    key={String(o.id)}
                    title={String(o.title ?? "Offer")}
                    status={String(o.status ?? "draft")}
                    campaignStartsAt={o.campaign_starts_at ? String(o.campaign_starts_at) : null}
                    campaignEndsAt={o.campaign_ends_at ? String(o.campaign_ends_at) : null}
                    customerCap={typeof o.customer_cap === "number" ? o.customer_cap : null}
                    claimsCount={typeof o.claims_count === "number" ? o.claims_count : null}
                    plannedValueMinor={
                      typeof o.planned_commercial_value_minor === "number"
                        ? o.planned_commercial_value_minor
                        : null
                    }
                    claimValidityHours={
                      typeof o.claim_validity_hours === "number"
                        ? o.claim_validity_hours
                        : OFFER_CLAIM_VALIDITY_HOURS
                    }
                  />
                ))}
              </div>
            )}
          </section>
        </div>
        <div className="space-y-6 lg:col-span-2">
          <PartnerActionCenter items={actions} />
          <PartnerCommercialSummary
            title="Venue entitlement summary"
            rows={[
              {
                id: "venue",
                label: "Gross Venue entitlement (loaded)",
                amountMinor: venueShare,
                emphasize: true,
                hint: "Backend-calculated venue_share_minor — not a client 80% calc",
              },
            ]}
            footerNote="Claim/redemption ≠ revenue. Settlement execution is gated."
          />
          <FeatureGated
            mode="disabled_in_environment"
            title="Venue Performance Rank"
            description="Invented Venue rank scores are not shown. Performance metrics use backend-approved counts only."
          />
        </div>
      </div>
      <p className="sr-only">Venue id {String(venue.id)}</p>
    </main>
  );
}
