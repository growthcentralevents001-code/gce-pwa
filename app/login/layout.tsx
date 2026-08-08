import { authMetadata } from "@/lib/frontend/seo/metadata";

export const metadata = authMetadata("Log in");

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
