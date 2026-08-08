import { describe, expect, it } from "vitest";
import { paymentIntentMachine } from "@/lib/architecture/state-machine/machine";
import { AppError } from "@/lib/architecture/errors";

describe("paymentIntentMachine", () => {
  it("starts at created and can succeed via processing", async () => {
    expect(paymentIntentMachine.initial).toBe("created");
    const processing = await paymentIntentMachine.transition("created", "start_processing");
    expect(processing).toBe("processing");
    const succeeded = await paymentIntentMachine.transition(processing, "mark_succeeded");
    expect(succeeded).toBe("succeeded");
  });

  it("rejects invalid transitions", async () => {
    await expect(paymentIntentMachine.transition("created", "mark_succeeded")).rejects.toBeInstanceOf(
      AppError
    );
  });

  it("treats cancelled as terminal", async () => {
    const cancelled = await paymentIntentMachine.transition("created", "cancel");
    expect(paymentIntentMachine.isTerminal(cancelled)).toBe(true);
    await expect(paymentIntentMachine.transition(cancelled, "retry")).rejects.toBeInstanceOf(
      AppError
    );
  });
});
