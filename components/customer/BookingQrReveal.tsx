"use client";

import { useState } from "react";
import { QrDisplay } from "@/components/customer/QrDisplay";
import { FeatureGated } from "@/components/states/FeatureGated";
import { takeBookingQrTokens } from "@/lib/frontend/customer/format";

/** Shows one-time sandbox QR tokens when present in session; otherwise gated note. */
export function BookingQrReveal({ bookingId }: { bookingId: string }) {
  const [tokens] = useState(() => takeBookingQrTokens(bookingId) ?? []);

  if (tokens.length === 0) {
    return (
      <FeatureGated
        mode="unavailable"
        title="QR shown at confirmation"
        description="Ticket QR payloads are issued once by the server at confirmation and are not re-fetched from ticket history. Keep your confirmation screen or ticket reference for venue check-in."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">
        Save these QR codes now — shown once from the server response.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {tokens.map((t, i) => (
          <QrDisplay
            key={`${i}-${t.slice(0, 8)}`}
            value={t}
            label={`Ticket ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
