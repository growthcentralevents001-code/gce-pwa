import { publicMetadata } from "@/lib/frontend/seo/metadata";
import { MarketingHero } from "@/components/marketing/MarketingHero";

export const metadata = publicMetadata({
  title: "Privacy Policy",
  description: "GCE Events privacy orientation — KYC and data handling follow Founder direction.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <MarketingHero
        showBrandMark={false}
        headline="Privacy"
        description="Identity and profile data follow platform architecture. Aadhaar is not mandatory by default."
        compact
      />
      <section className="mx-auto max-w-3xl space-y-8 px-4 pb-16 sm:px-6">
        <div>
          <h2 className="font-body text-lg font-semibold">Identity and profile</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Your base account is a permanent User identity. Profile fields
            support platform operation and do not themselves confer commercial
            entitlement.
          </p>
        </div>
        <div>
          <h2 className="font-body text-lg font-semibold">KYC posture</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Fit-for-purpose documents (for example PAN, driving licence,
            passport, GST, bank verification) are preferred. Aadhaar is not
            mandatory by default.
          </p>
        </div>
        <div>
          <h2 className="font-body text-lg font-semibold">Status</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Full privacy-policy professional validation may remain pending.
            Grievance-officer and DPO details will be published when the
            operating entity is incorporated. This page presents orientation,
            not invented clauses.
          </p>
        </div>
      </section>
    </>
  );
}
