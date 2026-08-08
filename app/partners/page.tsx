import { redirect } from "next/navigation";

/** Compatibility: Batch 0 nav used /partners; inventory uses /for-partners. */
export default function PartnersRedirectPage() {
  redirect("/for-partners");
}
