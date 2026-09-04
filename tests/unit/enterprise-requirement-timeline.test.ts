import { describe, expect, it } from "vitest";
import { deriveEnterpriseRequirementTimeline } from "@/lib/architecture/enterprise/requirement-timeline";

describe("enterprise requirement timeline", () => {
  it("shows submitted as current for new intake", () => {
    const steps = deriveEnterpriseRequirementTimeline({
      readinessStatus: "submitted",
      opportunityStatus: "open",
      submittedAt: "2026-09-01T10:00:00Z",
    });
    expect(steps.find((s) => s.stage === "submitted")?.current).toBe(true);
    expect(steps.find((s) => s.stage === "qualified")?.done).toBe(false);
  });

  it("shows info requested without inventing qualification", () => {
    const steps = deriveEnterpriseRequirementTimeline({
      readinessStatus: "info_requested",
      opportunityStatus: "open",
      submittedAt: "2026-09-01T10:00:00Z",
      infoRequestedAt: "2026-09-01T11:00:00Z",
    });
    expect(steps.some((s) => s.stage === "info_requested" && s.current)).toBe(
      true
    );
    expect(steps.find((s) => s.stage === "qualified")?.done).toBe(false);
  });

  it("shows closed state for rejected requirements", () => {
    const steps = deriveEnterpriseRequirementTimeline({
      readinessStatus: "rejected",
      opportunityStatus: "cancelled",
      submittedAt: "2026-09-01T10:00:00Z",
    });
    expect(steps.some((s) => s.stage === "rejected" && s.current)).toBe(true);
    expect(steps.some((s) => s.stage === "project")).toBe(false);
  });

  it("shows project when backend has project evidence", () => {
    const steps = deriveEnterpriseRequirementTimeline({
      readinessStatus: "qualified",
      opportunityStatus: "won",
      hasProposal: true,
      hasIssuedQuote: true,
      hasProject: true,
    });
    expect(steps.find((s) => s.stage === "project")?.done).toBe(true);
  });
});
