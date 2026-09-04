export type EnterpriseRequirementStage =
  | "submitted"
  | "under_review"
  | "info_requested"
  | "structuring"
  | "qualified"
  | "proposal"
  | "quoting"
  | "project"
  | "rejected";

export type EnterpriseRequirementTimelineStep = {
  stage: EnterpriseRequirementStage;
  label: string;
  done: boolean;
  current: boolean;
  at?: string | null;
};

/** Backend-derived Enterprise requirement journey — never invent stages without evidence. */
export function deriveEnterpriseRequirementTimeline(input: {
  readinessStatus: string;
  opportunityStatus: string;
  submittedAt?: string | null;
  qualifiedAt?: string | null;
  hasProposal?: boolean;
  hasIssuedQuote?: boolean;
  hasProject?: boolean;
  infoRequestedAt?: string | null;
}): EnterpriseRequirementTimelineStep[] {
  const readiness = input.readinessStatus;
  const opp = input.opportunityStatus;

  if (readiness === "rejected" || ["lost", "cancelled"].includes(opp)) {
    return [
      {
        stage: "submitted",
        label: "Submitted",
        done: true,
        current: false,
        at: input.submittedAt ?? null,
      },
      {
        stage: "rejected",
        label: "Closed",
        done: true,
        current: true,
      },
    ];
  }

  const steps: EnterpriseRequirementTimelineStep[] = [
    {
      stage: "submitted",
      label: "Submitted",
      done: true,
      current: readiness === "submitted" && opp === "open",
      at: input.submittedAt ?? null,
    },
    {
      stage: "under_review",
      label: "Under review",
      done: ["under_review", "info_requested", "structuring", "qualified"].includes(
        readiness
      ),
      current: readiness === "under_review",
    },
    {
      stage: "info_requested",
      label: "More information",
      done: readiness === "info_requested" || Boolean(input.infoRequestedAt),
      current: readiness === "info_requested",
      at: input.infoRequestedAt ?? null,
    },
    {
      stage: "qualified",
      label: "Qualified",
      done: readiness === "qualified" || ["proposal_in_progress", "quoting", "won"].includes(opp),
      current: readiness === "qualified",
      at: input.qualifiedAt ?? null,
    },
    {
      stage: "proposal",
      label: "Proposal",
      done: Boolean(input.hasProposal),
      current: opp === "proposal_in_progress" && !Boolean(input.hasIssuedQuote),
    },
    {
      stage: "quoting",
      label: "Quotation",
      done: Boolean(input.hasIssuedQuote),
      current:
        opp === "quoting" ||
        (Boolean(input.hasIssuedQuote) && !Boolean(input.hasProject)),
    },
    {
      stage: "project",
      label: "Project execution",
      done: Boolean(input.hasProject),
      current: Boolean(input.hasProject) && opp === "won",
    },
  ];

  return steps.filter(
    (s) => s.stage !== "info_requested" || s.done || s.current
  );
}
