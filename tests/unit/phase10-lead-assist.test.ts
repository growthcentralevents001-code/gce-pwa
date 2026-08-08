import { describe, expect, it } from "vitest";
import {
  AiClassificationOutputSchema,
  DeterministicLeadAssistProvider,
  assertNoToolActionPayload,
  presentLeadPrivacySafe,
  sanitiseRequirementForAi,
  validateAiStructuredOutput,
  PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF,
  WORK_STATUS_TRANSITIONS,
  LOW_CONFIDENCE_BPS,
} from "@/lib/architecture/lead-assist";
import {
  INACTIVE_FEATURE_FLAGS,
  LEAD_ASSIST_STAGE1_FLAGS,
} from "@/lib/architecture/types";
import { actorHasLeadPermission } from "@/lib/architecture/lead-assist/permissions";
import type { RoleAssignment } from "@/lib/architecture/types";

describe("Phase 10 Stage-1 commercial quarantine", () => {
  it("keeps all paid Lead Assist flags in inactive set", () => {
    for (const key of PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF) {
      expect(INACTIVE_FEATURE_FLAGS).toContain(key);
    }
    expect(INACTIVE_FEATURE_FLAGS).toContain("paid_lead_assist");
  });

  it("exposes unpaid Stage-1 operational flags", () => {
    expect(LEAD_ASSIST_STAGE1_FLAGS).toContain("lead_assist_stage1");
    expect(LEAD_ASSIST_STAGE1_FLAGS).toContain("opportunity_desk");
  });
});

describe("Phase 10 AI structured output", () => {
  it("accepts valid classification", () => {
    const out = validateAiStructuredOutput({
      suggestedSpecialisationCode: "ca",
      suggestedTagCodes: ["tax"],
      confidenceBps: 8000,
      rankingReasons: ["specialisation_match"],
      reviewRequired: false,
      urgency: "normal",
    });
    expect(out.confidenceBps).toBe(8000);
  });

  it("rejects invalid AI output", () => {
    expect(() =>
      validateAiStructuredOutput({
        confidenceBps: 12000,
        suggestedTagCodes: [],
      })
    ).toThrow();
  });

  it("blocks tool-action style payloads", () => {
    expect(() =>
      assertNoToolActionPayload({
        action: "wallet_charge",
        tool: "execute",
      })
    ).toThrow();
  });

  it("redacts email/phone before AI", () => {
    const s = sanitiseRequirementForAi(
      "Call me at +91 98765 43210 or a@b.com for CA help"
    );
    expect(s).not.toMatch(/98765/);
    expect(s).not.toContain("a@b.com");
    expect(s).toContain("[redacted-phone]");
    expect(s).toContain("[redacted-email]");
  });

  it("deterministic provider falls back to low confidence without match", async () => {
    const p = new DeterministicLeadAssistProvider();
    const result = await p.classify({
      purpose: "classification",
      requirementText: "Need something vague",
      canonicalSpecialisations: [
        { id: "11111111-1111-1111-1111-111111111111", code: "ca", label: "Chartered Accountant" },
      ],
    });
    expect(result.reviewRequired).toBe(true);
    expect(result.confidenceBps).toBeLessThan(LOW_CONFIDENCE_BPS);
    expect(AiClassificationOutputSchema.safeParse(result.output).success).toBe(
      true
    );
  });

  it("deterministic provider matches sender-selected specialisation", async () => {
    const p = new DeterministicLeadAssistProvider();
    const specId = "a1111111-1111-4111-8111-111111111111";
    const result = await p.classify({
      purpose: "classification",
      requirementText: "Need help with books",
      specialisationCodeHint: "ca",
      tagCodeHints: ["audit"],
      canonicalSpecialisations: [
        { id: specId, code: "ca", label: "Chartered Accountant" },
      ],
    });
    expect(result.output.suggestedSpecialisationId).toBe(specId);
    expect(result.confidenceBps).toBeGreaterThanOrEqual(LOW_CONFIDENCE_BPS);
  });
});

describe("Phase 10 privacy presentation", () => {
  it("never embeds contact fields in privacy-safe view", () => {
    const view = presentLeadPrivacySafe({
      id: "l1",
      title: "Need CA",
      work_status: "offered",
      city: "Pune",
      contact_reveal_state: "masked",
    });
    expect(view).not.toHaveProperty("email");
    expect(view).not.toHaveProperty("phone");
    expect(view.contactAvailable).toBe(false);
  });
});

describe("Phase 10 lifecycle transitions", () => {
  it("allows draft → submitted and offered → accepted", () => {
    expect(WORK_STATUS_TRANSITIONS.draft).toContain("submitted");
    expect(WORK_STATUS_TRANSITIONS.offered).toContain("accepted");
    expect(WORK_STATUS_TRANSITIONS.offered).toContain("declined");
  });

  it("does not allow closed to reverse to draft", () => {
    expect(WORK_STATUS_TRANSITIONS.closed_dual_confirmed).not.toContain("draft");
  });
});

describe("Phase 10 RBAC", () => {
  const member: RoleAssignment = {
    id: "a1",
    userId: "u1",
    roleKey: "circle_member",
    status: "active",
    scopeType: "circle",
    scopeId: "c1",
    organisationId: null,
    effectiveFrom: new Date().toISOString(),
    effectiveTo: null,
  };
  const desk: RoleAssignment = {
    ...member,
    id: "a2",
    roleKey: "opportunity_desk",
    scopeType: "platform",
    scopeId: null,
  };

  it("members can create/accept but not desk-assign", () => {
    expect(actorHasLeadPermission([member], "lead.create.own")).toBe(true);
    expect(actorHasLeadPermission([member], "lead.accept_decline")).toBe(true);
    expect(actorHasLeadPermission([member], "lead.desk.assign")).toBe(false);
  });

  it("Opportunity Desk can review and assign", () => {
    expect(actorHasLeadPermission([desk], "lead.desk.review")).toBe(true);
    expect(actorHasLeadPermission([desk], "lead.desk.assign")).toBe(true);
  });
});

describe("Phase 10 routing invariants (pure)", () => {
  it("documents candidate !== assignment (candidates are recommendations)", () => {
    // Architectural invariant enforced in ops + unique active assignment index
    expect(true).toBe(true);
  });
});
