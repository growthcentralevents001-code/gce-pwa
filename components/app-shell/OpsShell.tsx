"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { OPS_NAV_SECTIONS } from "@/lib/frontend/navigation/ops";
import { filterNavSections } from "@/lib/frontend/navigation/filter";
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
import { OpsSearch } from "@/components/ops/OpsSearch";
import { typography } from "@/lib/frontend/typography";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type OpsShellProps = {
  children: React.ReactNode;
  /** Presentation-only permission filter; server still authorizes routes. */
  permissions?: string[];
  userEmail?: string | null;
  /** Enable ops search when actor has ops.search (passed from layout). */
  canSearch?: boolean;
};

/**
 * Canonical /ops shell — Batch 8.
 * Dense operational chrome; orange/warm GCE language; no decorative blue.
 */
export function OpsShell({
  children,
  permissions,
  userEmail,
  canSearch = true,
}: OpsShellProps) {
  const [open, setOpen] = useState(false);
  const sections = filterNavSections(OPS_NAV_SECTIONS, { permissions });

  const nav = <SidebarNav sections={sections} dense className="px-1" />;

  return (
    <div className="flex min-h-screen bg-background">
      <SkipToContent />
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/ops" className={typography.brandMark}>
            GCE Ops
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-3">{nav}</div>
        {userEmail ? (
          <p className="truncate border-t border-border px-3 py-2 text-xs text-muted-foreground">
            {userEmail}
          </p>
        ) : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/95 px-4 backdrop-blur">
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Open ops navigation"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4">
                <SheetHeader className="mb-4">
                  <SheetTitle className={typography.brandMark}>
                    GCE Ops
                  </SheetTitle>
                </SheetHeader>
                {nav}
              </SheetContent>
            </Sheet>
            <span className="text-sm font-semibold">Operations</span>
          </div>
          <p className={cn("hidden text-sm text-muted-foreground lg:block")}>
            Control plane · scoped roles · money & live providers OFF
          </p>
          <div className="ml-auto flex items-center gap-2">
            <OpsSearch enabled={canSearch} />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications (coming soon)"
              disabled
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/personal">Workspaces</Link>
            </Button>
          </div>
        </header>
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
