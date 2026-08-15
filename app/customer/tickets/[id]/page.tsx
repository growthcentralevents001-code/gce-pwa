import { notFound, redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { OwnerCredentialReveal } from "@/components/customer/OwnerCredentialReveal";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyTickets } from "@/lib/architecture/customer-cx";
import {
  formatWhen,
  ticketStatusTone,
} from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Ticket · GCE Customer",
};

type Params = Promise<{ id: string }>;

export default async function CustomerTicketDetailPage({
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
    redirect(`/login?next=${encodeURIComponent(`/customer/tickets/${id}`)}`);
  }

  const admin = createPrivilegedSupabaseClient();
  let tickets: Awaited<ReturnType<typeof getMyTickets>> = [];
  try {
    tickets = await getMyTickets(admin, user.id);
  } catch {
    tickets = [];
  }
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) notFound();

  const ev = Array.isArray(ticket.marketplace_events)
    ? ticket.marketplace_events[0]
    : ticket.marketplace_events;

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-6">
      <CxPageHeader
        title="Ticket"
        backHref="/customer/tickets"
        backLabel="Tickets"
        actions={
          <StatusBadge
            label={ticket.status}
            tone={ticketStatusTone(ticket.status)}
          />
        }
      />

      <GlassPanel className="relative overflow-hidden p-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
          GCE Pass
        </p>
        <h2 className="mt-2 text-xl font-semibold">
          {ev?.title ?? "Marketplace event"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatWhen(ev?.starts_at)}
        </p>
        <div className="mt-6 border-t border-dashed border-border pt-4">
          <p className="text-xs text-muted-foreground">Ticket reference</p>
          <p className="font-mono text-lg font-medium tracking-wide">
            {ticket.ticket_ref}
          </p>
          {ticket.booking_id ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Booking · {ticket.booking_id.slice(0, 8)}…
            </p>
          ) : null}
          {ticket.checked_in_at ? (
            <p className="mt-2 text-xs text-success">
              Checked in {formatWhen(ticket.checked_in_at)}
            </p>
          ) : null}
        </div>
      </GlassPanel>

      <div className="mt-6">
        <p className="mb-3 text-sm text-muted-foreground">
          Venue check-in is verified by the server. This code is issued only to
          you.
        </p>
        <OwnerCredentialReveal key={ticket.id} kind="ticket" id={ticket.id} />
      </div>
    </main>
  );
}
