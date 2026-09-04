import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { BookingActions } from "@/components/customer/BookingActions";
import { BookingQrReveal } from "@/components/customer/BookingQrReveal";
import { BookingTimeline } from "@/components/customer/BookingTimeline";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyBookings, getMyTickets } from "@/lib/architecture/customer-cx";
import {
  bookingStatusTone,
  formatInrMinor,
  formatWhen,
} from "@/lib/frontend/customer/format";
import { BookingConfirmMotion } from "./confirm-motion";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Booking · GCE Customer",
};

type Params = Promise<{ id: string }>;

export default async function CustomerBookingDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/customer/bookings/${id}`)}`);
  }

  const admin = createPrivilegedSupabaseClient();
  let bookings: Awaited<ReturnType<typeof getMyBookings>> = [];
  let tickets: Awaited<ReturnType<typeof getMyTickets>> = [];
  try {
    [bookings, tickets] = await Promise.all([
      getMyBookings(admin, user.id),
      getMyTickets(admin, user.id),
    ]);
  } catch {
    bookings = [];
    tickets = [];
  }
  const booking = bookings.find((b) => b.id === id);
  if (!booking) notFound();
  const bookingTickets = tickets.filter((t) => t.booking_id === id);
  const firstTicket = bookingTickets[0];
  const checkedInAt =
    bookingTickets.find((t) => t.checked_in_at)?.checked_in_at ?? null;
  const metadata =
    typeof booking.metadata === "object" && booking.metadata
      ? (booking.metadata as Record<string, unknown>)
      : {};

  const ev = Array.isArray(booking.marketplace_events)
    ? booking.marketplace_events[0]
    : booking.marketplace_events;

  const isConfirmed = ["confirmed", "paid"].includes(booking.status);

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-6">
      <CxPageHeader
        title="Booking"
        backHref="/customer/bookings"
        backLabel="History"
        actions={
          <StatusBadge
            label={booking.status}
            tone={bookingStatusTone(booking.status)}
          />
        }
      />

      <BookingConfirmMotion celebrate={isConfirmed}>
        <GlassPanel className="p-5">
          <p className="text-xs text-muted-foreground">Reference</p>
          <p className="font-mono text-sm font-medium">{booking.id}</p>
          <h2 className="mt-4 text-lg font-semibold">
            {ev?.title ?? "Event"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatWhen(ev?.starts_at)} · qty {booking.quantity}
          </p>
          {booking.total_minor != null ? (
            <p className="mt-3 text-sm">
              Total{" "}
              <span className="font-semibold">
                {formatInrMinor(
                  booking.total_minor,
                  booking.currency ?? "INR"
                )}
              </span>
              {booking.status !== "paid" ? (
                <span className="ml-2 text-xs text-muted-foreground">
                  (not marked paid unless server says so)
                </span>
              ) : null}
            </p>
          ) : null}
        </GlassPanel>
      </BookingConfirmMotion>

      <FeatureGated
        className="mt-4"
        mode="disabled_in_environment"
        title="Payments gated"
        description="Live ticket payment capture remains OFF. Sandbox confirmation does not mean a paid capture succeeded."
      />

      <div className="mt-6 space-y-3">
        <BookingQrReveal bookingId={booking.id} />
        <div className="flex flex-wrap gap-2">
          <Button asChild className="min-h-11">
            <Link href="/customer/tickets">View tickets</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/customer">Customer home</Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="mb-3 text-sm font-semibold">Booking status</h3>
        <BookingTimeline
          booking={{
            status: booking.status,
            bookedAt: booking.created_at ? String(booking.created_at) : null,
            confirmedAt:
              isConfirmed && booking.updated_at
                ? String(booking.updated_at)
                : null,
            ticketIssuedAt: firstTicket?.issued_at
              ? String(firstTicket.issued_at)
              : null,
            checkedInAt: checkedInAt ? String(checkedInAt) : null,
            cancelledAt:
              typeof metadata.cancelledAt === "string"
                ? metadata.cancelledAt
                : null,
          }}
        />
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h3 className="mb-3 text-sm font-semibold">Manage booking</h3>
        <BookingActions
          bookingId={booking.id}
          bookingStatus={booking.status}
          eventStartsAt={ev?.starts_at}
          cancelCutoffHours={
            booking.cancel_cutoff_hours ?? ev?.cancel_cutoff_hours ?? null
          }
        />
      </div>
    </main>
  );
}
