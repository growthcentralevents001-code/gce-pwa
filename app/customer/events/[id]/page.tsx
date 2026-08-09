import Link from "next/link";
import { notFound } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { StickyBookingBar } from "@/components/customer/StickyBookingBar";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getEventDetail } from "@/lib/architecture/customer-cx";
import {
  formatInrMinor,
  formatWhen,
  venueDisplayName,
} from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Event · GCE Customer",
};

type Params = Promise<{ id: string }>;

export default async function CustomerEventDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const admin = createPrivilegedSupabaseClient();
  let event: Awaited<ReturnType<typeof getEventDetail>> | null = null;
  try {
    event = await getEventDetail(admin, id);
  } catch {
    notFound();
  }
  if (!event) notFound();

  const venueLabel = venueDisplayName(event.venue);
  const availability = event.soldOut
    ? "Sold out"
    : event.remainingCapacity != null
      ? `${event.remainingCapacity} left`
      : "Available";

  return (
    <main className="mx-auto max-w-5xl px-4 pb-36 pt-6 lg:pb-10">
      <CxPageHeader
        title={event.title}
        backHref="/customer/events"
        backLabel="Events"
        actions={
          event.category ? (
            <StatusBadge label={event.category} tone="info" />
          ) : null
        }
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 dark:from-orange-950/50 dark:via-neutral-900 dark:to-orange-950/20">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.22),transparent_50%)]"
              aria-hidden
            />
            <GlassPanel className="absolute inset-x-4 bottom-4 p-3 sm:inset-x-6">
              <p className="text-xs text-muted-foreground">When</p>
              <p className="text-sm font-medium">{formatWhen(event.starts_at)}</p>
              {venueLabel ? (
                <>
                  <p className="mt-2 text-xs text-muted-foreground">Where</p>
                  <p className="text-sm font-medium">{venueLabel}</p>
                </>
              ) : null}
            </GlassPanel>
          </div>

          <section>
            <h2 className="text-sm font-semibold">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {event.description ?? "No description."}
            </p>
          </section>

          <section className="rounded-xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Cancellation policy</p>
            <p className="mt-2">
              Default {event.policySummary.defaultCutoffHours}h · this event{" "}
              {event.policySummary.cutoffHours}h before start · policy{" "}
              {event.policySummary.policyVersion}.
            </p>
            <p className="mt-1">{event.policySummary.note}</p>
            <p className="mt-2">
              Intended MoR: Logixia Solutions Private Limited · live ticket
              payments gated OFF.
            </p>
          </section>

          <p className="text-sm">
            Ticket{" "}
            <span className="font-semibold">
              {formatInrMinor(event.price_minor, event.currency ?? "INR")}
            </span>{" "}
            · {availability}
          </p>

          {!event.soldOut ? (
            <Link
              href={`/customer/events/${event.id}/book`}
              className="hidden text-sm font-medium text-primary lg:inline"
            >
              Continue to booking →
            </Link>
          ) : null}
        </div>

        <StickyBookingBar
          eventId={event.id}
          priceMinor={event.price_minor}
          currency={event.currency ?? "INR"}
          soldOut={Boolean(event.soldOut)}
          availabilityLabel={availability}
        />
      </div>
    </main>
  );
}
