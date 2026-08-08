"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Bell } from "lucide-react";
import { PUBLIC_AUTH_NAV, PUBLIC_NAV } from "@/lib/frontend/navigation/public";
import { filterNavItems } from "@/lib/frontend/navigation/filter";
import { typography } from "@/lib/frontend/typography";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SkipToContent } from "@/components/layout/ContentContainer";
import { cn } from "@/lib/utils";

type PublicShellProps = {
  children: React.ReactNode;
  /** When true, omit the marketing footer (rare). */
  hideFooter?: boolean;
};

/**
 * Reusable public shell — branding + nav structure only.
 * Batch 1 owns marketing page content.
 */
export function PublicShell({ children, hideFooter }: PublicShellProps) {
  const [open, setOpen] = useState(false);
  const nav = filterNavItems(PUBLIC_NAV);
  const auth = filterNavItems(PUBLIC_AUTH_NAV);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SkipToContent />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(typography.brandMark, "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring")}
            >
              GCE Events
            </Link>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
              {nav.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Notifications (coming soon)"
              disabled
            >
              <Bell className="h-4 w-4" />
            </Button>
            <div className="hidden items-center gap-2 sm:flex">
              {auth.map((item) => (
                <Button
                  key={item.id}
                  asChild
                  variant={item.id === "signup" ? "default" : "outline"}
                  size="sm"
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[18rem]">
                <SheetHeader>
                  <SheetTitle className={typography.brandMark}>
                    GCE Events
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                  {[...nav, ...auth].map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {!hideFooter ? (
        <footer className="mt-auto border-t border-border bg-background px-6 py-8">
          <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
            <p className={typography.brandMark}>GCE Events</p>
            <p className="mt-2">© 2026 Growth Central Events. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6">
              <Link href="/about" className="hover:text-foreground">
                About
              </Link>
              <Link href="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link href="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
