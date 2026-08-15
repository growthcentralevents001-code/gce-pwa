import { SettingsNav } from "@/components/settings/SettingsNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

/**
 * Canonical Settings shell — one IA for all roles.
 * Identity-level preferences live here; business profiles link out.
 */
export function SettingsShell({
  title,
  description,
  children,
  breadcrumbs,
  primaryAction,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  primaryAction?: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className={cn("mx-auto w-full max-w-6xl px-4 py-8 sm:px-6", GCE_SPACING.section)}
    >
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={
          breadcrumbs ?? [
            { label: "Settings", href: "/settings" },
            { label: title },
          ]
        }
        primaryAction={primaryAction}
      />
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="md:sticky md:top-20 md:w-56 md:shrink-0 lg:w-64">
          <SettingsNav />
        </aside>
        <div className="min-w-0 flex-1 space-y-6">{children}</div>
      </div>
    </main>
  );
}
