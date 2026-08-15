"use client";

import { OwnerCredentialReveal } from "@/components/customer/OwnerCredentialReveal";

export function ClaimTokenReveal({
  claimId,
  expiresAt,
}: {
  claimId: string;
  expiresAt?: string | null;
}) {
  return (
    <OwnerCredentialReveal
      key={claimId}
      kind="claim"
      id={claimId}
      expiresAt={expiresAt}
    />
  );
}
