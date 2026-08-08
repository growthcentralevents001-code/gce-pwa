import {
  withAuthedRoute,
  jsonSuccess,
} from "@/lib/api/context";
import {
  actorHasLeadPermission,
  assertPaidMechanicsInactive,
  acceptLead,
  assignLead,
  confirmLeadOutcome,
  createLead,
  CreateLeadInputSchema,
  declineLead,
  detectLeadDuplicates,
  expireLead,
  generateLeadCandidates,
  getMyReceivedLeads,
  getMySentLeads,
  getOpportunityDeskQueue,
  presentLeadPrivacySafe,
  reassignLead,
  reviewOpportunityDeskItem,
  revealLeadContact,
  routeLead,
  submitLead,
  submitLeadOutcome,
  updateLeadDraft,
  classifyLead,
  isOpportunityDeskActor,
} from "@/lib/architecture/lead-assist";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "sent";
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  if (view === "desk") {
    if (!actorHasLeadPermission(assignments, "lead.desk.review")) {
      throw new AppError("FORBIDDEN", "Opportunity Desk access required", {
        status: 403,
      });
    }
    const queue = await getOpportunityDeskQueue(admin);
    return jsonSuccess({ queue }, ctx);
  }

  if (view === "received") {
    if (!actorHasLeadPermission(assignments, "lead.read.assigned")) {
      throw new AppError("FORBIDDEN", "Missing lead read permission", {
        status: 403,
      });
    }
    const received = await getMyReceivedLeads(admin, ctx.user.id);
    return jsonSuccess({ received }, ctx);
  }

  if (!actorHasLeadPermission(assignments, "lead.read.own_sent")) {
    throw new AppError("FORBIDDEN", "Missing lead read permission", {
      status: 403,
    });
  }
  const sent = await getMySentLeads(admin, ctx.user.id);
  return jsonSuccess({
    sent: sent.map((l) => presentLeadPrivacySafe(l)),
    paidMechanics: await assertPaidMechanicsInactive(admin),
  }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = body?.action as string | undefined;
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  const requirePerm = (
    perm: Parameters<typeof actorHasLeadPermission>[1]
  ) => {
    if (!actorHasLeadPermission(assignments, perm)) {
      throw new AppError("FORBIDDEN", `Missing permission ${perm}`, {
        status: 403,
      });
    }
  };

  switch (action) {
    case "create": {
      requirePerm("lead.create.own");
      const parsed = CreateLeadInputSchema.parse({
        ...body,
        action: undefined,
      });
      const lead = await createLead(admin, {
        ...parsed,
        giverUserId: ctx.user.id,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ lead }, ctx, 201);
    }
    case "update_draft": {
      requirePerm("lead.create.own");
      const parsed = z
        .object({
          action: z.literal("update_draft"),
          leadId: z.string().uuid(),
          title: z.string().min(3).max(200).optional(),
          requirementSummary: z.string().min(3).max(500).optional(),
          requirementDetails: z.string().max(5000).optional().nullable(),
          specialisationId: z.string().uuid().optional().nullable(),
          tagCodes: z.array(z.string()).max(4).optional(),
          city: z.string().max(120).optional().nullable(),
          district: z.string().max(120).optional().nullable(),
          state: z.string().max(120).optional().nullable(),
          urgency: z.enum(["low", "normal", "high", "urgent"]).optional(),
          privacyLevel: z
            .enum(["standard", "restricted", "masked", "manual_review"])
            .optional(),
        })
        .parse(body);
      const lead = await updateLeadDraft(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ lead }, ctx);
    }
    case "submit": {
      requirePerm("lead.create.own");
      const parsed = z
        .object({
          action: z.literal("submit"),
          leadId: z.string().uuid(),
        })
        .parse(body);
      const result = await submitLead(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ result }, ctx);
    }
    case "classify": {
      if (!isOpportunityDeskActor(assignments)) {
        requirePerm("lead.create.own");
      }
      const parsed = z
        .object({ action: z.literal("classify"), leadId: z.string().uuid() })
        .parse(body);
      const result = await classifyLead(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ result }, ctx);
    }
    case "generate_candidates": {
      requirePerm("lead.desk.review");
      const parsed = z
        .object({
          action: z.literal("generate_candidates"),
          leadId: z.string().uuid(),
        })
        .parse(body);
      const candidates = await generateLeadCandidates(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
      });
      return jsonSuccess({ candidates }, ctx);
    }
    case "route": {
      requirePerm("lead.desk.assign");
      const parsed = z
        .object({
          action: z.literal("route"),
          leadId: z.string().uuid(),
          autoAssignTop: z.boolean().optional(),
        })
        .parse(body);
      const result = await routeLead(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        autoAssignTop: parsed.autoAssignTop,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ result }, ctx);
    }
    case "assign": {
      requirePerm("lead.desk.assign");
      const parsed = z
        .object({
          action: z.literal("assign"),
          leadId: z.string().uuid(),
          receiverUserId: z.string().uuid(),
          receiverMembershipId: z.string().uuid().optional().nullable(),
          receiverCircleId: z.string().uuid().optional().nullable(),
        })
        .parse(body);
      const assignment = await assignLead(admin, {
        ...parsed,
        assignmentSource: "desk",
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ assignment }, ctx, 201);
    }
    case "accept": {
      requirePerm("lead.accept_decline");
      const parsed = z
        .object({ action: z.literal("accept"), leadId: z.string().uuid() })
        .parse(body);
      const assignment = await acceptLead(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ assignment }, ctx);
    }
    case "decline": {
      requirePerm("lead.accept_decline");
      const parsed = z
        .object({
          action: z.literal("decline"),
          leadId: z.string().uuid(),
          reason: z.string().max(500).optional(),
        })
        .parse(body);
      const assignment = await declineLead(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ assignment }, ctx);
    }
    case "reveal_contact": {
      requirePerm("lead.reveal_contact");
      const parsed = z
        .object({
          action: z.literal("reveal_contact"),
          leadId: z.string().uuid(),
          reason: z.string().max(500).optional(),
        })
        .parse(body);
      const revealed = await revealLeadContact(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ revealed }, ctx);
    }
    case "reassign": {
      requirePerm("lead.desk.reassign");
      const parsed = z
        .object({
          action: z.literal("reassign"),
          leadId: z.string().uuid(),
          receiverUserId: z.string().uuid(),
          receiverMembershipId: z.string().uuid().optional().nullable(),
          receiverCircleId: z.string().uuid().optional().nullable(),
          reason: z.string().min(1).max(500),
        })
        .parse(body);
      const assignment = await reassignLead(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ assignment }, ctx);
    }
    case "expire": {
      requirePerm("lead.desk.review");
      const parsed = z
        .object({
          action: z.literal("expire"),
          leadId: z.string().uuid(),
          reason: z.string().max(500).optional(),
        })
        .parse(body);
      const result = await expireLead(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
      });
      return jsonSuccess({ result }, ctx);
    }
    case "submit_outcome":
    case "confirm_outcome": {
      requirePerm("lead.outcome.submit");
      const parsed = z
        .object({
          action: z.enum(["submit_outcome", "confirm_outcome"]),
          leadId: z.string().uuid(),
          amountMinor: z.number().int().nonnegative(),
          notes: z.string().max(1000).optional(),
        })
        .parse(body);
      const outcome =
        parsed.action === "confirm_outcome"
          ? await confirmLeadOutcome(admin, {
              leadId: parsed.leadId,
              actorUserId: ctx.user.id,
              amountMinor: parsed.amountMinor,
              notes: parsed.notes,
              correlationId: ctx.correlationId,
            })
          : await submitLeadOutcome(admin, {
              leadId: parsed.leadId,
              actorUserId: ctx.user.id,
              amountMinor: parsed.amountMinor,
              notes: parsed.notes,
              correlationId: ctx.correlationId,
            });
      return jsonSuccess({ outcome }, ctx);
    }
    case "review_desk": {
      requirePerm("lead.desk.review");
      const parsed = z
        .object({
          action: z.literal("review_desk"),
          queueId: z.string().uuid(),
          notes: z.string().max(2000).optional(),
          finalSpecialisationId: z.string().uuid().optional().nullable(),
          assignReceiverUserId: z.string().uuid().optional().nullable(),
          assignMembershipId: z.string().uuid().optional().nullable(),
          assignCircleId: z.string().uuid().optional().nullable(),
          resolve: z.boolean().optional(),
        })
        .parse(body);
      const result = await reviewOpportunityDeskItem(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ result }, ctx);
    }
    case "detect_duplicates": {
      requirePerm("lead.desk.review");
      const parsed = z
        .object({
          action: z.literal("detect_duplicates"),
          leadId: z.string().uuid(),
        })
        .parse(body);
      const flags = await detectLeadDuplicates(admin, {
        leadId: parsed.leadId,
        actorUserId: ctx.user.id,
      });
      return jsonSuccess({ flags }, ctx);
    }
    default:
      throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
        status: 400,
      });
  }
});
