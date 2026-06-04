"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@dashboardpack/core/lib/utils";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dashboardpack/core/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@dashboardpack/core/components/ui/dropdown-menu";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import { ThemeCustomizer } from "./theme-customizer";
import {
  Search,
  Menu,
  List,
  Sun,
  Moon,
  Palette,
  Bell,
  LogOut,
  Settings,
  User,
  Rocket,
  AlertTriangle,
  Users,
} from "lucide-react";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Mock notification data                                             */
/* ------------------------------------------------------------------ */

const notifications = [
  {
    id: "1",
    title: "New order received",
    description: "Order #1234 from John D.",
    time: "2 min ago",
    read: false,
    type: "order" as const,
  },
  {
    id: "2",
    title: "Payment confirmed",
    description: "$450.00 payment processed",
    time: "1 hour ago",
    read: false,
    type: "payment" as const,
  },
  {
    id: "3",
    title: "New user registered",
    description: "Sarah K. joined the platform",
    time: "3 hours ago",
    read: true,
    type: "customer" as const,
  },
];

const notificationIconMap: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  order: { icon: Rocket, color: "text-chart-1", bg: "bg-chart-1/10" },
  payment: {
    icon: AlertTriangle,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
  },
  customer: { icon: Users, color: "text-chart-3", bg: "bg-chart-3/10" },
  system: { icon: Settings, color: "text-chart-4", bg: "bg-chart-4/10" },
};

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

export function Header() {
  const { theme, setTheme } = useTheme();
  const { collapsed, setCollapsed, setMobileOpen, layout } = useSidebar();
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    toast.success("Logged out successfully");
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 flex h-[74px] items-center bg-background/70 px-4 [backdrop-filter:blur(7px)] sm:px-6",
          layout === "sidebar" ? "" : "lg:px-8",
        )}
      >
        {/* Left side */}
        <div className="me-auto flex items-center">
          {/* Sidebar collapse (desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex"
          >
            <List className="h-6 w-6" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Search — opens command palette */}
          <button
            className="ms-1 flex h-11 items-center gap-1.5 rounded-full px-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              );
            }}
            aria-label={t("header.search")}
          >
            <Search className="h-6 w-6" />
            <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-1">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </Button>

          {/* Customizer toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCustomizerOpen(true)}
            aria-label="Open theme customizer"
            className="h-11 w-11 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Palette className="h-6 w-6" />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative h-11 w-11 rounded-full text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 ltr:-right-0.5 rtl:-left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[9px] font-bold text-success-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-0"
              sideOffset={8}
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="text-sm font-semibold">{t("header.notifications")}</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => {
                  const iconInfo =
                    notificationIconMap[notification.type] ??
                    notificationIconMap.system;
                  const IconComponent = iconInfo.icon;
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-muted/50",
                        !notification.read && "bg-muted/30",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                          iconInfo.bg,
                        )}
                      >
                        <IconComponent
                          className={cn("h-4 w-4", iconInfo.color)}
                        />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium leading-tight">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border p-2">
                <Link
                  href="/application/notifications"
                  className="flex w-full items-center justify-center rounded-md py-1.5 text-xs font-medium text-primary transition-colors hover:bg-muted/50"
                >
                  {t("header.viewAll")}
                </Link>
              </div>
            </PopoverContent>
          </Popover>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-[11px] font-bold text-primary-foreground transition-shadow hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 hover:ring-offset-background"
                aria-label="User menu"
              >
                SY
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">SwitchYard FX</p>
                  <p className="text-xs text-muted-foreground">
                    admin@switchyardfx.com.au
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <User className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/account">
                    <Settings className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    {t("header.settings")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                {t("header.logOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Theme customizer sheet */}
      <ThemeCustomizer open={customizerOpen} onOpenChange={setCustomizerOpen} />
    </>
  );
}
