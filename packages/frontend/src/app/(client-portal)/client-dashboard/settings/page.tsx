"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type SettingsTab = "profile" | "security" | "notifications" | "preferences";

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "profile",       label: "Profile",        icon: User   },
  { key: "security",      label: "Security",       icon: Lock   },
  { key: "notifications", label: "Notifications",  icon: Bell   },
  { key: "preferences",   label: "Preferences",    icon: Globe  },
];

function ProfileTab() {
  const [form, setForm] = useState({
    firstName: "John",
    lastName: "Richardson",
    email: "john.richardson@horizonexports.com.au",
    phone: "+61 3 9000 5678",
    company: "Horizon Exports Pty Ltd",
    abn: "12 345 678 901",
    role: "CFO",
  });

  function save() { toast.success("Profile updated successfully"); }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Profile Information</CardTitle>
        <p className="text-xs text-muted-foreground">Your account and company details</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
            JR
          </div>
          <div>
            <Button size="sm" variant="outline">Change Avatar</Button>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: "First Name",   key: "firstName" },
            { label: "Last Name",    key: "lastName"  },
            { label: "Email Address",key: "email"     },
            { label: "Phone",        key: "phone"     },
            { label: "Company Name", key: "company"   },
            { label: "ABN",          key: "abn"       },
            { label: "Role / Title", key: "role"      },
          ].map(({ label, key }) => (
            <div key={key} className={key === "company" || key === "email" ? "sm:col-span-2" : ""}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
              <input
                type="text"
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button onClick={save}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);

  function changePassword() { toast.success("Password updated — check your email for confirmation"); }

  return (
    <div className="space-y-5">
      {/* Change password */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Current Password", show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
            { label: "New Password",     show: showNew,    toggle: () => setShowNew((v) => !v)     },
            { label: "Confirm New Password", show: showNew, toggle: () => setShowNew((v) => !v)    },
          ].map(({ label, show, toggle }) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={changePassword}>
              <Lock className="mr-1.5 h-3.5 w-3.5" /> Update Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two-factor */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Two-Factor Authentication</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account</p>
            </div>
            <Badge className="bg-success/10 text-success hover:bg-success/10 gap-1">
              <CheckCircle2 className="h-3 w-3" /> Enabled
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm font-medium text-foreground">Authenticator App</p>
                <p className="text-xs text-muted-foreground">Google Authenticator</p>
              </div>
            </div>
            <Button size="sm" variant="outline">Manage</Button>
          </div>
        </CardContent>
      </Card>

      {/* Active sessions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { device: "Chrome on macOS", location: "Sydney, AU", time: "Now (current)", current: true },
            { device: "Safari on iPhone",location: "Sydney, AU", time: "3h ago",        current: false },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
              </div>
              {s.current ? (
                <Badge className="bg-success/10 text-success hover:bg-success/10">Current</Badge>
              ) : (
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive h-7 text-xs"
                  onClick={() => toast.success("Session revoked")}>
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    fixingEmail: true, fixingSms: true, fixingApp: true,
    tradeEmail: true,  tradeSms: false, tradeApp: true,
    alertEmail: true,  alertSms: true,  alertApp: true,
    newsEmail: false,  newsSms: false,  newsApp: false,
  });

  type PrefKey = keyof typeof prefs;

  function toggle(key: PrefKey) { setPrefs((p) => ({ ...p, [key]: !p[key] })); }

  const ROWS = [
    { label: "Fixing Reminders",       keys: ["fixingEmail","fixingSms","fixingApp"] as PrefKey[], sub: "Alerts when a leg is fixing within 7 days" },
    { label: "New Trade Recommendations", keys: ["tradeEmail","tradeSms","tradeApp"] as PrefKey[], sub: "When Hannah sends a pricing for review" },
    { label: "Risk Alerts",            keys: ["alertEmail","alertSms","alertApp"] as PrefKey[], sub: "Unhedged payments, expiring positions" },
    { label: "Market News",            keys: ["newsEmail","newsSms","newsApp"]   as PrefKey[], sub: "FX market updates and commentary" },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
        <p className="text-xs text-muted-foreground">Choose how and where you receive notifications</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notification Type</th>
                {["Email", "SMS", "In-App"].map((h) => (
                  <th key={h} className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground w-20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map(({ label, keys, sub }) => (
                <tr key={label} className="hover:bg-muted/20">
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                  </td>
                  {keys.map((k) => (
                    <td key={k} className="py-3.5 text-center">
                      <button
                        onClick={() => toggle(k)}
                        className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${prefs[k] ? "bg-primary" : "bg-muted"}`}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${prefs[k] ? "translate-x-4.5 translate-x-[18px]" : "translate-x-0.5"}`} />
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end border-t border-border pt-4 mt-4">
          <Button onClick={() => toast.success("Notification preferences saved")}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PreferencesTab() {
  const [currency, setCurrency]   = useState("AUD");
  const [dateFormat, setDateFmt]  = useState("DD MMM YYYY");
  const [timezone, setTimezone]   = useState("Australia/Sydney");

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">Display Preferences</CardTitle>
        <p className="text-xs text-muted-foreground">Customise how information is presented</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {[
          {
            label: "Base Currency",
            value: currency,
            setter: setCurrency,
            options: ["AUD","USD","EUR","GBP","SGD"],
          },
          {
            label: "Date Format",
            value: dateFormat,
            setter: setDateFmt,
            options: ["DD MMM YYYY", "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
          },
          {
            label: "Timezone",
            value: timezone,
            setter: setTimezone,
            options: ["Australia/Sydney","Australia/Melbourne","Asia/Singapore","Europe/London","America/New_York"],
          },
        ].map(({ label, value, setter, options }) => (
          <div key={label}>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}

        <div className="flex justify-end border-t border-border pt-4">
          <Button onClick={() => toast.success("Preferences saved")}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Settings"
        items={[{ label: "Client Portal" }, { label: "Settings" }]}
      />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Account Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, security, and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar nav */}
        <nav className="space-y-1 lg:col-span-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                activeTab === key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile"       && <ProfileTab />}
          {activeTab === "security"      && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "preferences"   && <PreferencesTab />}
        </div>
      </div>
    </div>
  );
}
