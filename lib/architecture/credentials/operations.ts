import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { checkRateLimit } from "@/lib/rate-limit/memory";
import {
  decryptDisplayToken,
  encryptDisplayToken,
  generateDisplayToken,
  hashDisplayToken,
} from "./display-token";

export type DisplayCredentialSubject = "ticket" | "offer_claim";

export type IssuedDisplayCredential = {
  rawToken: string;
  tokenHash: string;
};

type CredentialRow = {
  id: string;
  subject_type: DisplayCredentialSubject;
  subject_id: string;
  token_hash: string;
  ciphertext: string;
  key_version: number;
  revoked_at: string | null;
};

export function issueDisplayCredentialMaterial(): IssuedDisplayCredential {
  const rawToken = generateDisplayToken();
  return { rawToken, tokenHash: hashDisplayToken(rawToken) };
}

export async function persistDisplayCredential(
  client: SupabaseClient,
  input: {
    subjectType: DisplayCredentialSubject;
    subjectId: string;
    rawToken: string;
    tokenHash: string;
  }
): Promise<void> {
  const packed = encryptDisplayToken(input.rawToken);
  const { error } = await client.from("marketplace_display_credentials").upsert(
    {
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      token_hash: input.tokenHash,
      ciphertext: packed.ciphertext,
      key_version: packed.keyVersion,
      revoked_at: null,
      issued_at: new Date().toISOString(),
    },
    { onConflict: "subject_type,subject_id" }
  );
  if (error) {
    throw new AppError(
      "INTERNAL_ERROR",
      "Failed to persist display credential",
      { status: 500, cause: error, expose: false }
    );
  }
}

async function loadCredential(
  client: SupabaseClient,
  subjectType: DisplayCredentialSubject,
  subjectId: string
): Promise<CredentialRow> {
  const { data, error } = await client
    .from("marketplace_display_credentials")
    .select(
      "id,subject_type,subject_id,token_hash,ciphertext,key_version,revoked_at"
    )
    .eq("subject_type", subjectType)
    .eq("subject_id", subjectId)
    .maybeSingle();
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to load display credential", {
      cause: error,
      expose: false,
    });
  }
  if (!data) {
    throw new AppError(
      "NOT_FOUND",
      "Your pass could not be loaded. Try again or contact support.",
      { status: 404 }
    );
  }
  return data as CredentialRow;
}

function decryptOwned(row: CredentialRow): string {
  if (row.revoked_at) {
    throw new AppError(
      "FORBIDDEN",
      "This credential is no longer valid.",
      { status: 403 }
    );
  }
  return decryptDisplayToken(row.ciphertext);
}

export type TicketCredentialResult = {
  ticketId: string;
  ticketRef: string;
  status: string;
  displayToken: string | null;
  displayable: boolean;
  reason:
    | "ok"
    | "already_used"
    | "invalid"
    | "unavailable";
};

export async function getTicketDisplayCredential(
  client: SupabaseClient,
  input: {
    ticketId: string;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<TicketCredentialResult> {
  checkRateLimit(`ticket-cred:${input.actorUserId}`, {
    max: 40,
    windowMs: 60_000,
  });

  const { data: ticket, error } = await client
    .from("marketplace_tickets")
    .select("id,ticket_ref,status,holder_user_id")
    .eq("id", input.ticketId)
    .maybeSingle();
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to load ticket", {
      cause: error,
    });
  }
  if (!ticket) {
    throw new AppError("NOT_FOUND", "Ticket not found", { status: 404 });
  }
  if (ticket.holder_user_id !== input.actorUserId) {
    throw new AppError("FORBIDDEN", "You cannot view this ticket.", {
      status: 403,
    });
  }

  if (ticket.status === "checked_in") {
    await writeAuditEvent(client, {
      actorUserId: input.actorUserId,
      action: "marketplace_ticket.credential_redisplay",
      resourceType: "marketplace_ticket",
      resourceId: ticket.id,
      after: { status: ticket.status, displayable: false },
      correlationId: input.correlationId,
    });
    return {
      ticketId: ticket.id,
      ticketRef: ticket.ticket_ref,
      status: ticket.status,
      displayToken: null,
      displayable: false,
      reason: "already_used",
    };
  }

  if (ticket.status !== "issued") {
    await writeAuditEvent(client, {
      actorUserId: input.actorUserId,
      action: "marketplace_ticket.credential_redisplay",
      resourceType: "marketplace_ticket",
      resourceId: ticket.id,
      after: { status: ticket.status, displayable: false },
      correlationId: input.correlationId,
    });
    return {
      ticketId: ticket.id,
      ticketRef: ticket.ticket_ref,
      status: ticket.status,
      displayToken: null,
      displayable: false,
      reason: "invalid",
    };
  }

  const row = await loadCredential(client, "ticket", ticket.id);
  const displayToken = decryptOwned(row);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_ticket.credential_redisplay",
    resourceType: "marketplace_ticket",
    resourceId: ticket.id,
    after: {
      credentialId: row.id,
      keyVersion: row.key_version,
      displayable: true,
    },
    correlationId: input.correlationId,
  });

  return {
    ticketId: ticket.id,
    ticketRef: ticket.ticket_ref,
    status: ticket.status,
    displayToken,
    displayable: true,
    reason: "ok",
  };
}

export type ClaimCredentialResult = {
  claimId: string;
  status: string;
  expiresAt: string;
  displayToken: string | null;
  displayable: boolean;
  reason: "ok" | "expired" | "redeemed" | "invalid" | "unavailable";
};

export async function getClaimDisplayCredential(
  client: SupabaseClient,
  input: {
    claimId: string;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<ClaimCredentialResult> {
  checkRateLimit(`claim-cred:${input.actorUserId}`, {
    max: 40,
    windowMs: 60_000,
  });

  const { data: claim, error } = await client
    .from("marketplace_offer_claims")
    .select("id,status,expires_at,claimant_user_id")
    .eq("id", input.claimId)
    .maybeSingle();
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to load claim", {
      cause: error,
    });
  }
  if (!claim) {
    throw new AppError("NOT_FOUND", "Claim not found", { status: 404 });
  }
  if (claim.claimant_user_id !== input.actorUserId) {
    throw new AppError("FORBIDDEN", "You cannot view this claim.", {
      status: 403,
    });
  }

  const expired =
    claim.status === "expired" ||
    (claim.expires_at
      ? new Date(claim.expires_at).getTime() < Date.now()
      : false);

  if (claim.status === "redeemed") {
    await writeAuditEvent(client, {
      actorUserId: input.actorUserId,
      action: "marketplace_offer.credential_redisplay",
      resourceType: "marketplace_offer_claim",
      resourceId: claim.id,
      after: { status: claim.status, displayable: false },
      correlationId: input.correlationId,
    });
    return {
      claimId: claim.id,
      status: claim.status,
      expiresAt: claim.expires_at,
      displayToken: null,
      displayable: false,
      reason: "redeemed",
    };
  }

  if (expired || claim.status !== "claimed") {
    await writeAuditEvent(client, {
      actorUserId: input.actorUserId,
      action: "marketplace_offer.credential_redisplay",
      resourceType: "marketplace_offer_claim",
      resourceId: claim.id,
      after: { status: claim.status, displayable: false, expired },
      correlationId: input.correlationId,
    });
    return {
      claimId: claim.id,
      status: expired ? "expired" : claim.status,
      expiresAt: claim.expires_at,
      displayToken: null,
      displayable: false,
      reason: expired ? "expired" : "invalid",
    };
  }

  const row = await loadCredential(client, "offer_claim", claim.id);
  const displayToken = decryptOwned(row);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_offer.credential_redisplay",
    resourceType: "marketplace_offer_claim",
    resourceId: claim.id,
    after: {
      credentialId: row.id,
      keyVersion: row.key_version,
      displayable: true,
    },
    correlationId: input.correlationId,
  });

  return {
    claimId: claim.id,
    status: claim.status,
    expiresAt: claim.expires_at,
    displayToken,
    displayable: true,
    reason: "ok",
  };
}
