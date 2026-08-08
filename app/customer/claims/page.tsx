import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { ActiveClaimCard } from "@/components/customer/ActiveClaimCard";
import { ClaimTokenReveal } from "@/components/customer/ClaimTokenReveal";
import { NonPurchaseFeedback } from "@/components/customer/NonPurchaseFeedback";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getMyClaims } from "@/lib/architecture/customer-cx";
import { claimStatusTone, formatWhen } from "@/lib/frontend/customer/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Claims · GCE Customer",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CustomerClaimsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const focus = typeof sp.focus === "string" ? sp.focus : null;

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer/claims");

  const admin = createPrivilegedSupabaseClient();
  let claims: Awaited<ReturnType<typeof getMyClaims>> = [];
  try {
    claims = await getMyClaims(admin, user.id);
  } catch {
    claims = [];
  }

  const focused = focus ? claims.find((c) => c.id === focus) : null;
  const active = claims.filter((c) => c.status === "claimed" && !c.expired);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:pb-10">
      <CxPageHeader
        title="Offer claims"
        description="Claims are not purchases and are not revenue. Venue staff redeem."
        backHref="/customer"
        backLabel="Home"
      />

      {focused ? (
        <section className="mb-8 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">
              {(Array.isArray(focused.marketplace_offer_events)
                ? focused.marketplace_offer_events[0]
                : focused.marketplace_offer_events
              )?.title ?? "Claim"}
            </h2>
            <StatusBadge
              label={focused.expired ? "expired" : focused.status}
              tone={claimStatusTone(focused.status, focused.expired)}
            />
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Claimed {formatWhen(focused.claimed_at)} · expires{" "}
            {formatWhen(focused.expires_at)}
          </p>
          <ClaimTokenReveal
            claimId={focused.id}
            expiresAt={focused.expires_at}
          />
          <NonPurchaseFeedback
            className="mt-6"
            claimId={focused.id}
            offerEventId={focused.offer_event_id}
          />
        </section>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-semibold">Active</h2>
        {active.length === 0 ? (
          <EmptyState
            title="No active claims"
            description="Claim an offer to get a time-limited venue code."
            primaryAction={{ label: "Browse offers", href: "/customer/offers" }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {active.map((c) => {
              const offer = Array.isArray(c.marketplace_offer_events)
                ? c.marketplace_offer_events[0]
                : c.marketplace_offer_events;
              return (
                <ActiveClaimCard
                  key={c.id}
                  claim={{
                    id: c.id,
                    status: c.status,
                    expiresAt: c.expires_at,
                    offerTitle: offer?.title,
                    expired: c.expired,
                  }}
                />
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">All claims</h2>
        {claims.length === 0 ? (
          <p className="text-sm text-muted-foreground">None yet.</p>
        ) : (
          <ul className="space-y-2">
            {claims.map((c) => {
              const offer = Array.isArray(c.marketplace_offer_events)
                ? c.marketplace_offer_events[0]
                : c.marketplace_offer_events;
              return (
                <li key={c.id}>
                  <a
                    href={`/customer/claims?focus=${c.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm hover:bg-muted/40"
                  >
                    <span className="truncate font-medium">
                      {offer?.title ?? c.id.slice(0, 8)}
                    </span>
                    <StatusBadge
                      label={c.expired ? "expired" : c.status}
                      tone={claimStatusTone(c.status, c.expired)}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
