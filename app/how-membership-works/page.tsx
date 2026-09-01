import { redirect } from "next/navigation";

/** Canonical public membership explanation lives on /memberships. */
export default function HowMembershipWorksPage() {
  redirect("/memberships");
}
