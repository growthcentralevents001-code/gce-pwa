import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCustomerDashboard } from "@/lib/architecture/customer-cx";

/**
 * Canonical customer CX dashboard (Phase 11).
 * Isolated from dirty /dashboard/venue and home WIP.
 */
export default async function CustomerCxPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/customer");
  }

  const admin = createPrivilegedSupabaseClient();
  let dashboard: Awaited<ReturnType<typeof getCustomerDashboard>> | null = null;
  try {
    dashboard = await getCustomerDashboard(admin, user.id);
  } catch {
    dashboard = null;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">My bookings</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Marketplace customer experience · payment capture gated OFF · API{" "}
        <code>/api/customer</code>
      </p>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link className="underline" href="/customer/events">
          Discover events
        </Link>
        <Link className="underline" href="/customer/offers">
          Discover offers
        </Link>
        <Link className="underline" href="/customer/tickets">
          Tickets
        </Link>
      </nav>

      {!dashboard ? (
        <p className="mt-6 text-sm text-neutral-600">
          Dashboard unavailable. Retry after sign-in refresh.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          <section className="rounded-lg border border-neutral-200 p-4">
            <h2 className="text-sm font-medium">Trust Rank</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Formula unresolved — display foundation only
            </p>
            <p className="mt-2 text-sm">
              Score {dashboard.trustRank.score} · level{" "}
              {dashboard.trustRank.levelLabel}
            </p>
          </section>

          <section className="rounded-lg border border-neutral-200 p-4">
            <h2 className="text-sm font-medium">Upcoming bookings</h2>
            {dashboard.upcomingBookings.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-600">None yet.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {dashboard.upcomingBookings.map((b) => {
                  const ev = Array.isArray(b.marketplace_events)
                    ? b.marketplace_events[0]
                    : b.marketplace_events;
                  return (
                    <li key={b.id} className="border-t border-neutral-100 pt-2">
                      <span className="font-medium">{ev?.title ?? "Event"}</span>
                      {" · "}
                      {b.status}
                      {" · qty "}
                      {b.quantity}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-neutral-200 p-4">
            <h2 className="text-sm font-medium">Active offer claims</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Claims are not purchases / not revenue
            </p>
            {dashboard.activeClaims.length === 0 ? (
              <p className="mt-2 text-sm text-neutral-600">No active claims.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {dashboard.activeClaims.map((c) => (
                  <li key={c.id} className="border-t border-neutral-100 pt-2">
                    {c.id.slice(0, 8)}… · expires{" "}
                    {c.expires_at
                      ? new Date(c.expires_at).toLocaleString("en-IN")
                      : "—"}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-neutral-200 p-4">
            <h2 className="text-sm font-medium">Refund requests</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Economics pending OD-006 — manual review required
            </p>
            {(dashboard.refundRequests ?? []).length === 0 ? (
              <p className="mt-2 text-sm text-neutral-600">None.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm">
                {dashboard.refundRequests.map((r) => (
                  <li key={r.id} className="border-t border-neutral-100 pt-2">
                    {r.status} · {r.amount_determination}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="text-xs text-neutral-500">
            Money flags OFF:{" "}
            {Object.entries(dashboard.moneyFlags)
              .map(([k, v]) => `${k}=${String(v)}`)
              .join(" · ")}
          </p>
        </div>
      )}
    </main>
  );
}
