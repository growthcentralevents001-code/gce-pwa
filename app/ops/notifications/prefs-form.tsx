"use client";

import { useState, useTransition } from "react";

type Prefs = {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  marketingOptIn: boolean;
};

export function PrefsForm({ initial }: { initial: Prefs }) {
  const [prefs, setPrefs] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/ops", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "update_preferences", ...prefs }),
      });
      setMessage(res.ok ? "Saved" : "Save failed");
    });
  }

  return (
    <div className="mt-3 space-y-2 text-sm">
      {(
        [
          ["inAppEnabled", "In-app"],
          ["emailEnabled", "Email"],
          ["smsEnabled", "SMS"],
          ["pushEnabled", "Push"],
          ["marketingOptIn", "Marketing opt-in"],
        ] as const
      ).map(([key, label]) => (
        <label key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs[key]}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, [key]: e.target.checked }))
            }
          />
          {label}
        </label>
      ))}
      <button
        type="button"
        disabled={pending}
        onClick={save}
        className="mt-2 rounded border border-neutral-300 px-3 py-1.5"
      >
        {pending ? "Saving…" : "Save preferences"}
      </button>
      {message ? <p className="text-xs text-neutral-600">{message}</p> : null}
    </div>
  );
}
