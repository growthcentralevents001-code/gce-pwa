import { describe, expect, it } from "vitest";
import { WORKSPACE_ROLE_MAP } from "@/lib/architecture/workspace/registry";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import {
  PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF,
  LEAD_ASSIST_RULE_VERSION,
} from "@/lib/architecture/lead-assist";

describe("Phase 10 workspace registration", () => {
  it("registers opportunity-desk workspace", () => {
    expect(WORKSPACE_KEYS).toContain("opportunity-desk");
    expect(WORKSPACE_ROLE_MAP["opportunity-desk"]).toBe("opportunity_desk");
  });
});

describe("Phase 10 finance boundary constants", () => {
  it("stage-1 rule version is unpaid FD-031", () => {
    expect(LEAD_ASSIST_RULE_VERSION).toContain("stage1");
  });

  it("lists ₹500 / escrow / success-fee quarantine keys", () => {
    expect(PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF).toEqual(
      expect.arrayContaining([
        "rupee_500_lead_fee",
        "lead_escrow",
        "lead_success_fee",
        "paid_lead_assist",
        "pay_to_receive_leads",
        "paid_contact_reveal",
      ])
    );
  });
});
