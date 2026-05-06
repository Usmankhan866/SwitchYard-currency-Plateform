"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Shield,
  Cpu,
  CreditCard,
  Cloud,
  RefreshCw,
  UserPlus,
  Lock,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Types & Data
// ---------------------------------------------------------------------------

type NotifVariant = "success" | "danger" | "info" | "warning" | "primary";
type TabType = "all" | "alerts" | "messages" | "updates";

interface Notification {
  id: string;
  icon: React.ReactNode;
  variant: NotifVariant;
  title: string;
  description: string;
  time: string;
  read: boolean;
  tab: TabType;
  actions?: { label: string; style: "primary" | "ghost" }[];
}

const variantIconBg: Record<NotifVariant, string> = {
  success: "bg-[#2ca87f]/10 text-[#2ca87f]",
  danger: "bg-[#dc2626]/10 text-[#dc2626]",
  info: "bg-primary/10 text-primary",
  warning: "bg-[#e58a00]/10 text-[#e58a00]",
  primary: "bg-primary/10 text-primary",
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    icon: <CreditCard size={20} />,
    variant: "success",
    title: "Payment Received",
    description: "$2,499.00 from Acme Corp has been credited to your account.",
    time: "2 min ago",
    read: false,
    tab: "updates",
  },
  {
    id: "n2",
    icon: <Cpu size={20} />,
    variant: "danger",
    title: "CPU Usage Alert",
    description: "Server-02 is running at 95% CPU utilization. Immediate action may be required.",
    time: "15 min ago",
    read: false,
    tab: "alerts",
  },
  {
    id: "n3",
    icon: <Bell size={20} />,
    variant: "info",
    title: "New Feature Available",
    description: "AI-powered dashboard analytics are now live. Try it out!",
    time: "1 hr ago",
    read: true,
    tab: "updates",
  },
  {
    id: "n4",
    icon: <Shield size={20} />,
    variant: "danger",
    title: "Security Alert",
    description: "New login detected from San Francisco, CA. Was this you?",
    time: "18 hrs ago",
    read: false,
    tab: "alerts",
    actions: [
      { label: "Ignore", style: "ghost" },
      { label: "Secure Account", style: "primary" },
    ],
  },
  {
    id: "n5",
    icon: <Cloud size={20} />,
    variant: "success",
    title: "Backup Complete",
    description: "Daily backup of all databases finished successfully with no errors.",
    time: "20 hrs ago",
    read: true,
    tab: "updates",
  },
  {
    id: "n6",
    icon: <RefreshCw size={20} />,
    variant: "info",
    title: "Feature Update",
    description: "Enhanced analytics module has been deployed to production.",
    time: "2 days ago",
    read: true,
    tab: "updates",
  },
  {
    id: "n7",
    icon: <Lock size={20} />,
    variant: "warning",
    title: "SSL Certificate Expiring",
    description: "Your SSL certificate for colorlib.com expires in 7 days. Renew now.",
    time: "3 days ago",
    read: true,
    tab: "alerts",
  },
  {
    id: "n8",
    icon: <UserPlus size={20} />,
    variant: "primary",
    title: "New User Registered",
    description: "Sarah Johnson joined your workspace and is awaiting onboarding.",
    time: "4 days ago",
    read: true,
    tab: "messages",
  },
];

// Group notifications by time period
function groupNotifications(notifications: Notification[]) {
  const groups: { label: string; items: Notification[] }[] = [
    { label: "Today", items: notifications.filter((n) => ["n1", "n2", "n3"].includes(n.id)) },
    { label: "Yesterday", items: notifications.filter((n) => ["n4", "n5"].includes(n.id)) },
    { label: "This Week", items: notifications.filter((n) => ["n6", "n7", "n8"].includes(n.id)) },
  ];
  return groups.filter((g) => g.items.length > 0);
}

const tabs: { label: string; value: TabType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Alerts", value: "alerts" },
  { label: "Messages", value: "messages" },
  { label: "Updates", value: "updates" },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function NotificationItem({
  notif,
  onToggleRead,
  onRemove,
}: {
  notif: Notification;
  onToggleRead: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`flex gap-4 rounded-xl p-4 transition-colors cursor-pointer ${
          !notif.read ? "bg-primary/5" : "hover:bg-muted/40 opacity-70"
        }`}
        onClick={() => onToggleRead(notif.id)}
      >
        {/* Icon */}
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${variantIconBg[notif.variant]}`}
        >
          {notif.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`text-sm leading-snug ${!notif.read ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}
            >
              {notif.title}
            </p>
            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {notif.time}
              </span>
              {!notif.read && (
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
              )}
              <button
                className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(notif.id);
                }}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">
            {notif.description}
          </p>

          {notif.actions && (
            <div className="mt-2 flex items-center gap-2">
              {notif.actions.map((action) =>
                action.style === "primary" ? (
                  <button
                    key={action.label}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
                  >
                    {action.label}
                  </button>
                ) : (
                  <button
                    key={action.label}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {action.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabType | "all">("all");
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const filtered =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.tab === activeTab);

  const groups = groupNotifications(filtered);
  const unreadCount = notifications.filter((n) => !n.read).length;

  function handleToggleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  function handleRemove(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All marked as read");
  }

  return (
    <div>
      <PageBreadcrumb
        title="Notifications"
        items={[{ label: "Application" }, { label: "Notifications" }]}
      />

      <Card>
        <CardHeader className="border-b border-border pb-4">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-semibold text-foreground">
                Notifications
              </h2>
              <Badge variant="default" className="bg-primary">
                {unreadCount} unread
              </Badge>
            </div>
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-primary transition-opacity hover:opacity-75"
            >
              Mark all read
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <AnimatePresence initial={false}>
            {groups.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-12 text-center text-sm text-muted-foreground"
              >
                No notifications in this category.
              </motion.div>
            ) : (
              groups.map((group, gi) => (
                <div key={group.label}>
                  {/* Group label */}
                  <div className="px-6 py-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </span>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-1 px-4 pb-2">
                    <AnimatePresence initial={false}>
                      {group.items.map((notif) => (
                        <NotificationItem
                          key={notif.id}
                          notif={notif}
                          onToggleRead={handleToggleRead}
                          onRemove={handleRemove}
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Divider (not after last group) */}
                  {gi < groups.length - 1 && (
                    <div className="mx-6 border-t border-border" />
                  )}
                </div>
              ))
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
