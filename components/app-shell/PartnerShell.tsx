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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const current: WorkspaceKey | null =
    forcedWorkspaceKey ?? fromUrl ?? fromPath;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = current
    ? filterNavSections(workspaceNavSections(current), {
        currentWorkspace: current,
        allowedWorkspaces,
        inactiveFeatureFlags,
      })
    : [];

  const initials = (displayName || userEmail || "G")
    .slice(0, 2)
    .toUpperCase();

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
    <div className="flex min-h-screen bg-background">
      <SkipToContent />
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border bg-card transition-[width] duration-200 md:flex md:flex-col",
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
          <div className="flex items-center gap-2 md:hidden">
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications (coming soon)"
              disabled
            >
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{displayName || "Account"}</span>
                    {userEmail ? (
                      <span className="text-xs font-normal text-muted-foreground">
                        {userEmail}
                      </span>
                    ) : null}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/customer">Customer app</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ops">Operations</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/login">Sign out / switch account</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
