import { notFound } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { ClaimOfferFlow } from "@/components/customer/ClaimOfferFlow";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getOfferDetail } from "@/lib/architecture/customer-cx";
import {
  formatWhen,
  venueDisplayName,
} from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Offer · GCE Customer",
};

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

  const venue = venueDisplayName(offer.venue);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pb-10">
      <CxPageHeader
        title={offer.title}
        backHref="/customer/offers"
        backLabel="Offers"
        actions={<StatusBadge label="Not a purchase" tone="warning" />}
      />

      <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-950/40 dark:via-neutral-900 dark:to-rose-950/30">
        <GlassPanel className="absolute inset-x-4 bottom-4 p-3">
          <p className="text-xs text-muted-foreground">Venue</p>
          <p className="text-sm font-medium">{venue || "—"}</p>
        </GlassPanel>
      </div>

      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
        {offer.description ?? "No description."}
      </p>

      <dl className="mt-6 grid gap-3 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Campaign ends</dt>
          <dd className="font-medium">{formatWhen(offer.campaignEndsAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Claim validity</dt>
          <dd className="font-medium">{offer.claimValidityHours}h after claim</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Claims remaining</dt>
          <dd className="font-medium">
            {offer.remainingClaims}/{offer.customerCap}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs font-medium text-amber-800 dark:text-amber-200">
        Claiming is not a purchase and is not recognised revenue. Availability
        is confirmed by the server at claim time.
      </p>

      <div className="mt-6">
        {offer.remainingClaims > 0 ? (
          <ClaimOfferFlow offerEventId={offer.id} />
        ) : (
          <p className="text-sm font-medium text-destructive">
            Offer customer cap reached
          </p>
        )}
      </div>
    </main>
  );
}
