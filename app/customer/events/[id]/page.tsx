import Link from "next/link";
import { notFound } from "next/navigation";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getEventDetail } from "@/lib/architecture/customer-cx";
import { BookEventForm } from "./book-form";

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

  const venue =
    event.venue && typeof event.venue === "object"
      ? (event.venue as {
          display_name?: string;
          city?: string;
          address?: string;
        })
      : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/customer/events" className="text-sm underline">
        ← Events
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {event.title}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        {venue?.display_name} · {venue?.city}
      </p>
      <p className="mt-1 text-sm text-neutral-600">
        {new Date(event.starts_at).toLocaleString("en-IN")}
      </p>
      <p className="mt-4 text-sm whitespace-pre-wrap">
        {event.description ?? "No description."}
      </p>
      <div className="mt-4 text-sm">
        Ticket ₹{(Number(event.price_minor) / 100).toLocaleString("en-IN")} ·{" "}
        {event.soldOut
          ? "Sold out"
          : event.remainingCapacity != null
            ? `${event.remainingCapacity} left`
            : "Available"}
      </div>
      <div className="mt-4 rounded-lg border border-neutral-200 p-3 text-xs text-neutral-700">
        Cancellation: default {event.policySummary.defaultCutoffHours}h before
        start · this event {event.policySummary.cutoffHours}h · policy{" "}
        {event.policySummary.policyVersion}.{" "}
        {event.policySummary.note}
      </div>
      <div className="mt-2 text-xs text-neutral-500">
        Intended MoR: Logixia Solutions Private Limited · live ticket payments
        gated OFF
      </div>
      {!event.soldOut ? (
        <BookEventForm
          eventId={event.id}
          policyVersion={event.cancel_policy_version}
        />
      ) : (
        <p className="mt-6 text-sm font-medium text-red-700">Sold out</p>
      )}
    </main>
  );
}
