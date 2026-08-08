import { redirect } from "next/navigation";

/** Legacy ZBP marketing — retired (FD-039). */
export default function ZbpRetiredPage() {
  redirect("/for-partners");
}
