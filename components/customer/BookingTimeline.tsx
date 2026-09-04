"use client";

import { deriveBookingTimeline } from "@/lib/architecture/customer-cx/booking-timeline";
import { formatWhen } from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

export function BookingTimeline({
  booking,
  className,
}: {
  booking: {
    status: string;
    bookedAt?: string | null;
    confirmedAt?: string | null;
    ticketIssuedAt?: string | null;
    checkedInAt?: string | null;
    cancelledAt?: string | null;
  };
  className?: string;
}) {
  const steps = deriveBookingTimeline({
    bookingStatus: booking.status,
    bookedAt: booking.bookedAt,
    confirmedAt: booking.confirmedAt,
    ticketIssuedAt: booking.ticketIssuedAt,
    checkedInAt: booking.checkedInAt,
    cancelledAt: booking.cancelledAt,
  });

  return (
    <ol className={cn("space-y-2", className)} aria-label="Booking timeline">
      {steps.map((step) => (
        <li
          key={step.stage}
          className={cn(
            "flex items-start gap-3 rounded-lg border px-3 py-2 text-sm",
            step.current
              ? "border-primary/40 bg-primary/5"
              : step.done
                ? "border-border bg-muted/30"
                : "border-border/60 opacity-60"
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
              step.done
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
            aria-hidden
          >
            {step.done ? "✓" : "·"}
          </span>
          <div className="min-w-0">
            <p className="font-medium">{step.label}</p>
            {step.at ? (
              <p className="text-xs text-muted-foreground">{formatWhen(step.at)}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
