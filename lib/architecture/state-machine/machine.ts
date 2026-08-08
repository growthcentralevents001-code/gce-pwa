import { AppError } from "../errors";

export type TransitionContext<TContext = Record<string, unknown>> = {
  actorUserId?: string | null;
  correlationId?: string;
  reason?: string;
  context?: TContext;
};

export type TransitionDefinition<TState extends string, TContext = Record<string, unknown>> = {
  from: TState | TState[] | "*";
  to: TState;
  name: string;
  guard?: (ctx: TransitionContext<TContext>, current: TState) => boolean | Promise<boolean>;
  onTransition?: (
    ctx: TransitionContext<TContext>,
    current: TState,
    next: TState
  ) => void | Promise<void>;
};

export type StateMachineDefinition<TState extends string, TContext = Record<string, unknown>> = {
  name: string;
  initial: TState;
  terminal?: readonly TState[];
  transitions: TransitionDefinition<TState, TContext>[];
};

function matchesFrom<TState extends string>(
  from: TransitionDefinition<TState>["from"],
  current: TState
): boolean {
  if (from === "*") return true;
  if (Array.isArray(from)) return from.includes(current);
  return from === current;
}

export class StateMachine<TState extends string, TContext = Record<string, unknown>> {
  constructor(private readonly def: StateMachineDefinition<TState, TContext>) {}

  get initial(): TState {
    return this.def.initial;
  }

  isTerminal(state: TState): boolean {
    return Boolean(this.def.terminal?.includes(state));
  }

  listTransitions(from: TState): TransitionDefinition<TState, TContext>[] {
    return this.def.transitions.filter((t) => matchesFrom(t.from, from));
  }

  async canTransition(
    current: TState,
    name: string,
    ctx: TransitionContext<TContext> = {}
  ): Promise<boolean> {
    if (this.isTerminal(current)) return false;
    const transition = this.def.transitions.find(
      (t) => t.name === name && matchesFrom(t.from, current)
    );
    if (!transition) return false;
    if (transition.guard) return Boolean(await transition.guard(ctx, current));
    return true;
  }

  async transition(
    current: TState,
    name: string,
    ctx: TransitionContext<TContext> = {}
  ): Promise<TState> {
    if (this.isTerminal(current)) {
      throw new AppError("INVALID_TRANSITION", `State ${current} is terminal`, {
        details: { machine: this.def.name, current, name },
      });
    }

    const transition = this.def.transitions.find(
      (t) => t.name === name && matchesFrom(t.from, current)
    );
    if (!transition) {
      throw new AppError(
        "INVALID_TRANSITION",
        `Transition ${name} is not allowed from ${current}`,
        { details: { machine: this.def.name, current, name } }
      );
    }

    if (transition.guard && !(await transition.guard(ctx, current))) {
      throw new AppError("INVALID_TRANSITION", `Guard failed for ${name}`, {
        details: { machine: this.def.name, current, name },
      });
    }

    if (transition.onTransition) {
      await transition.onTransition(ctx, current, transition.to);
    }

    return transition.to;
  }
}

/** Representative architecture-level payment intent SM (ADR-006 / SM_Payment). */
export const paymentIntentMachine = new StateMachine({
  name: "payment_intent",
  initial: "created",
  terminal: ["cancelled", "refunded"],
  transitions: [
    { from: "created", to: "requires_action", name: "require_action" },
    { from: "created", to: "processing", name: "start_processing" },
    { from: "requires_action", to: "processing", name: "start_processing" },
    { from: "processing", to: "succeeded", name: "mark_succeeded" },
    { from: "processing", to: "failed", name: "mark_failed" },
    { from: ["created", "requires_action", "processing"], to: "cancelled", name: "cancel" },
    { from: "succeeded", to: "refund_pending", name: "start_refund" },
    { from: "refund_pending", to: "refunded", name: "mark_refunded" },
    { from: "refund_pending", to: "partially_refunded", name: "mark_partial_refund" },
    { from: "partially_refunded", to: "refunded", name: "mark_refunded" },
    { from: "failed", to: "created", name: "retry" },
  ],
});
