import { redirect } from "next/navigation";

type Params = Promise<{ eventId: string }>;

/**
 * Legacy booking route → canonical customer book flow.
 * Retires duplicate booking truth (Batch 2).
 */
export default async function LegacyBookingRedirect({
  params,
}: {
  params: Params;
}) {
  const { eventId } = await params;
  redirect(`/customer/events/${eventId}/book`);
}
