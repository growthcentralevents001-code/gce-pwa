import { redirect } from "next/navigation";

/**
 * Legacy checkout → customer events discovery.
 * Payments remain gated; no parallel checkout engine.
 */
export default function LegacyCheckoutRedirect() {
  redirect("/customer/events");
}
