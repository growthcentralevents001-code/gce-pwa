import { authMetadata } from "@/lib/frontend/seo/metadata";

export const metadata = authMetadata("Auth callback");

export default function AuthCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
