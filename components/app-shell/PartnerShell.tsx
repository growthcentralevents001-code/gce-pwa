"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { isCanonicalWorkspaceKey } from "@/lib/frontend/workspace/labels";
import { workspaceNavSections } from "@/lib/frontend/navigation/workspace";
import { filterNavSections } from "@/lib/frontend/navigation/filter";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import { SkipToContent } from "@/components/layout/ContentContainer";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { AccountMenu } from "@/components/app-shell/AccountMenu";
import { typography } from "@/lib/frontend/typography";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type PartnerShellProps = {
  children: React.ReactNode;
  allowedWorkspaces: WorkspaceKey[];
  userEmail?: string | null;
  displayName?: string | null;
  roleLabel?: string;
  inactiveFeatureFlags?: string[];
  /** When set (e.g. /connect/* member CX), ignore URL workspace param. */
  forcedWorkspaceKey?: WorkspaceKey;
};

function workspaceFromPathname(pathname: string): WorkspaceKey | null {
  if (
    pathname.startsWith("/dashboard/connect-member") ||
    (pathname.startsWith("/connect/") && pathname !== "/connect")
  ) {
    return "connect-member";
  }
  if (
    pathname.startsWith("/dashboard/connect-bdp") ||
    pathname.startsWith("/connect-bdp")
  ) {
    return "connect-bdp";
  }
  if (
    pathname.startsWith("/dashboard/marketplace-bdp") ||
    pathname.startsWith("/marketplace-bdp")
  ) {
    return "marketplace-bdp";
  }
  if (
    pathname.startsWith("/dashboard/venue") ||
    (pathname.startsWith("/venue/") &&
      pathname !== "/venue/apply" &&
      !pathname.startsWith("/venue/plans"))
  ) {
    return "venue";
  }
  if (
    pathname.startsWith("/dashboard/enterprise-bdp") ||
    pathname.startsWith("/enterprise-bdp")
  ) {
    return "enterprise-bdp";
  }
  if (
    pathname.startsWith("/dashboard/enterprise-client") ||
    (pathname.startsWith("/enterprise/") &&
      pathname !== "/enterprise/signup" &&
      !pathname.startsWith("/enterprise/signup/"))
  ) {
    return "enterprise-client";
  }
  if (
    pathname === "/enterprise-expert" ||
    pathname.startsWith("/enterprise-expert/")
  ) {
    return "platform-ops";
  }
  if (
    pathname.startsWith("/dashboard/finance") ||
    pathname === "/finance" ||
    pathname.startsWith("/finance/")
  ) {
    return "finance";
  }
  return null;
}

/**
 * Desktop-first partner/workspace shell with responsive sidebar + drawer.
 */
export function PartnerShell({
  children,
  allowedWorkspaces,
  userEmail,
  displayName,
  roleLabel,
  inactiveFeatureFlags = [...INACTIVE_FEATURE_FLAGS],
  forcedWorkspaceKey,
}: PartnerShellProps) {
  const params = useParams();
  const pathname = usePathname() || "";
  const raw = typeof params?.workspaceKey === "string" ? params.workspaceKey : "";
  const fromUrl: WorkspaceKey | null = isCanonicalWorkspaceKey(raw) ? raw : null;
  const fromPath = workspaceFromPathname(pathname);
  let current: WorkspaceKey | null =
    forcedWorkspaceKey ?? fromUrl ?? fromPath;
  if (
    current &&
    allowedWorkspaces.length > 0 &&
    !allowedWorkspaces.includes(current)
  ) {
    current = allowedWorkspaces[0] ?? null;
  }
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = current
    ? filterNavSections(workspaceNavSections(current), {
        currentWorkspace: current,
        allowedWorkspaces,
        inactiveFeatureFlags,
      })
    : [];

  const sidebar = (
    <div className="flex h-full flex-col gap-4">
      <div className="px-2 pt-1">
        <Link href="/" className={cn(typography.brandMark, "block truncate")}>
          {collapsed ? "GCE" : "GCE Events"}
        </Link>
      </div>
      <div className="px-2">
        <WorkspaceSwitcher
          current={current}
          allowed={allowedWorkspaces}
          roleLabel={roleLabel}
          compact={collapsed}
        />
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <SidebarNav sections={sections} collapsed={collapsed} />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen min-w-0 overflow-x-hidden bg-background">
      <SkipToContent />
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border bg-card transition-[width] duration-200 lg:flex lg:flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex items-center justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((v) => !v)}
          >
            {collapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open navigation">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4">
                <SheetHeader className="mb-4">
                  <SheetTitle className={typography.brandMark}>
                    Workspace
                  </SheetTitle>
                </SheetHeader>
                {sidebar}
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium text-foreground">
              Partner workspace
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" aria-label="Notifications">
              <Link href="/settings/notifications">
                <Bell className="h-4 w-4" />
              </Link>
            </Button>
            <AccountMenu
              displayName={displayName}
              userEmail={userEmail}
              variant="partner"
            />
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
