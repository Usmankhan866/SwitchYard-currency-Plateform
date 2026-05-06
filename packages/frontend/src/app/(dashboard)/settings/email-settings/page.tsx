"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { useSettingsStorage } from "@/hooks/use-settings-storage";

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-primary" : "bg-muted",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

// ─── Default toggles ─────────────────────────────────────────────────────────

const defaultToggles = {
  // Email Notifications
  mentionsMe: true,
  followsMe: true,
  sharesActivity: false,
  messagesMe: true,
  // Activity Emails
  newAnnouncements: true,
  productUpdates: false,
  blogDigest: true,
  // System Notifications
  securityAlerts: true,
  accountActivity: true,
  billingUpdates: false,
};

type Toggles = typeof defaultToggles;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmailSettingsPage() {
  const [toggles, setToggles, reset] = useSettingsStorage<Toggles>(
    "switchyard-settings-email",
    defaultToggles
  );

  function handleToggle(key: keyof Toggles) {
    setToggles({ ...toggles, [key]: !toggles[key] });
    toast.success("Email notifications updated");
  }

  function handleReset() {
    reset();
    toast.success("Reset to defaults");
  }

  const ToggleRow = ({ label, toggleKey }: { label: string; toggleKey: keyof Toggles }) => (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm text-foreground">{label}</span>
      <Toggle checked={toggles[toggleKey]} onChange={() => handleToggle(toggleKey)} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Email Notifications</CardTitle>
          <button
            onClick={handleReset}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Reset to defaults
          </button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <ToggleRow label="Someone mentions me" toggleKey="mentionsMe" />
            <ToggleRow label="Someone follows me" toggleKey="followsMe" />
            <ToggleRow label="Someone shares my activity" toggleKey="sharesActivity" />
            <ToggleRow label="Someone messages me" toggleKey="messagesMe" />
          </div>
        </CardContent>
      </Card>

      {/* Activity Emails */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Emails</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <ToggleRow label="New announcements" toggleKey="newAnnouncements" />
            <ToggleRow label="Product updates" toggleKey="productUpdates" />
            <ToggleRow label="Blog digest" toggleKey="blogDigest" />
          </div>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            <ToggleRow label="Security alerts" toggleKey="securityAlerts" />
            <ToggleRow label="Account activity" toggleKey="accountActivity" />
            <ToggleRow label="Billing updates" toggleKey="billingUpdates" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
