import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { randomUUID } from "crypto";

export type LedgerDirection = "debit" | "credit";

export type LedgerEntryInput = {
  accountId: string;
  direction: LedgerDirection;
  amountMinor: number;
  currency?: string;
  entitlementRef?: string;
  settlementRef?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Double-entry style post: sum(debits) must equal sum(credits) in the same currency.
 * Does not implement GST/TDS. FD-020 principles only.
 */
export function assertBalancedEntries(entries: LedgerEntryInput[]): void {
  if (entries.length < 2) {
    throw new AppError("VALIDATION_ERROR", "Ledger post requires at least two entries");
  }
  const currency = entries[0]?.currency ?? "INR";
  let debit = 0;
  let credit = 0;
  for (const e of entries) {
    if ((e.currency ?? "INR") !== currency) {
      throw new AppError("VALIDATION_ERROR", "Mixed currencies in one transaction are not supported yet");
    }
    if (!Number.isInteger(e.amountMinor) || e.amountMinor < 0) {
      throw new AppError("VALIDATION_ERROR", "amountMinor must be a non-negative integer");
    }
    if (e.direction === "debit") debit += e.amountMinor;
    else credit += e.amountMinor;
  }
  if (debit !== credit) {
    throw new AppError("VALIDATION_ERROR", "Ledger entries are not balanced", {
      details: { debit, credit },
    });
  }
}

export async function postFinancialTransaction(
  client: SupabaseClient,
  input: {
    businessSource: string;
    vertical?: string;
    currency?: string;
    externalReference?: string;
    paymentIntentId?: string;
    ruleVersion?: string;
    createdBy?: string;
    metadata?: Record<string, unknown>;
    entries: LedgerEntryInput[];
    transactionKey?: string;
  }
) {
  assertBalancedEntries(input.entries);
  const transactionKey = input.transactionKey ?? `txn_${randomUUID()}`;

  const { data: txn, error: txnError } = await client
    .from("financial_transactions")
    .insert({
      transaction_key: transactionKey,
      business_source: input.businessSource,
      vertical: input.vertical ?? null,
      currency: input.currency ?? "INR",
      external_reference: input.externalReference ?? null,
      payment_intent_id: input.paymentIntentId ?? null,
      rule_version: input.ruleVersion ?? null,
      metadata: input.metadata ?? {},
      created_by: input.createdBy ?? null,
    })
    .select("id")
    .single();

  if (txnError || !txn) {
    throw new AppError("INTERNAL_ERROR", "Failed to create financial transaction", {
      cause: txnError,
    });
  }

  const rows = input.entries.map((e) => ({
    financial_transaction_id: txn.id,
    ledger_account_id: e.accountId,
    direction: e.direction,
    amount_minor: e.amountMinor,
    currency: e.currency ?? input.currency ?? "INR",
    entitlement_ref: e.entitlementRef ?? null,
    settlement_ref: e.settlementRef ?? null,
    metadata: e.metadata ?? {},
  }));

  const { error: entryError } = await client.from("ledger_entries").insert(rows);
  if (entryError) {
    throw new AppError("INTERNAL_ERROR", "Failed to insert ledger entries", {
      cause: entryError,
    });
  }

  return { transactionId: txn.id as string, transactionKey };
}
