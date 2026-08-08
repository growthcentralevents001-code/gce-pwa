import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyTickets } from "@/lib/architecture/customer-cx";

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
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/customer" className="text-sm underline">
        ← My bookings
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">My tickets</h1>
      <p className="mt-2 text-sm text-neutral-600">
        QR secrets are not stored client-side after issue · venue validates
        server-side
      </p>
      <ul className="mt-6 space-y-3">
        {tickets.length === 0 ? (
          <li className="text-sm text-neutral-600">No tickets yet.</li>
        ) : (
          tickets.map((t) => {
            const ev = Array.isArray(t.marketplace_events)
              ? t.marketplace_events[0]
              : t.marketplace_events;
            return (
              <li
                key={t.id}
                className="rounded-lg border border-neutral-200 p-4 text-sm"
              >
                <div className="font-medium">{t.ticket_ref}</div>
                <div className="mt-1 text-xs text-neutral-600">
                  {ev?.title ?? "Event"} · {t.status}
                  {t.issued_at
                    ? ` · issued ${new Date(t.issued_at).toLocaleString("en-IN")}`
                    : ""}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </main>
  );
}
