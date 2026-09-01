import { redirect } from "next/navigation";

/** Legacy mega-admin landing — Ops is canonical (Batch 8 / FD-039). */
export default function AdminLegacyLanding() {
  redirect("/ops");
}
