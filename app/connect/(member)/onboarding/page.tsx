import Link from "next/link";
import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { Timeline } from "@/components/connect/Timeline";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { membershipStatusTone } from "@/lib/frontend/connect/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Onboarding · GCE Connect",
};

export default async function ConnectOnboardingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/onboarding");

  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];

  const steps = [
    {
      id: "profile",
      title: "Profile",
      description: "Complete Batch 1 profile onboarding",
      tone: "success" as const,
    },
    {
      id: "membership",
      title: "Membership",
      description: primary
        ? `Status: ${primary.status}`
        : "Create or continue Associate membership",
      tone: primary ? ("pending" as const) : ("warning" as const),
    },
    {
      id: "kyc",
      title: "KYC boundary",
      description: primary?.kycCaseId
        ? `Case ${primary.kycCaseId.slice(0, 8)}…`
        : "KYC case starts when required by platform policy",
      tone: "neutral" as const,
    },
    {
      id: "allocation",
      title: "Circle allocation",
      description: primary
        ? primary.allocationStatus.replaceAll("_", " ")
        : "After activation — may remain temporarily unallocated",
      tone: "pending" as const,
    },
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Connect onboarding"
        description="Payment ≠ activation ≠ Circle allocation."
        backHref="/dashboard/connect-member"
      />

      {primary ? (
        <StatusBadge
          className="mb-4"
          label={primary.status}
          tone={membershipStatusTone(primary.status)}
        />
      ) : null}

      <Timeline items={steps} />

      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild className="min-h-11">
          <Link href="/onboarding/profile">Edit profile</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/connect/membership">Membership</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/connect/specialisation">Specialisation</Link>
        </Button>
      </div>
    </main>
  );
}
