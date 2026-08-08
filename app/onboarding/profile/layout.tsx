import { authMetadata } from "@/lib/frontend/seo/metadata";

export const metadata = authMetadata("Profile onboarding");

export default function OnboardingProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
