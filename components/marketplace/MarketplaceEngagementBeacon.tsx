"use client";

import { useEffect, useRef } from "react";
import type { MarketplaceEngagementType } from "@/lib/architecture/marketplace/engagement";

export function MarketplaceEngagementBeacon({
  engagementType,
  subjectId,
  venueId,
}: {
  engagementType: MarketplaceEngagementType;
  subjectId: string;
  venueId?: string | null;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current || !subjectId) return;
    const key = `gce_eng:${engagementType}:${subjectId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      // sessionStorage unavailable — still attempt one record
    }

    sent.current = true;
    void fetch("/api/marketplace/engagement", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        engagementType,
        subjectId,
        venueId: venueId ?? null,
        source: "public",
      }),
    })
      .then((res) => {
        if (res.ok) {
          try {
            sessionStorage.setItem(key, "1");
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        sent.current = false;
      });
  }, [engagementType, subjectId, venueId]);

  return null;
}
