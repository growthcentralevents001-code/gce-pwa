"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GCE_SPACING, GCE_SURFACE } from "@/lib/frontend/design-language";
import { typography } from "@/lib/frontend/typography";
import { cn } from "@/lib/utils";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error.digest ?? error.name);
  }, [error]);

  return (
    <main
      className={cn(
        "flex min-h-[100dvh] items-center justify-center bg-background",
        GCE_SPACING.pageNarrow
      )}
    >
      <div
        className={cn(
          GCE_SURFACE.card,
          "w-full max-w-md rounded-2xl p-8 text-center"
        )}
        role="alert"
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive"
          aria-hidden
        >
          <AlertCircle className="h-6 w-6" />
        </div>
        <h1 className={typography.pageTitle}>Something went wrong</h1>
        <p className={cn(typography.helper, "mt-2")}>
          Please try again. If the problem continues, return home or contact
          support.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button type="button" className="min-h-11" onClick={() => reset()}>
            Try again
          </Button>
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
