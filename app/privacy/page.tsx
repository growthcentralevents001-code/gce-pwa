import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";
import { GlassPanel } from "@/components/marketing/GlassPanel";

export const metadata = publicMetadata({
  title: "Privacy Policy",
  description: "GCE Events privacy orientation — KYC and data handling follow Founder direction.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <MarketingHero
        eyebrow="Legal"
        headline="Privacy"
        description="We handle identity and profile data under platform architecture rules. Aadhaar is not mandatory by default (FD-039)."
        compact
      />
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <GlassPanel className="space-y-4 p-6 text-sm text-muted-foreground sm:p-8">
          <p className="text-foreground font-medium">Identity & profile</p>
          <p>
            Your base account is a permanent User identity. Profile fields
            support platform operation and do not themselves confer commercial
            entitlement.
          </p>
          <p className="text-foreground font-medium">KYC posture</p>
          <p>
            Fit-for-purpose documents (for example PAN, driving licence,
            passport, GST, bank verification) are preferred. Aadhaar is not
            mandatory by default.
          </p>
          <p className="text-foreground font-medium">Status</p>
          <p>
            Full privacy policy professional validation may remain pending.
            This page presents canonical orientation, not invented clauses.
          </p>
        </GlassPanel>
      </section>
    </>
  );
}
