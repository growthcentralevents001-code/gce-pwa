import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { workspaceLabel } from "@/lib/frontend/workspace/labels";
import {
  GCE_RADIUS,
  GCE_SPACING,
  GCE_SURFACE,
} from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Workspaces · GCE",
};

/**
 * Architecture 2.0: /dashboard is a switcher / picker only.
 * Activity lives on assignment-scoped workspace homes.
 */
export default async function DashboardIndex() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
  });

  const allowed = identity.workspaces;

  return (
    <div className={GCE_SPACING.stack}>
      <PartnerPageHeader
        title="Choose a workspace"
        description="Use the workspace switcher in the sidebar, or open an assignment below. This page is not an activity dashboard — each workspace home shows what needs your attention."
      />
      {allowed.length === 0 ? (
        <EmptyState
          title="No workspaces available"
          description="Your account has no active workspace assignments yet."
          primaryAction={{
            label: "Personal workspace",
            href: "/dashboard/personal",
          }}
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {allowed.map((key) => (
            <li key={key}>
              <Link
                href={`/dashboard/${key}`}
                className={`${GCE_SURFACE.cardInteractive} ${GCE_RADIUS.card} flex min-h-11 items-center px-4 py-3 text-sm font-medium`}
              >
                {workspaceLabel(key)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
