import { PartnerPageHeader } from "@/components/partner";
import { EbdpApplyForm } from "@/components/enterprise/EbdpApplyForm";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { ENTERPRISE_BDP_ROLE_LABEL } from "@/lib/frontend/enterprise/format";

export const metadata = { robots: { index: false, follow: false }, title: "Apply · Enterprise BDP" };

export default function Page() {
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={`${ENTERPRISE_BDP_ROLE_LABEL} application`}
        description="Franchise Pack application. Client capacity 30 per pack. Client-based attribution — no territory ownership. Platform activates packs."
      />
      <EbdpApplyForm />
    </main>
  );
}
