import Link from "next/link";
import { notFound } from "next/navigation";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getOfferDetail } from "@/lib/architecture/customer-cx";
import { ClaimOfferForm } from "./claim-form";

type Params = Promise<{ id: string }>;

export default async function CustomerOfferDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const admin = createPrivilegedSupabaseClient();
  let offer: Awaited<ReturnType<typeof getOfferDetail>> | null = null;
  try {
    offer = await getOfferDetail(admin, id);
  } catch {
    notFound();
  }
  if (!offer) notFound();

  const venue =
    offer.venue && typeof offer.venue === "object"
      ? (offer.venue as { display_name?: string; city?: string })
      : null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/customer/offers" className="text-sm underline">
        ← Offers
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {offer.title}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        {venue?.display_name} · {venue?.city}
      </p>
      <p className="mt-4 text-sm whitespace-pre-wrap">
        {offer.description ?? "No description."}
      </p>
      <div className="mt-4 text-sm">
        Campaign until {new Date(offer.campaignEndsAt).toLocaleString("en-IN")}{" "}
        · {offer.remainingClaims}/{offer.customerCap} claims remaining · claim
        valid {offer.claimValidityHours}h
      </div>
      <p className="mt-2 text-xs font-medium text-amber-800">
        Claiming this offer is not a purchase and is not recognised revenue.
      </p>
      {offer.remainingClaims > 0 ? (
        <ClaimOfferForm offerEventId={offer.id} />
      ) : (
        <p className="mt-6 text-sm text-red-700">Offer customer cap reached</p>
      )}
    </main>
  );
}
