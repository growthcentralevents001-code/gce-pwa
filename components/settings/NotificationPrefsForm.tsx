"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SettingsRow, SettingsSection } from "@/components/settings/SettingsSection";
import {
  SETTINGS_COPY,
  channelOperationalHint,
  channelLiveStatus,
} from "@/lib/frontend/settings/format";

type Prefs = {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  marketingOptIn: boolean;
};

type Channels = ReturnType<typeof channelLiveStatus>;

/**
 * Explicit Save for channel preferences — marketing separate from transactional.
 */
export function NotificationPrefsForm({
  initial,
  channels,
}: {
  initial: Prefs;
  channels: Channels;
}) {
  const [prefs, setPrefs] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      setMessage(null);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "update_preferences", ...prefs }),
      });
      if (!res.ok) {
        setMessage("Save failed — try again.");
        return;
      }
      setMessage(
        `${SETTINGS_COPY.channelPrefVsLive} Email: ${channelOperationalHint("email")} SMS: ${channelOperationalHint("sms")} Push: ${channelOperationalHint("push")}`
      );
    });
  }

  return (
    <SettingsSection
      title="Channel preferences"
      description={`${SETTINGS_COPY.marketingSeparate} Live email/SMS/push remain OFF unless platform policy activates them.`}
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" size="sm" disabled={pending} onClick={save}>
            {pending ? "Saving…" : "Save preferences"}
          </Button>
          {message ? (
            <p className="text-xs text-muted-foreground" role="status">
              {message}
            </p>
          ) : null}
        </div>
      }
    >
      <SettingsRow
        label="In-app"
        description={channelOperationalHint("in_app")}
        htmlFor="pref-in-app"
        control={
          <Switch
            id="pref-in-app"
            checked={prefs.inAppEnabled}
            onCheckedChange={(v) =>
              setPrefs((p) => ({ ...p, inAppEnabled: v }))
            }
            aria-label="In-app notifications"
          />
        }
      />
      <SettingsRow
        label="Email"
        description={channelOperationalHint("email")}
        htmlFor="pref-email"
        control={
          <Switch
            id="pref-email"
            checked={prefs.emailEnabled}
            onCheckedChange={(v) =>
              setPrefs((p) => ({ ...p, emailEnabled: v }))
            }
            aria-label="Email notifications preference"
          />
        }
      />
      <SettingsRow
        label="SMS"
        description={channelOperationalHint("sms")}
        htmlFor="pref-sms"
        control={
          <Switch
            id="pref-sms"
            checked={prefs.smsEnabled}
            onCheckedChange={(v) => setPrefs((p) => ({ ...p, smsEnabled: v }))}
            aria-label="SMS notifications preference"
          />
        }
      />
      <SettingsRow
        label="Push"
        description={channelOperationalHint("push")}
        htmlFor="pref-push"
        control={
          <Switch
            id="pref-push"
            checked={prefs.pushEnabled}
            onCheckedChange={(v) =>
              setPrefs((p) => ({ ...p, pushEnabled: v }))
            }
            aria-label="Push notifications preference"
          />
        }
      />
      <SettingsRow
        label="Marketing (optional)"
        description={`${SETTINGS_COPY.marketingSeparate} ${channelOperationalHint("marketing")}`}
        htmlFor="pref-marketing"
        control={
          <Switch
            id="pref-marketing"
            checked={prefs.marketingOptIn}
            onCheckedChange={(v) =>
              setPrefs((p) => ({ ...p, marketingOptIn: v }))
            }
            aria-label="Marketing opt-in"
          />
        }
      />
      {!channels.emailLive && !channels.smsLive && !channels.pushLive ? (
        <p className="mt-3 rounded-md border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          Channel status: live email, SMS, and push delivery are not active.
          Preferences still persist for when channels are enabled.
        </p>
      ) : null}
    </SettingsSection>
  );
}
