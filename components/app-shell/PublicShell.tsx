"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Menu } from "lucide-react";
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
import { ScrollBlurOverlay } from "@/components/marketing/ScrollBlurOverlay";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { ThemeToggle } from "@/components/theme-toggle";
import { AccountMenu } from "@/components/app-shell/AccountMenu";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}

type PublicShellProps = {
  children: React.ReactNode;
  /** When true, omit the marketing footer (rare). */
  hideFooter?: boolean;
};

/**
 * Reusable public shell — branding + nav structure only.
 * Batch 1 owns marketing page content.
 * When signed in, Log in / Join are replaced by the account avatar.
 */
export function PublicShell({ children, hideFooter }: PublicShellProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { user, logout, isLoading } = useAuth();
  const nav = filterNavItems(PUBLIC_NAV);
  const auth = filterNavItems(PUBLIC_AUTH_NAV);

  async function handleSignOut() {
    setOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

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
            <LayoutGroup id="public-nav">
              <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
                {nav.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  const afterVerticals = item.id === "events";
                  return (
                    <span key={item.id} className="flex items-center">
                      {afterVerticals ? (
                        <span
                          aria-hidden
                          className="mx-2 h-4 w-px bg-border"
                        />
                      ) : null}
                      <Link
                        href={item.href}
                        className={cn(
                          "relative px-2.5 py-2 text-sm font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {active ? (
                          <motion.span
                            layoutId="public-nav-underline"
                            className="absolute inset-x-2 bottom-1 h-0.5 rounded-full bg-primary"
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 420, damping: 34 }
                            }
                          />
                        ) : null}
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </span>
                  );
                })}
              </nav>
            </LayoutGroup>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isLoading ? (
              <div
                className="h-8 w-8 animate-pulse rounded-full bg-muted"
                aria-hidden
              />
            ) : user ? (
              <AccountMenu
                displayName={user.name}
                userEmail={user.email}
                variant="public"
              />
            ) : (
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
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
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
                <div className="mt-4">
                  <ThemeToggle showLabel />
                </div>
                <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
                  <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    GCE
                  </p>
                  {nav.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isNavActive(pathname, item.href)
                          ? "bg-muted text-foreground"
                          : "text-foreground",
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!isLoading && user ? (
                    <>
                      <Link
                        href="/dashboard/personal"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Workspace
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => void handleSignOut()}
                        className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        Sign out
                      </button>
                    </>
                  ) : !isLoading ? (
                    auth.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.label}
                      </Link>
                    ))
                  ) : null}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <ScrollBlurOverlay />

      {!hideFooter ? <SiteFooter /> : null}
    </div>
  );
}
