export type BookingTimelineStage =
  | "booked"
  | "confirmed"
  | "ticket_issued"
  | "checked_in"
  | "cancelled"
  | "refund_pending";

export type BookingTimelineStep = {
  stage: BookingTimelineStage;
  label: string;
  done: boolean;
  current: boolean;
  at?: string | null;
};

/** Backend-derived booking journey — never invent check-in without ticket evidence. */
export function deriveBookingTimeline(input: {
  bookingStatus: string;
  bookedAt?: string | null;
  confirmedAt?: string | null;
  ticketIssuedAt?: string | null;
  checkedInAt?: string | null;
  cancelledAt?: string | null;
}): BookingTimelineStep[] {
  const status = input.bookingStatus;
  const cancelled = status === "cancelled" || status === "voided";
  const refundPending = status === "refund_pending";
  const checkedIn = Boolean(input.checkedInAt);
  const confirmed = ["confirmed", "paid", "refund_pending", "cancelled"].includes(
    status
  );
  const hasTicket = Boolean(input.ticketIssuedAt);

  if (cancelled || refundPending) {
    return [
      {
        stage: "booked",
        label: "Booked",
        done: true,
        current: false,
        at: input.bookedAt ?? null,
      },
      {
        stage: "confirmed",
        label: "Confirmed",
        done: confirmed,
        current: false,
        at: input.confirmedAt ?? null,
      },
      {
        stage: refundPending ? "refund_pending" : "cancelled",
        label: refundPending ? "Refund pending" : "Cancelled",
        done: true,
        current: true,
        at: input.cancelledAt ?? null,
      },
    ];
  }

  const steps: BookingTimelineStep[] = [
    {
      stage: "booked",
      label: "Booked",
      done: true,
      current: !confirmed && !hasTicket && !checkedIn,
      at: input.bookedAt ?? null,
    },
    {
      stage: "confirmed",
      label: "Confirmed",
      done: confirmed,
      current: confirmed && !hasTicket && !checkedIn,
      at: input.confirmedAt ?? null,
    },
    {
      stage: "ticket_issued",
      label: "Ticket issued",
      done: hasTicket,
      current: hasTicket && !checkedIn,
      at: input.ticketIssuedAt ?? null,
    },
    {
      stage: "checked_in",
      label: "Checked in",
      done: checkedIn,
      current: checkedIn,
      at: input.checkedInAt ?? null,
    },
  ];

  return steps;
}
