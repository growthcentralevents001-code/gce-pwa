import Link from "next/link";
import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Profile · GCE Customer",
};

export default async function CustomerProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/customer/profile");

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-6">
      <CxPageHeader
        title="Profile"
        description="Account settings reuse Batch 1 onboarding."
        backHref="/customer"
        backLabel="Home"
      />
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4 text-sm">
        <p>
          Signed in as{" "}
          <span className="font-medium">{user.email ?? "account"}</span>
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild className="min-h-11">
            <Link href="/onboarding/profile">Edit profile</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/customer/bookings">Bookings</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/customer/claims">Claims</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/customer/wishlist">Wishlist</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
