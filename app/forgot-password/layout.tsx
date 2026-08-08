import { authMetadata } from "@/lib/frontend/seo/metadata";

export const metadata = authMetadata("Forgot password");

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
