import { describe, expect, it } from "vitest";
import {
  LIVE_PROVIDER_FLAGS_MUST_STAY_OFF,
  JOB_TYPES,
  createEmailProvider,
  createSmsProvider,
  createPushProvider,
} from "@/lib/architecture/ops-governance";

describe("Phase 12 provider abstractions", () => {
  it("sandbox adapters succeed without network", async () => {
    const email = await createEmailProvider("sandbox").send({
      toUserId: "u1",
      subject: "t",
      body: "b",
      idempotencyKey: "k1",
      templateKey: "booking.confirmed",
    });
    const sms = await createSmsProvider("sandbox").send({
      toUserId: "u1",
      body: "b",
      idempotencyKey: "k2",
      templateKey: "booking.confirmed",
    });
    const push = await createPushProvider("sandbox").send({
      toUserId: "u1",
      title: "t",
      body: "b",
      idempotencyKey: "k3",
    });
    expect(email.ok).toBe(true);
    expect(sms.ok).toBe(true);
    expect(push.ok).toBe(true);
  });

  it("live adapters are blocked", async () => {
    expect(
      (
        await createEmailProvider("live").send({
          toUserId: "u1",
          subject: "t",
          body: "b",
          idempotencyKey: "k",
          templateKey: "x",
        })
      ).ok
    ).toBe(false);
    expect(
      (
        await createSmsProvider("live").send({
          toUserId: "u1",
          body: "b",
          idempotencyKey: "k",
          templateKey: "x",
        })
      ).ok
    ).toBe(false);
    expect(
      (
        await createPushProvider("live").send({
          toUserId: "u1",
          title: "t",
          body: "b",
          idempotencyKey: "k",
        })
      ).ok
    ).toBe(false);
  });

  it("documents safety flags and job types", () => {
    expect(LIVE_PROVIDER_FLAGS_MUST_STAY_OFF).toContain("retention_enforcement");
    expect(JOB_TYPES.notificationDispatch).toContain("notification");
  });
});
