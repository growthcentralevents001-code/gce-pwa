import { redirect } from "next/navigation";

/**
 * Batch 10 — invent-fee venue plans retired.
 * Canonical partner entry: /venue/apply (and /for-partners).
 */
export default function VenuePlansRetired() {
  redirect("/venue/apply");
}
