import { authMetadata } from "@/lib/frontend/seo/metadata";

export const metadata = authMetadata("Partner pathway");

export default function ApplyRoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
