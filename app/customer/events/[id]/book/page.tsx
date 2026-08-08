import { redirect, notFound } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { BookingFlow } from "@/components/customer/BookingFlow";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getEventDetail } from "@/lib/architecture/customer-cx";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Book · GCE Customer",
};

type Params = Promise<{ id: string }>;

export default async function CustomerBookEventPage({
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
    redirect(`/login?next=${encodeURIComponent(`/customer/events/${id}/book`)}`);
  }

  const admin = createPrivilegedSupabaseClient();
  let event: Awaited<ReturnType<typeof getEventDetail>> | null = null;
  try {
    event = await getEventDetail(admin, id);
  } catch {
    notFound();
  }
  if (!event) notFound();

  if (event.soldOut) {
    return (
      <main className="mx-auto max-w-lg px-4 py-10">
        <CxPageHeader
          title="Sold out"
          description="This event has no remaining capacity according to the server."
          backHref={`/customer/events/${id}`}
          backLabel="Event"
        />
      </main>
    );
  }

  const maxQty =
    event.remainingCapacity != null
      ? Math.min(20, Math.max(1, event.remainingCapacity))
      : 10;

  return (
    <main className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <CxPageHeader
        title="Book tickets"
        description="Server validates inventory and issues tickets after sandbox confirm."
        backHref={`/customer/events/${id}`}
        backLabel="Event"
      />
      <BookingFlow
        eventId={event.id}
        eventTitle={event.title}
        policyVersion={event.cancel_policy_version}
        policyNote={event.policySummary.note}
        cutoffHours={event.policySummary.cutoffHours}
        priceMinor={event.price_minor}
        currency={event.currency ?? "INR"}
        maxQuantity={maxQty}
      />
    </main>
  );
}
