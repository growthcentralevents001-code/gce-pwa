"use client";

import { useEffect, useState } from "react";
import { formatTimeRemaining } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

/** Client countdown against server-provided expiresAt — display only. */
export function ExpiryCountdown({
  expiresAt,
  className,
}: {
  expiresAt: string | null | undefined;
  className?: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const { label, urgent, expired } = formatTimeRemaining(expiresAt, now);

  return (
    <span
      className={cn(
        "tabular-nums text-sm font-medium",
        expired && "text-muted-foreground",
        urgent && !expired && "text-warning",
        !urgent && !expired && "text-foreground",
        className
      )}
      aria-live="polite"
    >
      {label}
    </span>
  );
}
