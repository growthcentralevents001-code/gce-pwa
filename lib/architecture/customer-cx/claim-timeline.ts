export type ClaimTimelineStage =
  | "claimed"
  | "valid"
  | "visited"
  | "redeemed"
  | "expired";

export type ClaimTimelineStep = {
  stage: ClaimTimelineStage;
  label: string;
  done: boolean;
  current: boolean;
  at?: string | null;
};

/** Backend-derived claim journey — never invent VISITED without a visit record. */
export function deriveClaimTimeline(input: {
  status: string;
  claimedAt?: string | null;
  expiresAt?: string | null;
  visitedAt?: string | null;
  redeemedAt?: string | null;
  expired?: boolean;
  nowMs?: number;
}): ClaimTimelineStep[] {
  const now = input.nowMs ?? Date.now();
  const expired =
    input.expired !== undefined
      ? input.expired
      : input.status === "expired" ||
        (input.expiresAt
          ? new Date(input.expiresAt).getTime() < now
          : false);
  const visited = Boolean(input.visitedAt);
  const redeemed = input.status === "redeemed";

  if (expired && !redeemed) {
    return [
      {
        stage: "claimed",
        label: "Claimed",
        done: true,
        current: false,
        at: input.claimedAt ?? null,
      },
      {
        stage: "valid",
        label: "Valid",
        done: false,
        current: false,
        at: input.expiresAt ?? null,
      },
      {
        stage: "expired",
        label: "Expired",
        done: true,
        current: true,
        at: input.expiresAt ?? null,
      },
    ];
  }

  const steps: ClaimTimelineStep[] = [
    {
      stage: "claimed",
      label: "Claimed",
      done: true,
      current: !expired && !visited && !redeemed,
      at: input.claimedAt ?? null,
    },
    {
      stage: "valid",
      label: "Valid",
      done: !expired,
      current: !expired && !visited && !redeemed,
      at: input.expiresAt ?? null,
    },
    {
      stage: "visited",
      label: "Visited",
      done: visited,
      current: !expired && visited && !redeemed,
      at: input.visitedAt ?? null,
    },
    {
      stage: "redeemed",
      label: "Redeemed",
      done: redeemed,
      current: redeemed,
      at: input.redeemedAt ?? null,
    },
  ];

  return steps;
}
