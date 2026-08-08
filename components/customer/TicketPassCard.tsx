"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { StatusBadge } from "@/components/states/StatusBadge";
import {
  formatWhen,
  ticketStatusTone,
} from "@/lib/frontend/customer/format";
import { cn } from "@/lib/utils";

export type TicketCardModel = {
  id: string;
  ticketRef: string;
  status: string;
  eventTitle?: string | null;
  startsAt?: string | null;
  issuedAt?: string | null;
};

/**
 * GCE TicketPassCard — inspired by 21st.dev Admit One / Ticket Confirmation
 * (22433, 6492, 13570). High-contrast stub aesthetic; QR on detail when available.
 */
export function TicketPassCard({
  ticket,
  className,
}: {
  ticket: TicketCardModel;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-foreground/25 bg-card shadow-md",
        "before:absolute before:left-0 before:top-1/2 before:h-6 before:w-6 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-background",
        "after:absolute after:right-0 after:top-1/2 after:h-6 after:w-6 after:translate-x-1/2 after:-translate-y-1/2 after:rounded-full after:bg-background",
        className
      )}
      whileHover={reduce ? undefined : { scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <Link
        href={`/customer/tickets/${ticket.id}`}
        className="block p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              GCE Pass
            </p>
            <h2 className="mt-1 line-clamp-2 text-base font-semibold">
              {ticket.eventTitle ?? "Event ticket"}
            </h2>
          </div>
          <StatusBadge
            label={ticket.status}
            tone={ticketStatusTone(ticket.status)}
          />
        </div>
        <div className="mt-4 border-t border-dashed border-border pt-3">
          <p className="font-mono text-sm font-medium tracking-wide">
            {ticket.ticketRef}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatWhen(ticket.startsAt ?? ticket.issuedAt)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
