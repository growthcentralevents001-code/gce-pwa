import Link from "next/link";
import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Wishlist · GCE Customer",
};

/** CUS-12 — P2; no canonical wishlist write path in Phase 11 CX. */
export default async function CustomerWishlistPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer/wishlist");

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-6">
      <CxPageHeader
        title="Wishlist"
        description="Saved Events / Offers"
        backHref="/customer"
        backLabel="Home"
      />
      <FeatureGated
        mode="coming_later"
        title="Wishlist not active on canonical CX"
        description="Legacy wishlist APIs are not the Phase 11 customer authority. This surface stays gated until a canonical wishlist contract is approved."
      />
      <Button asChild className="mt-6 min-h-11" variant="outline">
        <Link href="/customer/events">Browse events</Link>
      </Button>
    </main>
  );
}
