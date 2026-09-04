import type { ReactNode } from "react";
import { PartnerActionCenter, type PartnerActionItem } from "@/components/partner/PartnerActionCenter";
import { PartnerStatusStrip, type PartnerStatusItem } from "@/components/partner/PartnerStatusStrip";
import { cn } from "@/lib/utils";

/**
 * Architecture 2.0 workspace home frame:
 * attention → status → optional triage → in-flight children.
 */
export function AttentionHome({
  header,
  statusItems,
  attentionItems,
  attentionTitle = "Needs your attention",
  emptyAttention = "Nothing waiting on you right now.",
  triage,
  children,
  className,
}: {
  header: ReactNode;
  statusItems?: PartnerStatusItem[];
  attentionItems: PartnerActionItem[];
  attentionTitle?: string;
  emptyAttention?: string;
  triage?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl space-y-6 pb-8",
        className
      )}
    >
      {header}
      {statusItems && statusItems.length > 0 ? (
        <PartnerStatusStrip items={statusItems} />
      ) : null}
      <PartnerActionCenter
        title={attentionTitle}
        items={attentionItems}
        emptyLabel={emptyAttention}
      />
      {triage}
      {children}
    </div>
  );
}
