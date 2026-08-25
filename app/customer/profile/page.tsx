import Link from "next/link";
import { redirect } from "next/navigation";
import { CxPageHeader } from "@/components/customer/CxPageHeader";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { FeatureGated } from "@/components/states/FeatureGated";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";

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

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    displayName:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
  });

  return (
    <main className="mx-auto max-w-lg px-4 pb-28 pt-6">
      <CxPageHeader
        title="Profile"
        description="Personal identity only. Profile is not a role."
        backHref="/customer"
        backLabel="Home"
      />
      <ProfileSettingsForm
        email={user.email ?? null}
        initialDisplayName={identity.profile?.displayName ?? ""}
        initialPhone={identity.profile?.phone ?? ""}
      />
      <FeatureGated
        className="mt-6"
        mode="coming_later"
        title="Avatar upload"
        description="Avatar storage is not productized. Display name and phone persist via the identity API."
      />
      <div className="mt-6 flex flex-wrap gap-2">
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/settings">All settings</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/customer/bookings">Bookings</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/customer/claims">Claims</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/settings/workspaces">Workspaces</Link>
        </Button>
      </div>
    </main>
  );
}
