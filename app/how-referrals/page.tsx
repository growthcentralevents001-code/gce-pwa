import { redirect } from "next/navigation";

/** Canonical public referral explanation lives on /the-circle. */
export default function HowReferralsPage() {
  redirect("/the-circle#referrals");
}
