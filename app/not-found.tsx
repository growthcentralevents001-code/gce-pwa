import Link from "next/link";
import { Compass, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GCE_SPACING, GCE_SURFACE } from "@/lib/frontend/design-language";
import { typography } from "@/lib/frontend/typography";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main
      className={cn(
        "flex min-h-[100dvh] items-center justify-center",
        GCE_SURFACE.warmHero,
        GCE_SPACING.pageNarrow
      )}
    >
      <div
        className={cn(
          GCE_SURFACE.card,
          "w-full max-w-md rounded-2xl p-8 text-center sm:p-10"
        )}
      >
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/50"
          aria-hidden
        >
          <Compass className="h-8 w-8" />
        </div>
        <p className="font-display text-5xl font-normal text-orange-600">404</p>
        <h1 className={cn(typography.pageTitle, "mt-3")}>Page not found</h1>
        <p className={cn(typography.helper, "mt-2")}>
          This page does not exist or has moved. Use the links below to continue.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="min-h-11">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden />
              Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/events">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              Browse events
            </Link>
          </Button>
        </div>
        <nav
          className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-border pt-6 text-sm"
          aria-label="Helpful links"
        >
          <Link className="text-orange-600 hover:underline" href="/offers">
            Offers
          </Link>
          <Link className="text-orange-600 hover:underline" href="/connect">
            GCE Connect
          </Link>
          <Link className="text-orange-600 hover:underline" href="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </main>
  );
}
