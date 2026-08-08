import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { TicketPassCard } from "@/components/customer/TicketPassCard";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyTickets } from "@/lib/architecture/customer-cx";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Tickets · GCE Customer",
};

export default async function CustomerTicketsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer/tickets");

  const admin = createPrivilegedSupabaseClient();
  let tickets: Awaited<ReturnType<typeof getMyTickets>> = [];
  try {
    tickets = await getMyTickets(admin, user.id);
  } catch {
    tickets = [];
  }

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pb-10">
      <CxPageHeader
        title="My tickets"
        description="QR secrets are issued once at confirmation · venue validates server-side."
        backHref="/customer"
        backLabel="Home"
      />

      {tickets.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          description="Book an event to receive tickets after sandbox confirmation."
          primaryAction={{ label: "Browse events", href: "/customer/events" }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tickets.map((t) => {
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
    </main>
  );
}
