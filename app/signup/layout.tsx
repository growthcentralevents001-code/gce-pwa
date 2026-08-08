import { authMetadata } from "@/lib/frontend/seo/metadata";

export const metadata = authMetadata("Sign up");

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
