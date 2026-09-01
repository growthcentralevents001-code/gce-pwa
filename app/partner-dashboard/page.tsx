import { redirect } from "next/navigation";

/** Legacy partner mock UI — canonical Marketplace BDP workspace (FD-039). */
export default function PartnerDashboardLegacy() {
  redirect("/dashboard/marketplace-bdp");
}
