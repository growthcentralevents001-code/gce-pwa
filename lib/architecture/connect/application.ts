import { z } from "zod";

/** Applicant business profile stored in connect_memberships.metadata.application */
export const connectMembershipApplicationSchema = z.object({
  memberName: z.string().min(2).max(120).optional(),
  businessName: z.string().min(2).max(200),
  businessDescription: z.string().min(10).max(4000),
  phone: z.string().min(10).max(20),
  email: z.string().email().max(254),
  businessAddress: z.string().max(500).optional().nullable(),
  websiteOrSocial: z.string().max(500).optional().nullable(),
  consentAccepted: z.literal(true),
});

export type ConnectMembershipApplication = z.infer<
  typeof connectMembershipApplicationSchema
>;

export function normalizeMembershipApplicationMetadata(
  metadata: unknown
): ConnectMembershipApplication | null {
  if (!metadata || typeof metadata !== "object") return null;
  const app = (metadata as { application?: unknown }).application;
  const parsed = connectMembershipApplicationSchema.safeParse(app);
  return parsed.success ? parsed.data : null;
}
