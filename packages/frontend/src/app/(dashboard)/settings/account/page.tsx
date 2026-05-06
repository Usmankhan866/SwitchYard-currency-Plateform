"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";
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

// ─── Types ────────────────────────────────────────────────────────────────────

type DeviceItem = {
  id: string;
  icon: "monitor" | "smartphone" | "tablet";
  name: string;
  location: string;
  status: string;
  current: boolean;
};

type SessionItem = {
  id: string;
  client: string;
  ip: string;
  time: string;
  current: boolean;
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const initialDevices: DeviceItem[] = [
  {
    id: "macbook",
    icon: "monitor",
    name: "MacBook Pro",
    location: "Riga, Latvia",
    status: "Current session",
    current: true,
  },
  {
    id: "iphone",
    icon: "smartphone",
    name: "iPhone 15",
    location: "Riga, Latvia",
    status: "Last active 2 hours ago",
    current: false,
  },
  {
    id: "ipad",
    icon: "tablet",
    name: "iPad Air",
    location: "London, UK",
    status: "Last active 3 days ago",
    current: false,
  },
];

const initialSessions: SessionItem[] = [
  {
    id: "chrome-macos",
    client: "Chrome on MacOS",
    ip: "192.168.1.1",
    time: "Active now",
    current: true,
  },
  {
    id: "safari-iphone",
    client: "Safari on iPhone",
    ip: "10.0.0.5",
    time: "2 hours ago",
    current: false,
  },
];

const defaultSecurity = {
  secureBrowsing: true,
  loginNotifications: true,
  loginApprovals: false,
};

const DeviceIcon = ({ icon }: { icon: DeviceItem["icon"] }) => {
  const size = 20;
  if (icon === "smartphone") return <Smartphone size={size} />;
  if (icon === "tablet") return <Tablet size={size} />;
  return <Monitor size={size} />;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  // Username editing
  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useSettingsStorage("switchyard-settings-username", "switchyard_user");
  const [usernameInput, setUsernameInput] = useState("");

  function startEditing() {
    setUsernameInput(username);
    setEditingUsername(true);
  }

  function saveUsername() {
    setUsername(usernameInput);
    setEditingUsername(false);
    toast.success("Username updated");
  }

  function cancelEditing() {
    setEditingUsername(false);
    setUsernameInput(username);
  }

  // Language
  const [language, setLanguage] = useSettingsStorage("switchyard-settings-language", "English");
  function handleLanguageChange(lang: string) {
    setLanguage(lang);
    toast.success("Language updated to " + lang);
  }

  // Security toggles
  const [security, setSecurity] = useSettingsStorage(
    "switchyard-settings-security",
    defaultSecurity
  );
  function toggleSecurity(key: keyof typeof defaultSecurity) {
    setSecurity({ ...security, [key]: !security[key] });
    toast.success("Setting updated");
  }

  // Devices
  const [devices, setDevices] = useState<DeviceItem[]>(initialDevices);
  const [deviceToRemove, setDeviceToRemove] = useState<DeviceItem | null>(null);
  function confirmRemoveDevice() {
    if (!deviceToRemove) return;
    setDevices((prev) => prev.filter((d) => d.id !== deviceToRemove.id));
    toast.success("Device removed");
    setDeviceToRemove(null);
  }

  // Sessions
  const [sessions, setSessions] = useState<SessionItem[]>(initialSessions);
  const [sessionToRevoke, setSessionToRevoke] = useState<SessionItem | null>(null);
  function confirmRevokeSession() {
    if (!sessionToRevoke) return;
    setSessions((prev) => prev.filter((s) => s.id !== sessionToRevoke.id));
    toast.success("Session revoked");
    setSessionToRevoke(null);
  }

  // Deactivate account
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  function confirmDeactivate() {
    toast.success("Account deactivated");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {/* Username */}
            <div className="flex items-center justify-between py-3">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Username</p>
                {editingUsername ? (
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      autoFocus
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveUsername();
                        if (e.key === "Escape") cancelEditing();
                      }}
                      className="h-8 w-48 text-sm"
                    />
                    <Button size="sm" onClick={saveUsername}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-foreground">{username}</p>
                )}
              </div>
              {!editingUsername && (
                <Button variant="outline" size="sm" onClick={startEditing}>
                  Edit
                </Button>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">admin@switchyardfx.com.au</p>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Verified</Badge>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-xs text-muted-foreground">Language</p>
                <p className="text-sm font-medium text-foreground">{language}</p>
              </div>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Latvian">Latvian</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sign-in method */}
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-xs text-muted-foreground">Sign-in method</p>
                <p className="text-sm font-medium text-foreground">Password</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {(
              [
                { key: "secureBrowsing", label: "Secure Browsing" },
                { key: "loginNotifications", label: "Login Notifications" },
                { key: "loginApprovals", label: "Login Approvals" },
              ] as const
            ).map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-3">
                <span className="text-sm text-foreground">{label}</span>
                <Toggle checked={security[key]} onChange={() => toggleSecurity(key)} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recognized Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Recognized Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {devices.map((device) => (
              <li key={device.id} className="flex items-center gap-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <DeviceIcon icon={device.icon} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{device.name}</p>
                  <p className="text-xs text-muted-foreground">{device.location}</p>
                </div>
                <div className="flex items-center gap-2 text-right">
                  {device.current && (
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                  <span className="text-xs text-muted-foreground">{device.status}</span>
                  {!device.current && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeviceToRemove(device)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{session.client}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.ip} &middot; {session.time}
                  </p>
                </div>
                {session.current ? (
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Current</Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSessionToRevoke(session)}
                  >
                    Revoke
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Deactivate Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently disable your account. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setDeactivateOpen(true)}
            >
              Deactivate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ConfirmDialog
        open={!!deviceToRemove}
        onOpenChange={(open) => !open && setDeviceToRemove(null)}
        title="Remove Device?"
        description={`Remove "${deviceToRemove?.name}" from your recognized devices?`}
        confirmLabel="Remove"
        variant="destructive"
        onConfirm={confirmRemoveDevice}
      />

      <ConfirmDialog
        open={!!sessionToRevoke}
        onOpenChange={(open) => !open && setSessionToRevoke(null)}
        title="Revoke Session?"
        description={`Revoke the session for "${sessionToRevoke?.client}"? They will be logged out.`}
        confirmLabel="Revoke"
        variant="destructive"
        onConfirm={confirmRevokeSession}
      />

      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate Account?"
        description="This will permanently disable your account and revoke all active sessions. This action cannot be undone. Are you absolutely sure?"
        confirmLabel="Deactivate"
        variant="destructive"
        onConfirm={confirmDeactivate}
      />
    </div>
  );
}
