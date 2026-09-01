"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { Button } from "@/components/ui/button";
import { GCE_SURFACE } from "@/lib/frontend/design-language";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const INTENTS = [
  {
    id: "connect-bdp",
    title: "Connect BDP",
    description: "Application interest for Connect BDP — not an instant role.",
    href: "/login?next=/connect-bdp/apply",
  },
  {
    id: "marketplace-bdp",
    title: "Marketplace BDP",
    description: "Application interest for Marketplace BDP units.",
    href: "/marketplace-bdp",
  },
  {
    id: "venue",
    title: "Venue Partner",
    description: "Venue pathway interest. Approval required before entitlement.",
    href: "/venue/apply",
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "Enterprise Client / BDP inquiry — routed for review.",
    href: "/enterprise/signup",
  },
  {
    id: "connect-member",
    title: "Connect Member",
    description: "Start as a member via Associate membership orientation.",
    href: "/memberships",
  },
] as const;

const BLOCKED = new Set(["zbp", "affiliate", "bdm", "franchisee", "super-admin"]);

function ApplyRoleInner() {
  const params = useSearchParams();
  const intent = (params.get("intent") || "").toLowerCase();
  const blocked = BLOCKED.has(intent);

  return (
    <AuthPanel
      title="Choose a pathway"
      description="These options express intent. They do not grant privileged roles by themselves."
      brandPoints={[
        "Intent ≠ entitlement",
        "Approvals remain server-side",
        "Legacy ZBP / Affiliate tracks are inactive",
      ]}
    >
      {blocked ? (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Pathway unavailable</AlertTitle>
          <AlertDescription>
            That legacy track is inactive. Choose an approved partner pathway
            instead.
          </AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-3">
        {INTENTS.map((item) => (
          <div key={item.id} className={`${GCE_SURFACE.card} rounded-2xl p-4`}>
            <h2 className="font-medium text-foreground">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
            <Button asChild variant="outline" className="mt-3 min-h-10">
              <Link href={item.href}>Continue</Link>
            </Button>
          </div>
        ))}
      </div>
    </AuthPanel>
  );
}

export default function ApplyRolePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Loading…</div>}>
      <ApplyRoleInner />
    </Suspense>
  );
}
