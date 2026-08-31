import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getProfile } from "@/lib/architecture/identity/profile";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";

export type SignedInMembershipCta = {
  href: string;
  heroLabel: string;
  cardLabel: string;
};

/**
 * Next step after identity for Associate / Connect orientation (FD-036).
 * Live Associate purchase UI is not shipped; never send signed-in users to /signup.
 * Eligible users (profile complete, no membership yet) go to the apply wizard.
 */
export async function resolveSignedInMembershipCta(
  userId: string
): Promise<SignedInMembershipCta> {
  const supabase = await createServerSupabaseClient();
  const profile = await getProfile(supabase, userId).catch(() => null);
  const profileIncomplete = !profile?.displayName?.trim();

  if (profileIncomplete) {
    return {
      href: "/onboarding/profile?next=/memberships/apply",
      heroLabel: "Continue",
      cardLabel: "Continue application",
    };
  }

  const memberships = await listMembershipsForUser(supabase, userId).catch(
    () => []
  );
  if (memberships.length > 0) {
    const draft = memberships.find((m) => m.status === "draft");
    if (draft) {
      return {
        href: "/memberships/apply",
        heroLabel: "Continue application",
        cardLabel: "Continue application",
      };
    }
    return {
      href: "/connect/membership",
      heroLabel: "View membership",
      cardLabel: "View membership",
    };
  }

  return {
    href: "/memberships/apply",
    heroLabel: "Continue",
    cardLabel: "Continue application",
  };
}
