"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { switchWorkspaceAction } from "./actions";

type Props = {
  current: WorkspaceKey;
  allowed: WorkspaceKey[];
};

/**
 * Minimal workspace switcher for Phase 2 architecture verification.
 * Not a dashboard redesign.
 */
export function WorkspaceSwitcher({ current, allowed }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="mt-4 flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-800">Switch workspace</span>
      <select
        className="max-w-sm rounded border border-neutral-300 bg-white px-2 py-1.5"
        value={current}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as WorkspaceKey;
          startTransition(async () => {
            const result = await switchWorkspaceAction(next, true);
            if (result.ok) {
              router.push(`/dashboard/${result.workspaceKey}`);
              router.refresh();
            }
          });
        }}
      >
        {allowed.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      {pending ? (
        <span className="text-xs text-neutral-500">Saving preference…</span>
      ) : null}
    </label>
  );
}
