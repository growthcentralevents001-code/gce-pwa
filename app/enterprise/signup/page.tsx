import { redirect } from "next/navigation";

/** Legacy intake retired — canonical Enterprise requirement flow is `/enterprise/intake`. */
export default function EnterpriseSignupLegacyRedirect() {
  redirect("/enterprise/intake");
}
