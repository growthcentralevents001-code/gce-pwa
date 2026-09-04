import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, Tag, Ticket } from "lucide-react";
import { AnimatedSection } from "@/components/marketing/AnimatedSection";
import { ActiveClaimCard } from "@/components/customer/ActiveClaimCard";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { EventCard } from "@/components/customer/EventCard";
import { TicketPassCard } from "@/components/customer/TicketPassCard";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import {
  discoverEvents,
  getCustomerDashboard,
} from "@/lib/architecture/customer-cx";
import { bookingStatusTone } from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Customer home · GCE",
};

export default async function CustomerHomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer");

  const admin = createPrivilegedSupabaseClient();
  let dashboard: Awaited<ReturnType<typeof getCustomerDashboard>> | null =
    null;
  let featured: Awaited<ReturnType<typeof discoverEvents>>["items"] = [];
  try {
    dashboard = await getCustomerDashboard(admin, user.id);
  } catch {
    dashboard = null;
  }
  try {
    featured = (await discoverEvents(admin, { limit: 4 })).items;
  } catch {
    featured = [];
  }

  return (
    <div className="space-y-8 pb-8 lg:pb-0">
      <CxPageHeader
        title="Your activity"
        description="Tickets, bookings, and claims — what needs you today."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" className="min-h-11">
              <Link href="/customer/events">Browse events</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="min-h-11">
              <Link href="/customer/offers">Offers</Link>
            </Button>
          </div>
        }
      />

      {!dashboard ? (
        <EmptyState
          title="Dashboard unavailable"
          description="Try refreshing after signing in again."
          primaryAction={{ label: "Retry home", href: "/customer" }}
        />
      ) : (
        <div className="space-y-8">
          <AnimatedSection>
            <div className="grid gap-3 sm:grid-cols-3">
              <QuickTile
                href="/customer/bookings"
                icon={CalendarDays}
                label="Bookings"
                value={String(dashboard.upcomingBookings.length)}
              />
              <QuickTile
                href="/customer/tickets"
                icon={Ticket}
                label="Tickets"
                value={String(dashboard.tickets.length)}
              />
              <QuickTile
                href="/customer/claims"
                icon={Tag}
                label="Claims"
                value={String(dashboard.activeClaims.length)}
              />
            </div>
          </AnimatedSection>

          <section>
            <SectionHead title="Upcoming bookings" href="/customer/bookings" />
            {dashboard.upcomingBookings.length === 0 ? (
              <EmptyState
                title="No upcoming bookings"
                description="Discover Marketplace events to book."
                primaryAction={{ label: "Find events", href: "/customer/events" }}
              />
            ) : (
              <ul className="space-y-2">
                {dashboard.upcomingBookings.map((b) => {
                  const ev = Array.isArray(b.marketplace_events)
                    ? b.marketplace_events[0]
                    : b.marketplace_events;
                  return (
                    <li key={b.id}>
                      <Link
                        href={`/customer/bookings/${b.id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted/40"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {ev?.title ?? "Event"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            qty {b.quantity}
                          </p>
                        </div>
                        <StatusBadge
                          label={b.status}
                          tone={bookingStatusTone(b.status)}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section>
            <SectionHead title="Active tickets" href="/customer/tickets" />
            {dashboard.tickets.length === 0 ? (
              <EmptyState
                title="No tickets yet"
                description="Tickets appear after a confirmed booking."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboard.tickets.slice(0, 4).map((t) => {
                  const ev = Array.isArray(t.marketplace_events)
                    ? t.marketplace_events[0]
                    : t.marketplace_events;
                  return (
                    <TicketPassCard
                      key={t.id}
                      ticket={{
                        id: t.id,
                        ticketRef: t.ticket_ref,
                        status: t.status,
                        eventTitle: ev?.title,
                        startsAt: ev?.starts_at,
                        issuedAt: t.issued_at,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <SectionHead title="Active offer claims" href="/customer/claims" />
            {dashboard.activeClaims.length === 0 ? (
              <EmptyState
                title="No active claims"
                description="Claims are not purchases and are not revenue."
                primaryAction={{ label: "Browse offers", href: "/customer/offers" }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboard.activeClaims.map((c) => {
                  const offer = Array.isArray(c.marketplace_offer_events)
                    ? c.marketplace_offer_events[0]
                    : c.marketplace_offer_events;
                  return (
                    <ActiveClaimCard
                      key={c.id}
                      claim={{
                        id: c.id,
                        status: c.status,
                        expiresAt: c.expires_at,
                        offerTitle: offer?.title,
                        expired: c.expired,
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {(dashboard.refundRequests ?? []).length > 0 ? (
            <section>
              <h2 className="mb-3 text-sm font-semibold">Refund requests</h2>
              <ul className="space-y-2 text-sm">
                {dashboard.refundRequests.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-xl border border-border p-3"
                  >
                    <StatusBadge label={r.status} tone="pending" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Under review · amount determination:{" "}
                      {r.amount_determination ?? "pending"} (not calculated in UI)
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <SectionHead title="Featured events" href="/customer/events" />
            {featured.length === 0 ? (
              <EmptyState title="No published events right now" />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((e) => (
                  <EventCard
                    key={e.id}
                    event={{
                      id: e.id,
                      title: e.title,
                      category: e.category,
                      startsAt: e.startsAt,
                      priceMinor: e.priceMinor,
                      currency: e.currency,
                      venue: e.venue,
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function SectionHead({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      <Link href={href} className="text-xs font-medium text-primary">
        See all
      </Link>
    </div>
  );
}

function QuickTile({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.99] touch-manipulation"
    >
      <Icon className="h-4 w-4 text-primary" aria-hidden />
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </Link>
  );
}
