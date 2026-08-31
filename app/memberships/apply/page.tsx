import { redirect } from "next/navigation";
import Link from "next/link";
import { MembershipApplyWizard } from "@/components/connect/MembershipApplyWizard";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getProfile } from "@/lib/architecture/identity/profile";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Apply · Associate Membership",
};

/**
 * AUTH-gated Associate application wizard (FD-036).
 * Submits application for platform review — live purchase stays OFF.
 */
export default async function MembershipApplyPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/memberships/apply");
  }

  const profile = await getProfile(supabase, user.id).catch(() => null);
  if (!profile?.displayName?.trim()) {
    redirect("/onboarding/profile?next=/memberships/apply");
  }

  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  if (memberships.some((m) => m.status !== "draft")) {
    redirect("/connect/membership");
  }

  const prefill = {
    memberName:
      profile?.legalName ||
      profile?.displayName ||
      (user.user_metadata?.full_name as string | undefined) ||
      "",
    phone: profile?.phone ?? "",
    email: user.email ?? "",
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          GCE Connect
        </p>
        <h1 className="mt-2 font-body text-2xl font-semibold tracking-tight sm:text-3xl">
          Associate membership application
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose geography, specialisation, and Tags, then run an advisory seat
          check. Submitting sends your application for platform review — payment
          is not collected here.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Activation and Circle allocation remain separate (FD-036).
        </p>
      </div>

      <MembershipApplyWizard prefill={prefill} />

      <p className="mt-10 text-center text-sm text-muted-foreground">
        <Button asChild variant="link" className="h-auto p-0">
          <Link href="/memberships">Back to plans</Link>
        </Button>
      </p>
    </main>
  );
}
