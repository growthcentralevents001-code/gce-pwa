import Link from "next/link";
import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyBookings } from "@/lib/architecture/customer-cx";
import {
  bookingStatusTone,
  formatWhen,
} from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Bookings · GCE Customer",
};

export default async function CustomerBookingsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer/bookings");

  const admin = createPrivilegedSupabaseClient();
  let bookings: Awaited<ReturnType<typeof getMyBookings>> = [];
  try {
    bookings = await getMyBookings(admin, user.id);
  } catch {
    bookings = [];
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pb-10">
      <CxPageHeader
        title="Booking history"
        description="Statuses come from the Marketplace booking record — not client inventing."
        backHref="/customer"
        backLabel="Home"
      />

      {bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Your confirmed and past bookings will appear here."
          primaryAction={{ label: "Browse events", href: "/customer/events" }}
        />
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => {
            const ev = Array.isArray(b.marketplace_events)
              ? b.marketplace_events[0]
              : b.marketplace_events;
            return (
              <li key={b.id}>
                <Link
                  href={`/customer/bookings/${b.id}`}
                  className="block rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {ev?.title ?? "Event"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatWhen(ev?.starts_at)} · qty {b.quantity}
                      </p>
                    </div>
                    <StatusBadge
                      label={b.status}
                      tone={bookingStatusTone(b.status)}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
