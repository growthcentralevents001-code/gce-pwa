"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ExceptionResolveActions({
  exceptionId,
  title,
}: {
  exceptionId: string;
  title: string;
}) {
  const router = useRouter();
  const [resolution, setResolution] = useState("");
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function act(status: "resolved" | "dismissed" | "escalated") {
    startTransition(async () => {
      setMsg(null);
      const res = await fetch("/api/ops/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "resolve_exception",
          exceptionId,
          resolution,
          status,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(
          body?.error?.message ??
            "Failed — resolution must be detailed and permissioned"
        );
      } else {
        setMsg(`Exception ${status}`);
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`res-${exceptionId}`} className="text-xs">
        Resolution (required)
      </Label>
      <Input
        id={`res-${exceptionId}`}
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        placeholder={`How ${title.slice(0, 40)} was handled`}
        className="text-sm"
        disabled={pending}
      />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={pending || resolution.trim().length < 8}
          onClick={() => act("resolved")}
        >
          Resolve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending || resolution.trim().length < 8}
          onClick={() => act("dismissed")}
        >
          Dismiss
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending || resolution.trim().length < 8}
          onClick={() => act("escalated")}
        >
          Escalate
        </Button>
      </div>
      {msg ? (
        <p className="text-xs text-muted-foreground" role="status">
          {msg}
        </p>
      ) : null}
    </div>
  );
}
