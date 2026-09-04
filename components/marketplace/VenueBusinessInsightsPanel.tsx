import { KpiCard } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import type { VenueBusinessInsights } from "@/lib/architecture/marketplace/insights";

type Props = {
  insights: VenueBusinessInsights;
};

function formatDelta(value: number | null): string {
  if (value == null) return "—";
  if (value > 0) return `+${value}`;
  return String(value);
}

export function VenueBusinessInsightsPanel({ insights }: Props) {
  const { customers, period, visibility, engagement, trends, listingPerformance } =
    insights;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-base font-semibold">Customer reach</h2>
        <p className="text-sm text-muted-foreground">{insights.definition}</p>
        <p className="text-xs text-muted-foreground">
          Last {period.days} days ({new Date(period.start).toLocaleDateString()} –{" "}
          {new Date(period.end).toLocaleDateString()}). Aggregate only — no
          customer PII exposed.
        </p>
        {!insights.hasQualifyingActivity ? (
          <EmptyState
            title="No qualifying customer activity yet"
            description="Bookings, check-ins, confirmed visits, and redemptions will appear here when they occur. Page views are tracked separately under Visibility."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Unique customers (period)"
              value={String(customers.uniqueInPeriod)}
              hint={`${customers.uniqueAllTime} all-time`}
            />
            <KpiCard
              label="First-time (period)"
              value={String(customers.firstTimeInPeriod)}
              hint={
                customers.newSharePercent != null
                  ? `${customers.newSharePercent}% of period reach`
                  : undefined
              }
            />
            <KpiCard
              label="Returning (period)"
              value={String(customers.returningInPeriod)}
              hint={
                customers.returningSharePercent != null
                  ? `${customers.returningSharePercent}% of period reach`
                  : undefined
              }
            />
            <KpiCard
              label="Repeat customers (all-time)"
              value={String(customers.repeatAllTime)}
              hint="2+ qualifying activities at this Venue"
            />
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Visibility</h2>
        <p className="text-sm text-muted-foreground">
          Discovery signals only — views are not counted as customers or repeat
          business.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            label="Venue profile views"
            value={String(visibility.venueViewsInPeriod)}
            hint={`${visibility.venueViewsAllTime} all-time`}
          />
          <KpiCard
            label="Event listing views"
            value={String(visibility.eventViewsInPeriod)}
            hint={`${visibility.eventViewsAllTime} all-time`}
          />
          <KpiCard
            label="Offer listing views"
            value={String(visibility.offerViewsInPeriod)}
            hint={`${visibility.offerViewsAllTime} all-time`}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Engagement activity</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Bookings" value={String(engagement.bookingsInPeriod)} />
          <KpiCard label="Check-ins" value={String(engagement.checkInsInPeriod)} />
          <KpiCard label="Offer visits" value={String(engagement.visitsInPeriod)} />
          <KpiCard
            label="Redemptions"
            value={String(engagement.redemptionsInPeriod)}
          />
        </div>
      </section>

      {insights.hasQualifyingActivity && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Period comparison</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <KpiCard
              label="Unique customers vs prior period"
              value={formatDelta(trends.uniqueCustomersDelta)}
            />
            <KpiCard
              label="Qualifying activities vs prior period"
              value={formatDelta(trends.qualifyingActivitiesDelta)}
            />
            <KpiCard
              label="Visibility views vs prior period"
              value={formatDelta(trends.visibilityViewsDelta)}
            />
          </div>
        </section>
      )}

      {insights.observations.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-base font-semibold">Observations</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {insights.observations.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Observations describe recorded activity only. They do not guarantee
            growth, revenue, or future referrals.
          </p>
        </section>
      )}

      {(listingPerformance.events.some((e) => e.uniqueCustomers > 0) ||
        listingPerformance.offers.some((o) => o.uniqueCustomers > 0)) && (
        <>
          <section className="space-y-3">
            <h2 className="text-base font-semibold">Event customer reach</h2>
            <PartnerDataTable
              rows={listingPerformance.events
                .filter((e) => e.bookings > 0 || e.checkIns > 0 || e.uniqueCustomers > 0)
                .map((r) => ({ ...r, id: r.eventId }))}
              mobileTitle={(r) => r.title}
              columns={[
                { id: "title", header: "Event", cell: (r) => r.title },
                {
                  id: "customers",
                  header: "Unique customers",
                  cell: (r) => String(r.uniqueCustomers),
                },
                { id: "bookings", header: "Bookings", cell: (r) => String(r.bookings) },
                {
                  id: "checkins",
                  header: "Check-ins",
                  cell: (r) => String(r.checkIns),
                  hideOnMobile: true,
                },
              ]}
              empty={
                <EmptyState title="No event engagement yet" primaryAction={undefined} />
              }
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold">Offer customer reach</h2>
            <PartnerDataTable
              rows={listingPerformance.offers
                .filter((o) => o.visits > 0 || o.redemptions > 0 || o.uniqueCustomers > 0)
                .map((r) => ({ ...r, id: r.offerId }))}
              mobileTitle={(r) => r.title}
              columns={[
                { id: "title", header: "Offer", cell: (r) => r.title },
                {
                  id: "customers",
                  header: "Unique customers",
                  cell: (r) => String(r.uniqueCustomers),
                },
                { id: "visits", header: "Visits", cell: (r) => String(r.visits) },
                {
                  id: "redemptions",
                  header: "Redemptions",
                  cell: (r) => String(r.redemptions),
                },
              ]}
              empty={
                <EmptyState title="No offer engagement yet" primaryAction={undefined} />
              }
            />
          </section>
        </>
      )}
    </div>
  );
}
