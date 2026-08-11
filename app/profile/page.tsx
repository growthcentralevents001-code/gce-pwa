import { redirect } from "next/navigation";

/** Legacy /profile → canonical settings profile. */
export default function ProfileRedirectPage() {
  redirect("/settings/profile");
}
