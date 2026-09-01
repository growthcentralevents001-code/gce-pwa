import type { SupabaseClient } from "@supabase/supabase-js";
import type { TimelineItem } from "@/components/connect/Timeline";

export type LeadRequirementSnapshot = {
  requirementSummary: string;
  requirementDetails: string | null;
  tagCodes: string[];
  specialisationId: string | null;
};

export type LeadOutcomeConfirmation = {
  status: string;
  giverStatus: string | null;
  receiverStatus: string | null;
  confirmedAmountMinor: number | null;
};

const EVENT_LABELS: Record<string, string> = {
  lead_created: "Referral created",
  lead_submitted: "Submitted for routing",
  candidate_generated: "Eligible candidates matched",
  lead_routed: "Routing completed",
  lead_assigned: "Assigned to professional",
  lead_accepted: "Accepted by receiver",
  lead_declined: "Declined by receiver",
  contact_revealed: "Contact revealed",
  outcome_confirmation_requested: "Outcome submitted",
  lead_converted: "Dual confirmation completed",
  outcome_mismatch: "Outcome mismatch — desk review",
};

function eventTone(
  eventType: string
): TimelineItem["tone"] {
  if (eventType === "lead_converted" || eventType === "lead_accepted") {
    return "success";
  }
  if (
    eventType === "lead_declined" ||
    eventType === "outcome_mismatch"
  ) {
    return "warning";
  }
  if (eventType === "lead_created" || eventType === "lead_submitted") {
    return "pending";
  }
  return "neutral";
}

export async function getLatestLeadRequirement(
  client: SupabaseClient,
  leadId: string
): Promise<LeadRequirementSnapshot | null> {
  const { data } = await client
    .from("assist_lead_requirement_versions")
    .select(
      "requirement_summary, requirement_details, tag_codes, specialisation_id"
    )
    .eq("lead_id", leadId)
    .order("version_no", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    requirementSummary: String(data.requirement_summary ?? ""),
    requirementDetails: data.requirement_details
      ? String(data.requirement_details)
      : null,
    tagCodes: Array.isArray(data.tag_codes)
      ? data.tag_codes.map(String)
      : [],
    specialisationId: data.specialisation_id
      ? String(data.specialisation_id)
      : null,
  };
}

export async function getLeadOutcomeConfirmation(
  client: SupabaseClient,
  leadId: string
): Promise<LeadOutcomeConfirmation | null> {
  const { data } = await client
    .from("assist_lead_outcomes")
    .select(
      "status, giver_status, receiver_status, confirmed_amount_minor"
    )
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    status: String(data.status),
    giverStatus: data.giver_status ? String(data.giver_status) : null,
    receiverStatus: data.receiver_status
      ? String(data.receiver_status)
      : null,
    confirmedAmountMinor:
      typeof data.confirmed_amount_minor === "number"
        ? data.confirmed_amount_minor
        : null,
  };
}

export async function getLeadDomainTimeline(
  client: SupabaseClient,
  leadId: string
): Promise<TimelineItem[]> {
  const { data: events } = await client
    .from("assist_domain_events")
    .select("id, event_type, created_at, payload")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true })
    .limit(50);

  const { data: assignmentEvents } = await client
    .from("assist_lead_assignment_events")
    .select("id, event_type, created_at, payload")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true })
    .limit(20);

  const merged = [
    ...(events ?? []).map((e) => ({
      id: `domain-${e.id}`,
      title:
        EVENT_LABELS[String(e.event_type)] ??
        String(e.event_type).replaceAll("_", " "),
      at: e.created_at ? String(e.created_at) : null,
      tone: eventTone(String(e.event_type)),
    })),
    ...(assignmentEvents ?? []).map((e) => ({
      id: `assign-${e.id}`,
      title: `Assignment · ${String(e.event_type).replaceAll("_", " ")}`,
      at: e.created_at ? String(e.created_at) : null,
      tone: "neutral" as const,
    })),
  ].sort((a, b) => {
    const atA = a.at ? new Date(a.at).getTime() : 0;
    const atB = b.at ? new Date(b.at).getTime() : 0;
    return atA - atB;
  });

  return merged;
}
