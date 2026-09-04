import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  acceptEbdpTerms,
  acceptQuote,
  activateClientAttribution,
  activateEnterpriseBdpPack,
  actorHasEnterprisePermission,
  actorIsEnterpriseBdp,
  addProjectMilestone,
  assignVendor,
  buildEbdpDashboard,
  buildEnterpriseClientDashboard,
  buildExpertDashboard,
  createChangeOrder,
  createEnterpriseBdpApplication,
  createEnterpriseClient,
  createEnterpriseEntitlement,
  createManagedVendor,
  createOpportunity,
  createProjectFromAcceptedQuote,
  createQuote,
  createRequirementVersion,
  createSolutionProposal,
  financeCosignQuote,
  issueQuote,
  listClientsForRepresentative,
  listEbdpPacksForUser,
  canActorReadEnterpriseClient,
  openEnterpriseDispute,
  proposeClientAttribution,
  reassignEnterpriseClient,
  recordEbdpPackPayment,
  suspendEnterpriseBdpPack,
  submitClientRequirement,
  startRequirementReview,
  requestRequirementInformation,
  respondRequirementInformation,
  qualifyEnterpriseRequirement,
  assignExpertToOpportunity,
  closeEnterpriseOpportunity,
  publishProposalToClient,
  updateProjectMilestoneStatus,
  activateEnterpriseProject,
  assertClientRepresentativeForClient,
} from "@/lib/architecture/enterprise";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const packId = url.searchParams.get("packId");
  const clientId = url.searchParams.get("clientId");
  const expert = url.searchParams.get("expert") === "1";
  const packs = await listEbdpPacksForUser(ctx.supabase, ctx.user.id);
  const admin = createPrivilegedSupabaseClient();
  const clients = await listClientsForRepresentative(ctx.supabase, ctx.user.id);
  const isPlatformAdmin = ctx.entitlements.activeAssignments.some(
    (a) => a.status === "active" && a.roleKey === "platform_admin"
  );

  let ebdpReport = null;
  if (packId) {
    const owned = packs.some((p) => String(p.id) === packId);
    if (!owned && !isPlatformAdmin) {
      throw new AppError("FORBIDDEN", "Not allowed to read this pack", {
        status: 403,
      });
    }
    ebdpReport =
      (await buildEbdpDashboard(ctx.supabase, packId)) ??
      (isPlatformAdmin ? await buildEbdpDashboard(admin, packId) : null);
  }

  let clientReport = null;
  if (clientId) {
    const allowed = await canActorReadEnterpriseClient(admin, {
      userId: ctx.user.id,
      clientId,
      packIds: packs.map((p) => String(p.id)),
      isPlatformAdmin,
    });
    if (!allowed) {
      throw new AppError("FORBIDDEN", "Not allowed to read this client", {
        status: 403,
      });
    }
    clientReport =
      (await buildEnterpriseClientDashboard(ctx.supabase, clientId)) ??
      (await buildEnterpriseClientDashboard(admin, clientId));
  }

  let expertReport = null;
  if (expert) {
    expertReport = await buildExpertDashboard(admin, ctx.user.id);
  }

  return jsonSuccess(
    { packs, clients, ebdpReport, clientReport, expertReport },
    ctx
  );
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = body?.action as string | undefined;
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  const requirePerm = (
    perm: Parameters<typeof actorHasEnterprisePermission>[1]
  ) => {
    if (
      !actorHasEnterprisePermission(assignments, perm) &&
      !assignments.some((a) => a.roleKey === "platform_admin")
    ) {
      throw new AppError("FORBIDDEN", `Missing permission ${perm}`, {
        status: 403,
      });
    }
  };

  switch (action) {
    case "apply": {
      const parsed = z
        .object({
          action: z.literal("apply"),
          packageOption: z
            .enum(["direct_30000", "finance_recovery_36000"])
            .optional(),
        })
        .parse(body);
      const pack = await createEnterpriseBdpApplication(ctx.supabase, {
        userId: ctx.user.id,
        packageOption: parsed.packageOption,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ pack }, ctx, 201);
    }
    case "accept_terms": {
      const parsed = z
        .object({ action: z.literal("accept_terms"), packId: z.string().uuid() })
        .parse(body);
      const pack = await acceptEbdpTerms(ctx.supabase, {
        packId: parsed.packId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ pack }, ctx);
    }
    case "record_payment": {
      const parsed = z
        .object({
          action: z.literal("record_payment"),
          packId: z.string().uuid(),
          paymentIntentId: z.string().uuid().optional().nullable(),
          offlinePaymentRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const pack = await recordEbdpPackPayment(admin, {
        packId: parsed.packId,
        paymentIntentId: parsed.paymentIntentId,
        offlinePaymentRef: parsed.offlinePaymentRef,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ pack }, ctx);
    }
    case "activate_pack": {
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const parsed = z
        .object({
          action: z.literal("activate_pack"),
          packId: z.string().uuid(),
          secondPackApproved: z.boolean().optional(),
          roleAssignmentId: z.string().uuid().optional().nullable(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      const pack = await activateEnterpriseBdpPack(admin, {
        packId: parsed.packId,
        actorUserId: ctx.user.id,
        secondPackApproved: parsed.secondPackApproved,
        roleAssignmentId: parsed.roleAssignmentId,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ pack }, ctx);
    }
    case "suspend_pack": {
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const parsed = z
        .object({
          action: z.literal("suspend_pack"),
          packId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      const pack = await suspendEnterpriseBdpPack(admin, {
        packId: parsed.packId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ pack }, ctx);
    }
    case "create_client": {
      requirePerm("enterprise.client.write");
      const parsed = z
        .object({
          action: z.literal("create_client"),
          organisationId: z.string().uuid(),
          displayName: z.string().min(1).max(300),
          industry: z.string().max(200).optional().nullable(),
          primaryRepresentativeUserId: z.string().uuid().optional().nullable(),
        })
        .parse(body);
      const client = await createEnterpriseClient(admin, {
        organisationId: parsed.organisationId,
        displayName: parsed.displayName,
        industry: parsed.industry,
        primaryRepresentativeUserId: parsed.primaryRepresentativeUserId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ client }, ctx, 201);
    }
    case "propose_attribution": {
      requirePerm("enterprise.attribution.manage");
      const parsed = z
        .object({
          action: z.literal("propose_attribution"),
          clientId: z.string().uuid(),
          packId: z.string().uuid(),
          bdpUserId: z.string().uuid(),
          provenance: z.string().max(100).optional(),
          basis: z.string().max(500).optional(),
        })
        .parse(body);
      const attribution = await proposeClientAttribution(admin, {
        clientId: parsed.clientId,
        packId: parsed.packId,
        bdpUserId: parsed.bdpUserId,
        actorUserId: ctx.user.id,
        provenance: parsed.provenance,
        basis: parsed.basis,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ attribution }, ctx, 201);
    }
    case "activate_attribution": {
      requirePerm("enterprise.attribution.manage");
      const parsed = z
        .object({
          action: z.literal("activate_attribution"),
          attributionId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      const attribution = await activateClientAttribution(admin, {
        attributionId: parsed.attributionId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ attribution }, ctx);
    }
    case "reassign_client": {
      requirePerm("enterprise.attribution.manage");
      const parsed = z
        .object({
          action: z.literal("reassign_client"),
          clientId: z.string().uuid(),
          newPackId: z.string().uuid(),
          newBdpUserId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
          effectiveFrom: z.string().datetime().optional(),
        })
        .parse(body);
      const result = await reassignEnterpriseClient(admin, {
        clientId: parsed.clientId,
        newPackId: parsed.newPackId,
        newBdpUserId: parsed.newBdpUserId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        effectiveFrom: parsed.effectiveFrom,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "create_opportunity": {
      requirePerm("enterprise.opportunity.write");
      const parsed = z
        .object({
          action: z.literal("create_opportunity"),
          clientId: z.string().uuid(),
          title: z.string().min(1).max(300),
          summary: z.string().max(5000).optional().nullable(),
          category: z.string().max(200).optional().nullable(),
          source: z.string().max(200).optional().nullable(),
          attributedBdpUserId: z.string().uuid().optional().nullable(),
          packId: z.string().uuid().optional().nullable(),
          expertUserId: z.string().uuid().optional().nullable(),
          clientRepUserId: z.string().uuid().optional().nullable(),
        })
        .parse(body);
      const opportunity = await createOpportunity(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ opportunity }, ctx, 201);
    }
    case "requirement_version": {
      requirePerm("enterprise.requirement.structure");
      const parsed = z
        .object({
          action: z.literal("requirement_version"),
          opportunityId: z.string().uuid(),
          rawRequirement: z.string().max(20000).optional().nullable(),
          structuredScope: z.string().max(20000).optional().nullable(),
          objectives: z.string().max(10000).optional().nullable(),
          deliverables: z.string().max(10000).optional().nullable(),
          timelineNotes: z.string().max(5000).optional().nullable(),
          locations: z.string().max(2000).optional().nullable(),
          budgetGuidanceMinor: z.number().int().nonnegative().optional().nullable(),
          constraints: z.string().max(10000).optional().nullable(),
          changeReason: z.string().max(1000).optional().nullable(),
        })
        .parse(body);
      const version = await createRequirementVersion(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ version }, ctx, 201);
    }
    case "create_proposal": {
      requirePerm("enterprise.proposal.draft");
      const parsed = z
        .object({
          action: z.literal("create_proposal"),
          opportunityId: z.string().uuid(),
          title: z.string().min(1).max(300),
          requirementVersionId: z.string().uuid().optional().nullable(),
          solutionSummary: z.string().max(20000).optional().nullable(),
          assumptions: z.string().max(10000).optional().nullable(),
          exclusions: z.string().max(10000).optional().nullable(),
          pricingSummaryMinor: z.number().int().nonnegative().optional(),
        })
        .parse(body);
      const proposal = await createSolutionProposal(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ proposal }, ctx, 201);
    }
    case "create_quote": {
      requirePerm("enterprise.quote.create");
      const parsed = z
        .object({
          action: z.literal("create_quote"),
          opportunityId: z.string().uuid(),
          clientId: z.string().uuid(),
          proposalId: z.string().uuid().optional().nullable(),
          requirementVersionId: z.string().uuid().optional().nullable(),
          totalProposedMinor: z.number().int().nonnegative(),
          lines: z
            .array(
              z.object({
                label: z.string().min(1).max(300),
                componentType: z.string().max(100).optional(),
                sourcingVertical: z.string().max(100).optional(),
                amountMinor: z.number().int().nonnegative(),
                platformCommissionBps: z.number().int().optional(),
                revenueComponentKey: z.string().min(1).max(200),
              })
            )
            .default([]),
        })
        .parse(body);
      const quote = await createQuote(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ quote }, ctx, 201);
    }
    case "finance_cosign": {
      requirePerm("enterprise.quote.finance_cosign");
      const parsed = z
        .object({
          action: z.literal("finance_cosign"),
          quoteId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      const quote = await financeCosignQuote(admin, {
        quoteId: parsed.quoteId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ quote }, ctx);
    }
    case "issue_quote": {
      requirePerm("enterprise.quote.issue");
      const parsed = z
        .object({
          action: z.literal("issue_quote"),
          quoteId: z.string().uuid(),
        })
        .parse(body);
      const quote = await issueQuote(admin, {
        quoteId: parsed.quoteId,
        actorUserId: ctx.user.id,
        isEnterpriseBdp: actorIsEnterpriseBdp(assignments),
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ quote }, ctx);
    }
    case "accept_quote": {
      requirePerm("enterprise.quote.accept");
      const parsed = z
        .object({
          action: z.literal("accept_quote"),
          quoteId: z.string().uuid(),
        })
        .parse(body);
      const quote = await acceptQuote(admin, {
        quoteId: parsed.quoteId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ quote }, ctx);
    }
    case "create_project": {
      requirePerm("enterprise.project.write");
      const parsed = z
        .object({
          action: z.literal("create_project"),
          quoteId: z.string().uuid(),
          title: z.string().min(1).max(300),
          ownerUserId: z.string().uuid().optional().nullable(),
          gceExecutionRole: z.string().max(100).optional(),
        })
        .parse(body);
      const project = await createProjectFromAcceptedQuote(admin, {
        quoteId: parsed.quoteId,
        title: parsed.title,
        ownerUserId: parsed.ownerUserId,
        gceExecutionRole: parsed.gceExecutionRole,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ project }, ctx, 201);
    }
    case "add_milestone": {
      requirePerm("enterprise.project.write");
      const parsed = z
        .object({
          action: z.literal("add_milestone"),
          projectId: z.string().uuid(),
          name: z.string().min(1).max(300),
          amountMinor: z.number().int().nonnegative().optional().nullable(),
          percentageBps: z.number().int().nonnegative().optional().nullable(),
          dueTrigger: z.string().max(500).optional().nullable(),
          dueOn: z.string().optional().nullable(),
          componentId: z.string().uuid().optional().nullable(),
          sortOrder: z.number().int().optional(),
        })
        .parse(body);
      const milestone = await addProjectMilestone(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ milestone }, ctx, 201);
    }
    case "create_vendor": {
      requirePerm("enterprise.vendor.manage");
      const parsed = z
        .object({
          action: z.literal("create_vendor"),
          businessName: z.string().min(1).max(300),
          category: z.string().max(200).optional().nullable(),
          contactName: z.string().max(200).optional().nullable(),
          contactEmail: z.string().email().optional().nullable(),
          contactPhone: z.string().max(50).optional().nullable(),
          capabilities: z.string().max(2000).optional().nullable(),
        })
        .parse(body);
      const vendor = await createManagedVendor(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ vendor }, ctx, 201);
    }
    case "assign_vendor": {
      requirePerm("enterprise.vendor.manage");
      const parsed = z
        .object({
          action: z.literal("assign_vendor"),
          projectId: z.string().uuid(),
          vendorId: z.string().uuid(),
          componentId: z.string().uuid().optional().nullable(),
          scope: z.string().max(2000).optional().nullable(),
          commercialAmountMinor: z.number().int().optional().nullable(),
        })
        .parse(body);
      const assignment = await assignVendor(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ assignment }, ctx, 201);
    }
    case "change_order": {
      requirePerm("enterprise.project.write");
      const parsed = z
        .object({
          action: z.literal("change_order"),
          projectId: z.string().uuid(),
          title: z.string().min(1).max(300),
          requestedChange: z.string().min(1).max(10000),
          commercialImpactMinor: z.number().int().optional(),
          timelineImpact: z.string().max(2000).optional().nullable(),
        })
        .parse(body);
      const changeOrder = await createChangeOrder(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ changeOrder }, ctx, 201);
    }
    case "open_dispute": {
      requirePerm("enterprise.dispute.open");
      const parsed = z
        .object({
          action: z.literal("open_dispute"),
          clientId: z.string().uuid().optional().nullable(),
          projectId: z.string().uuid().optional().nullable(),
          subjectType: z.string().min(1).max(100),
          title: z.string().min(1).max(300),
          details: z.string().max(10000).optional().nullable(),
          severity: z.string().max(50).optional(),
        })
        .parse(body);
      const dispute = await openEnterpriseDispute(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ dispute }, ctx, 201);
    }
    case "create_entitlement": {
      requirePerm("enterprise.entitlement.read");
      assertPermission(ctx, "finance");
      const parsed = z
        .object({
          action: z.literal("create_entitlement"),
          earningEventKey: z.string().min(1).max(200),
          clientId: z.string().uuid(),
          projectId: z.string().uuid().optional().nullable(),
          componentId: z.string().uuid().optional().nullable(),
          revenueComponentKey: z.string().min(1).max(200),
          eligibleEventRevenueMinor: z.number().int().nonnegative(),
        })
        .parse(body);
      const entitlement = await createEnterpriseEntitlement(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ entitlement }, ctx, 201);
    }
    case "submit_client_requirement": {
      requirePerm("enterprise.requirement.submit");
      const parsed = z
        .object({
          action: z.literal("submit_client_requirement"),
          clientId: z.string().uuid(),
          title: z.string().min(1).max(300),
          rawRequirement: z.string().min(1).max(20000),
          summary: z.string().max(5000).optional().nullable(),
          category: z.string().max(200).optional().nullable(),
          locations: z.string().max(2000).optional().nullable(),
          timelineNotes: z.string().max(5000).optional().nullable(),
          budgetGuidanceMinor: z.number().int().nonnegative().optional().nullable(),
        })
        .parse(body);
      await assertClientRepresentativeForClient(admin, ctx.user.id, parsed.clientId);
      const result = await submitClientRequirement(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx, 201);
    }
    case "start_requirement_review": {
      requirePerm("enterprise.requirement.structure");
      const parsed = z
        .object({
          action: z.literal("start_requirement_review"),
          opportunityId: z.string().uuid(),
        })
        .parse(body);
      const requirement = await startRequirementReview(admin, {
        opportunityId: parsed.opportunityId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ requirement }, ctx);
    }
    case "request_requirement_info": {
      requirePerm("enterprise.requirement.structure");
      const parsed = z
        .object({
          action: z.literal("request_requirement_info"),
          opportunityId: z.string().uuid(),
          message: z.string().min(1).max(5000),
        })
        .parse(body);
      const requirement = await requestRequirementInformation(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ requirement }, ctx);
    }
    case "respond_requirement_info": {
      requirePerm("enterprise.requirement.respond");
      const parsed = z
        .object({
          action: z.literal("respond_requirement_info"),
          opportunityId: z.string().uuid(),
          clientId: z.string().uuid(),
          response: z.string().min(1).max(20000),
        })
        .parse(body);
      const result = await respondRequirementInformation(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "qualify_requirement": {
      requirePerm("enterprise.requirement.structure");
      const parsed = z
        .object({
          action: z.literal("qualify_requirement"),
          opportunityId: z.string().uuid(),
        })
        .parse(body);
      const result = await qualifyEnterpriseRequirement(admin, {
        opportunityId: parsed.opportunityId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "assign_expert": {
      requirePerm("enterprise.opportunity.write");
      const parsed = z
        .object({
          action: z.literal("assign_expert"),
          opportunityId: z.string().uuid(),
          expertUserId: z.string().uuid(),
        })
        .parse(body);
      const opportunity = await assignExpertToOpportunity(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ opportunity }, ctx);
    }
    case "close_opportunity": {
      requirePerm("enterprise.opportunity.write");
      const parsed = z
        .object({
          action: z.literal("close_opportunity"),
          opportunityId: z.string().uuid(),
          outcome: z.enum(["lost", "cancelled"]),
          reason: z.string().max(1000).optional().nullable(),
        })
        .parse(body);
      const opportunity = await closeEnterpriseOpportunity(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ opportunity }, ctx);
    }
    case "publish_proposal": {
      requirePerm("enterprise.proposal.draft");
      const parsed = z
        .object({
          action: z.literal("publish_proposal"),
          proposalId: z.string().uuid(),
        })
        .parse(body);
      const proposal = await publishProposalToClient(admin, {
        proposalId: parsed.proposalId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ proposal }, ctx);
    }
    case "update_milestone_status": {
      requirePerm("enterprise.project.write");
      const parsed = z
        .object({
          action: z.literal("update_milestone_status"),
          milestoneId: z.string().uuid(),
          status: z.enum(["submitted", "accepted", "disputed"]),
        })
        .parse(body);
      const milestone = await updateProjectMilestoneStatus(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ milestone }, ctx);
    }
    case "activate_project": {
      requirePerm("enterprise.project.write");
      const parsed = z
        .object({
          action: z.literal("activate_project"),
          projectId: z.string().uuid(),
        })
        .parse(body);
      const project = await activateEnterpriseProject(admin, {
        projectId: parsed.projectId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ project }, ctx);
    }
    default:
      throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
        status: 400,
      });
  }
});
