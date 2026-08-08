"use client";

import Link from "next/link";
import { GlassPanel } from "@/components/marketing/GlassPanel";
import { Button } from "@/components/ui/button";
import { formatInrMinor } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

export function StickyBookingBar({
  eventId,
  priceMinor,
  currency = "INR",
  soldOut,
  availabilityLabel,
  className,
}: {
  eventId: string;
  priceMinor?: number | null;
  currency?: string;
  soldOut?: boolean;
  availabilityLabel?: string;
  className?: string;
}) {
  return (
    <>
      {/* Desktop sticky card */}
      <GlassPanel
        className={cn(
          "hidden p-4 lg:sticky lg:top-24 lg:block",
          className
        )}
      >
        <p className="text-sm text-muted-foreground">From</p>
        <p className="text-2xl font-semibold">
          {formatInrMinor(priceMinor, currency)}
        </p>
        {availabilityLabel ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {availabilityLabel}
          </p>
        ) : null}
        {soldOut ? (
          <p className="mt-4 text-sm font-medium text-destructive">Sold out</p>
        ) : (
          <Button asChild className="mt-4 w-full min-h-11">
            <Link href={`/customer/events/${eventId}/book`}>Book tickets</Link>
          </Button>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">
          Live ticket payments remain gated OFF · sandbox confirm when eligible
        </p>
      </GlassPanel>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-40 border-t border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {formatInrMinor(priceMinor, currency)}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {soldOut ? "Sold out" : availabilityLabel ?? "Availability from server"}
            </p>
          </div>
          {soldOut ? (
            <Button disabled className="min-h-11 shrink-0">
              Sold out
            </Button>
          ) : (
            <Button asChild className="min-h-11 shrink-0 touch-manipulation">
              <Link href={`/customer/events/${eventId}/book`}>Book</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
