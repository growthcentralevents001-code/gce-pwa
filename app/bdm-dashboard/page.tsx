import { redirect } from "next/navigation";

export default function BdmDashboardRetiredPage() {
  redirect("/unauthorized?reason=Legacy%20BDM%20dashboard%20is%20inactive");
}
