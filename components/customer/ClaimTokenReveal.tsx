"use client";

import { useState } from "react";
import { QrDisplay } from "@/components/customer/QrDisplay";
import { ExpiryCountdown } from "@/components/customer/ExpiryCountdown";
import { FeatureGated } from "@/components/states/FeatureGated";
import { peekClaimToken } from "@/lib/frontend/customer/format";

export function ClaimTokenReveal({
  claimId,
  expiresAt,
}: {
  claimId: string;
  expiresAt?: string | null;
}) {
  const [token] = useState(() => peekClaimToken(claimId)?.token ?? null);

  if (!token) {
    return (
      <FeatureGated
        mode="unavailable"
        title="Redemption code shown at claim"
        description="The claim token was returned once when you claimed. If you still have that confirmation screen, present it at the venue. Venue staff perform redemption — customers cannot self-complete a sale."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Expires</span>
        <ExpiryCountdown expiresAt={expiresAt} />
      </div>
      <QrDisplay value={token} label="Present to venue" />
    </div>
  );
}
