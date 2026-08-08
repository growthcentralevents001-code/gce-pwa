import { describe, expect, it } from "vitest";
import {
  assertNotSelfApproval,
  canPerform,
  isAssignmentActive,
  selectActiveAssignments,
  type PermissionContext,
} from "@/lib/architecture/rbac/permissions";
import type { RoleAssignment } from "@/lib/architecture/types";
import { AppError } from "@/lib/architecture/errors";
import { paymentIntentMachine } from "@/lib/architecture/state-machine/machine";
import {
  assertBalancedEntries,
} from "@/lib/architecture/ledger/posting";
import {
  getDefaultFlag,
  isKnownFeatureFlag,
} from "@/lib/architecture/feature-flags/flags";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { mapLegacyRole } from "@/lib/architecture/legacy/roleMap";
import { resolveLegacyDashboardPath } from "@/lib/architecture/workspace/registry";
import { defaultWorkspaceForAssignments } from "@/lib/architecture/workspace/preferences";
import { redactSensitive, createCorrelationId } from "@/lib/architecture/logging";
import {
  RazorpayCandidateAdapter,
} from "@/lib/architecture/payments/webhook";
import { roleAssignmentCreateSchema } from "@/lib/architecture/validation/schemas";

const assignment = (
  overrides: Partial<RoleAssignment> = {}
): RoleAssignment => ({
  id: "a1",
  userId: "u1",
  roleKey: "connect_bdp",
  status: "active",
  scopeType: "city",
  scopeId: "city-1",
  organisationId: null,
  effectiveFrom: new Date(0).toISOString(),
  effectiveTo: null,
  ...overrides,
});

describe("assignment status & scope", () => {
  it("filters inactive / expired assignments", () => {
    const active = selectActiveAssignments([
      assignment(),
      assignment({ id: "a2", status: "suspended" }),
      assignment({
        id: "a3",
        effectiveTo: new Date(Date.now() - 1000).toISOString(),
      }),
    ]);
    expect(active).toHaveLength(1);
    expect(isAssignmentActive(assignment({ status: "pending" }))).toBe(false);
  });

  it("scopes permission checks to matching resource scope", () => {
    const ctx: PermissionContext = {
      userId: "u1",
      activeAssignment: assignment(),
      assignments: [assignment()],
      resourceScopeType: "city",
      resourceScopeId: "city-2",
    };
    expect(canPerform(ctx, "read")).toBe(false);

    ctx.resourceScopeId = "city-1";
    expect(canPerform(ctx, "read")).toBe(true);
  });

  it("blocks self-approval for finance/approve", () => {
    const ctx: PermissionContext = {
      userId: "u1",
      activeAssignment: assignment({ roleKey: "finance_admin", scopeType: "platform" }),
      assignments: [assignment({ roleKey: "finance_admin", scopeType: "platform" })],
      isSelfSubject: true,
    };
    expect(() => assertNotSelfApproval(ctx, "approve")).toThrow(AppError);
  });
});

describe("state machine invalid transitions", () => {
  it("rejects illegal payment intent transitions", async () => {
    await expect(
      paymentIntentMachine.transition("created", "settle", { actorUserId: "u1" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("allows created -> processing", async () => {
    const next = await paymentIntentMachine.transition("created", "start_processing", {
      actorUserId: "u1",
    });
    expect(next).toBe("processing");
  });
});

describe("feature flags fail closed", () => {
  it("defaults every inactive/money flag OFF and unknown keys are not known", () => {
    for (const key of INACTIVE_FEATURE_FLAGS) {
      expect(getDefaultFlag(key)).toBe(false);
    }
    expect(isKnownFeatureFlag("not_a_real_flag")).toBe(false);
  });
});

describe("ledger + payments + audit-adjacent utils", () => {
  it("supports reversal metadata on balanced entries", () => {
    expect(() =>
      assertBalancedEntries([
        {
          accountId: "a",
          direction: "debit",
          amountMinor: 500,
          metadata: { reversalOf: "entry-1" },
          settlementRef: "set-1",
          entitlementRef: "ent-1",
        },
        {
          accountId: "b",
          direction: "credit",
          amountMinor: 500,
          metadata: { ruleVersion: "fd020-v1" },
        },
      ])
    ).not.toThrow();
  });

  it("webhook adapter fails closed without secret unless TEST_BYPASS", async () => {
    const adapter = new RazorpayCandidateAdapter(undefined);
    await expect(adapter.verifyWebhookSignature("{}", "bad")).resolves.toBe(false);
    await expect(adapter.verifyWebhookSignature("{}", "TEST_BYPASS")).resolves.toBe(
      true
    );
  });

  it("redacts sensitive log fields and creates correlation ids", () => {
    const redacted = redactSensitive({
      token: "secret",
      aadhaar: "1234",
      ok: "yes",
    });
    expect(redacted?.token).toBe("[REDACTED]");
    expect(redacted?.aadhaar).toBe("[REDACTED]");
    expect(redacted?.ok).toBe("yes");
    expect(createCorrelationId()).toBeTruthy();
  });
});

describe("legacy quarantine + workspace defaults", () => {
  it("keeps BDM unresolved and blocks inactive dashboards", () => {
    expect(mapLegacyRole("bdm").mappingStatus).toBe("unresolved");
    expect(mapLegacyRole("bdm").grantsEntitlement).toBe(false);
    expect(resolveLegacyDashboardPath("/dashboard/bdm")?.target).toBe(
      "/unauthorized"
    );
    expect(resolveLegacyDashboardPath("/dashboard/affiliate")?.entitled).toBe(
      false
    );
  });

  it("defaults workspace to first operational assignment", () => {
    expect(defaultWorkspaceForAssignments([assignment()])).toBe("connect-bdp");
    expect(defaultWorkspaceForAssignments([])).toBe("personal");
  });
});

describe("validation schemas", () => {
  it("validates role assignment create payload", () => {
    const parsed = roleAssignmentCreateSchema.safeParse({
      userId: "11111111-1111-4111-8111-111111111111",
      roleKey: "connect_bdp",
      scopeType: "city",
      scopeId: "22222222-2222-4222-8222-222222222222",
    });
    expect(parsed.success).toBe(true);
  });
});
