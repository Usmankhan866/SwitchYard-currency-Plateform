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
  Bell,
  AlertTriangle,
  Calendar,
  TrendingUp,
  MessageSquare,
  CheckCheck,
  Trash2,
  Settings,
  Info,
} from "lucide-react";
import { toast } from "sonner";

type Notif = {
  id: string;
  type: "Fixing" | "Trade" | "Alert" | "Message" | "System";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const ALL_NOTIFS: Notif[] = [
  { id: "N001", type: "Alert",   title: "Unhedged payment due soon",              body: "AUD/GBP 45,000 payment to Berkeley Properties is due in 15 days and is not hedged.",           time: "2h ago",   read: false },
  { id: "N002", type: "Fixing",  title: "Fixing in 7 days — TRD-0041",           body: "Your AUD/USD TARF leg (AUD 20,833 @ 0.6485) fixes on 14 May 2026 at 3:00 PM Tokyo.",          time: "5h ago",   read: false },
  { id: "N003", type: "Trade",   title: "New trade recommendation from Hannah",  body: "Hannah Mitchell has sent you a pricing for a new AUD/EUR Enhanced Forward. Review now.",       time: "1d ago",   read: false },
  { id: "N004", type: "Message", title: "Message from Hannah Mitchell",           body: "Hi! I have updated the pricing on TRD-0038 Knock-In Collar to reflect today's spot movement.",  time: "2d ago",   read: true  },
  { id: "N005", type: "Fixing",  title: "Fixing in 9 days — TRD-0038",           body: "Your AUD/EUR Knock-In Collar leg (AUD 20,833 @ 0.5912) fixes on 16 May 2026 at 3:00 PM Tokyo.", time: "2d ago",   read: true  },
  { id: "N006", type: "System",  title: "Monthly statement available",            body: "Your April 2026 portfolio statement is ready to download in My Documents.",                     time: "6d ago",   read: true  },
  { id: "N007", type: "Alert",   title: "Expiring Soon — TRD-0031",              body: "Enhanced Forward AUD/CNH (TRD-0031) has only 2 legs remaining. It expires on 30 May 2026.",    time: "1w ago",   read: true  },
  { id: "N008", type: "System",  title: "Welcome to the Client Portal",           body: "Your SwitchYard Capital client portal is set up and ready. Explore your portfolio overview.",  time: "3w ago",   read: true  },
];

const TYPE_ICON: Record<Notif["type"], React.ElementType> = {
  Alert:   AlertTriangle,
  Fixing:  Calendar,
  Trade:   TrendingUp,
  Message: MessageSquare,
  System:  Info,
};

const TYPE_COLOR: Record<Notif["type"], string> = {
  Alert:   "bg-warning/10 text-warning",
  Fixing:  "bg-primary/10 text-primary",
  Trade:   "bg-success/10 text-success",
  Message: "bg-chart-3/10 text-chart-3",
  System:  "bg-muted text-muted-foreground",
};

type FilterType = "All" | Notif["type"];
const FILTERS: FilterType[] = ["All", "Alert", "Fixing", "Trade", "Message", "System"];

export default function NotificationsPage() {
  const [notifs, setNotifs]   = useState(ALL_NOTIFS);
  const [filter, setFilter]   = useState<FilterType>("All");
  const [showUnread, setUnread] = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const visible = notifs.filter((n) => {
    const matchFilter = filter === "All" || n.type === filter;
    const matchUnread = !showUnread || !n.read;
    return matchFilter && matchUnread;
  });

  function markRead(id: string) {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  }

  function dismiss(id: string) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Notifications"
        items={[{ label: "Client Portal" }, { label: "Notifications" }]}
      />

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Alerts, trade updates, and messages from your advisor</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button size="sm" variant="outline" onClick={markAllRead}>
              <CheckCheck className="mr-1.5 h-3.5 w-3.5" /> Mark All Read
            </Button>
          )}
          <Button size="sm" variant="outline">
            <Settings className="mr-1.5 h-3.5 w-3.5" /> Preferences
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {([
          { label: "Unread",     value: unreadCount,                              color: "text-primary" },
          { label: "Alerts",     value: notifs.filter((n) => n.type === "Alert").length,   color: "text-warning" },
          { label: "Fixings",    value: notifs.filter((n) => n.type === "Fixing").length,  color: "text-foreground" },
          { label: "Total",      value: notifs.length,                           color: "text-foreground" },
        ] as const).map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={showUnread}
                  onChange={(e) => setUnread(e.target.checked)}
                  className="rounded border-border"
                />
                Unread only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification list */}
      <Card>
        <CardContent className="p-0">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Bell className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs mt-1">You are all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {visible.map((n) => {
                const Icon = TYPE_ICON[n.type];
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/20 ${!n.read ? "bg-primary/5" : ""}`}
                    onClick={() => markRead(n.id)}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TYPE_COLOR[n.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/60">{n.time}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <Badge className={`text-[10px] ${TYPE_COLOR[n.type]}`}>{n.type}</Badge>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                        className="ml-1 rounded p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
