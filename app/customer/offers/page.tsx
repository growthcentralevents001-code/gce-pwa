import Link from "next/link";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { discoverOffers } from "@/lib/architecture/customer-cx";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CustomerOffersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const city = typeof sp.city === "string" ? sp.city : null;
  const q = typeof sp.q === "string" ? sp.q : null;
  const admin = createPrivilegedSupabaseClient();
  let result: Awaited<ReturnType<typeof discoverOffers>> = {
    items: [],
    total: 0,
    limit: 20,
    offset: 0,
  };
  try {
    result = await discoverOffers(admin, { city, q, limit: 30 });
  } catch {
    // empty
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/customer" className="text-sm underline">
        ← My bookings
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Marketplace offers
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Active published Offer Events · claim ≠ revenue · 72h claim validity
      </p>
      <form className="mt-4 grid gap-2 sm:grid-cols-2" method="get">
        <input
          name="city"
          defaultValue={city ?? ""}
          placeholder="City"
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search"
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-neutral-900 px-3 py-2 text-sm text-white sm:col-span-2"
        >
          Filter
        </button>
      </form>
      <ul className="mt-6 space-y-3">
        {result.items.length === 0 ? (
          <li className="text-sm text-neutral-600">No active offers.</li>
        ) : (
          result.items.map((o) => (
            <li
              key={o.id}
              className="rounded-lg border border-neutral-200 p-4 text-sm"
            >
              <Link
                href={`/customer/offers/${o.id}`}
                className="font-medium underline"
              >
                {o.title}
              </Link>
              <div className="mt-1 text-xs text-neutral-600">
                {o.remainingClaims} claims left · validity{" "}
                {o.claimValidityHours}h
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
