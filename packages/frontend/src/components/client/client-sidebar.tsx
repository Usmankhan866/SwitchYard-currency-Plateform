"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@dashboardpack/core/lib/utils";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { useSwitchyard } from "@/components/dashboard/switchyard-provider";
import {
  BarChart2,
  Layers,
  Calendar,
  Building2,
  CreditCard,
  Users,
  FileText,
  Phone,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  X,
  TrendingUp,
  Bell,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Client nav definition
// ---------------------------------------------------------------------------

type ClientNavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
};

type ClientNavGroup = {
  label: string;
  items: ClientNavItem[];
};

const clientNavGroups: ClientNavGroup[] = [
  {
    label: "My Portfolio",
    items: [
      { title: "Portfolio Overview", href: "/client-dashboard", icon: BarChart2 },
      { title: "My Positions", href: "/client-dashboard/positions", icon: Layers, badge: "5" },
      { title: "Expiry Calendar", href: "/client-dashboard/calendar", icon: Calendar, badge: "9" },
    ],
  },
  {
    label: "Accounts",
    items: [
      { title: "Counterparties", href: "/client-dashboard/counterparties", icon: Building2 },
      { title: "My Payments", href: "/client-dashboard/payments", icon: CreditCard, badge: "2" },
      { title: "Beneficiaries", href: "/client-dashboard/beneficiaries", icon: Users },
    ],
  },
  {
    label: "Support",
    items: [
      { title: "Contact Advisor", href: "/client-dashboard/contact", icon: Phone },
      { title: "My Documents", href: "/client-dashboard/documents", icon: FileText },
      { title: "Notifications", href: "/client-dashboard/notifications", icon: Bell, badge: "3" },
    ],
  },
];

// ---------------------------------------------------------------------------
// NavItem
// ---------------------------------------------------------------------------

function ClientNavLink({
  item,
  collapsed,
}: {
  item: ClientNavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active =
    item.href === "/client-dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center text-sm transition-[all] duration-[0.08s] ease-[cubic-bezier(0.37,0.24,0.53,0.99)] py-2.5 px-5",
        active
          ? "border-l-[3px] border-sidebar-primary bg-black/10 text-white font-medium"
          : "text-sidebar-foreground hover:border-l-[3px] hover:border-sidebar-primary hover:bg-black/10 hover:text-white hover:font-medium",
      )}
    >
      <span className="flex w-6 h-6 shrink-0 items-center justify-center me-[15px]">
        <Icon className="h-[18px] w-[18px] shrink-0" />
      </span>
      {!collapsed && (
        <span className="flex-1 truncate">{item.title}</span>
      )}
      {!collapsed && item.badge && (
        <span className="flex w-5 h-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] text-white font-semibold float-right ms-auto">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Sidebar content
// ---------------------------------------------------------------------------

function ClientSidebarContent({ collapsed }: { collapsed: boolean }) {
  const { sidebarCaptions } = useSwitchyard();

  return (
    <>
      {/* Logo */}
      <div className="flex h-[74px] items-center px-6 py-4">
        {collapsed ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
            SY
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">
              SY
            </div>
            <div>
              <span className="block text-sm font-semibold text-white tracking-tight leading-none">
                SwitchYard Capital
              </span>
              <span className="block text-[10px] text-sidebar-foreground/60 mt-0.5 leading-none">
                Client Portal
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-74px-68px)] py-[10px]">
        {clientNavGroups.map((group, gi) => (
          <div key={group.label}>
            {!collapsed && sidebarCaptions === "show" && (
              <div
                className={cn(
                  "px-[23px] pb-2 text-[11px] font-semibold uppercase tracking-widest text-[#e8edf7]",
                  gi === 0 ? "pt-2.5" : "pt-6",
                )}
              >
                {group.label}
              </div>
            )}
            <nav className="flex flex-col">
              {group.items.map((item) => (
                <ClientNavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </nav>
          </div>
        ))}

        {/* Settings */}
        {!collapsed && sidebarCaptions === "show" && (
          <div className="px-[23px] pt-6 pb-2 text-[11px] font-semibold uppercase tracking-widest text-[#e8edf7]">
            Account
          </div>
        )}
        <nav className="flex flex-col">
          <ClientNavLink
            item={{ title: "Settings", href: "/client-dashboard/settings", icon: Settings }}
            collapsed={collapsed}
          />
        </nav>
      </div>

      {/* Client info */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Link
            href="/client-dashboard/settings"
            className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-black/10"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-primary/80 to-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
              HE
            </div>
            {!collapsed && (
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">
                  Horizon Exports
                </span>
                <span className="text-[11px] text-sidebar-foreground/50">
                  FX Client
                </span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              aria-label="Log out"
              className="rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-black/10 hover:text-sidebar-foreground/70"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export function ClientSidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 hidden h-screen flex-col bg-sidebar shadow-[1px_0_20px_0_rgba(38,53,68,1)] transition-all duration-300 ease-in-out lg:flex",
          collapsed ? "w-[80px]" : "w-[264px]",
        )}
      >
        <ClientSidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[264px] flex-col bg-sidebar shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="absolute right-3 top-4 flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-black/10 hover:text-sidebar-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        <ClientSidebarContent collapsed={false} />
      </aside>
    </>
  );
}
