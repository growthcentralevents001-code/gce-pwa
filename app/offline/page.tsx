"use client";

import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GCE_SPACING, GCE_SURFACE } from "@/lib/frontend/design-language";
import { typography } from "@/lib/frontend/typography";
import { cn } from "@/lib/utils";

export default function OfflinePage() {
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
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-950/50"
          aria-hidden
        >
          <WifiOff className="h-6 w-6" />
        </div>
        <h1 className={typography.pageTitle}>You are offline</h1>
        <p className={cn(typography.helper, "mt-2")}>
          Connectivity is required for live account, booking, Finance, and Ops
          data. Cached public pages may still open when available.
        </p>
        <Button
          type="button"
          className="mt-8 min-h-11"
          onClick={() => window.location.reload()}
        >
          Retry connection
        </Button>
      </div>
    </main>
  );
}
