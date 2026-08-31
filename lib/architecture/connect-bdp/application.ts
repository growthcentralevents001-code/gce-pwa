import { z } from "zod";

/** Applicant payload stored in connect_bdp_units.metadata.application */
export const connectBdpApplicationFieldsSchema = z.object({
  fullName: z.string().min(2).max(120),
  mobile: z.string().min(10).max(20),
  email: z.string().email().max(254),
  city: z.string().min(2).max(120),
  professionalBackground: z.string().min(10).max(4000),
  currentOccupation: z.string().min(2).max(200),
  experience: z.string().min(2).max(2000),
  reasonForApplying: z.string().min(10).max(4000),
  communityBuildingAbility: z.string().min(10).max(4000),
  consentAccepted: z.literal(true),
});

export type ConnectBdpApplicationFields = z.infer<
  typeof connectBdpApplicationFieldsSchema
>;

/** Canonical application journey stages (backend statuses). Training is offline. */
export const CONNECT_BDP_APPLICATION_JOURNEY = [
  "submitted",
  "pending_verification",
  "pending_payment",
  "pending_approval",
  "active",
] as const;

export function normalizeConnectBdpApplicationMetadata(
  metadata: unknown
): ConnectBdpApplicationFields | null {
  if (!metadata || typeof metadata !== "object") return null;
  const app = (metadata as { application?: unknown }).application;
  const parsed = connectBdpApplicationFieldsSchema.safeParse(app);
  return parsed.success ? parsed.data : null;
}
