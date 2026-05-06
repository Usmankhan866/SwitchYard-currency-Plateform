"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@dashboardpack/core/lib/utils";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { useTranslations } from "@dashboardpack/core/lib/i18n/locale-context";
import { useSwitchyard } from "./switchyard-provider";
import { navGroups, systemNav } from "@/lib/navigation";
import type { NavItem, NavGroup } from "@/lib/navigation";
import {
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/** Check if a path matches a nav href (exact or prefix) */
function isActive(pathname: string, href?: string) {
  if (!href) return false;
  return pathname === href || pathname.startsWith(href + "/");
}

/** Check if any child (recursively) is active */
function hasActiveChild(pathname: string, items?: NavItem[]): boolean {
  if (!items) return false;
  return items.some(
    (item) =>
      isActive(pathname, item.href) ||
      hasActiveChild(pathname, item.children),
  );
}

/* ------------------------------------------------------------------ */
/*  i18n title mapping                                                 */
/* ------------------------------------------------------------------ */

const titleToKey: Record<string, string> = {
  // Group labels
  "Navigation": "sidebar.navigation",
  "Application": "sidebar.application",
  "E-commerce": "sidebar.ecommerceGroup",
  "Elements": "sidebar.elements",
  "Forms": "sidebar.forms",
  "Tables": "sidebar.tables",
  "Charts & Maps": "sidebar.chartsAndMaps",
  "Other": "sidebar.other",
  "Auth Pages": "sidebar.authPages",
  "Utility Pages": "sidebar.utilityPages",
  // Items
  "Dashboard": "sidebar.dashboard",
  "Analytics": "sidebar.analytics",
  "CRM": "sidebar.crm",
  "eCommerce": "sidebar.ecommerce",
  "Finance": "sidebar.finance",
  "Crypto": "sidebar.crypto",
  "Project": "sidebar.project",
  "SaaS": "sidebar.saas",
  "HR": "sidebar.hr",
  "Marketing": "sidebar.marketing",
  "Chat": "sidebar.chat",
  "Email": "sidebar.email",
  "Calendar": "sidebar.calendar",
  "File Manager": "sidebar.fileManager",
  "Task Board": "sidebar.taskBoard",
  "Notifications": "sidebar.notifications",
  "Gallery": "sidebar.gallery",
  "Users": "sidebar.users",
  "Invoices": "sidebar.invoices",
  "Products": "sidebar.products",
  "Cart": "sidebar.cart",
  "Orders": "sidebar.orders",
  "Wishlist": "sidebar.wishlist",
  "Typography": "sidebar.typography",
  "Components": "sidebar.components",
  "Icons": "sidebar.icons",
  "Form Elements": "sidebar.formElements",
  "Form Wizard": "sidebar.formWizard",
  "Editor": "sidebar.editor",
  "Data Tables": "sidebar.dataTables",
  "Charts": "sidebar.charts",
  "Sample Page": "sidebar.samplePage",
  "Pricing": "sidebar.pricing",
  "Landing Page": "sidebar.landingPage",
  "Authentication": "sidebar.authentication",
  "Pages": "sidebar.pages",
  "Settings": "sidebar.settings",
};

/* ------------------------------------------------------------------ */
/*  NavItemLink � leaf item (no children)                             */
/* ------------------------------------------------------------------ */

function NavItemLink({
  item,
  collapsed,
  depth = 0,
  translate,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
  translate: (title: string) => string;
}) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;
  const isSubmenu = depth > 0;

  return (
    <Link
      href={item.href ?? "#"}
      className={cn(
        "group relative flex items-center text-sm transition-[all] duration-[0.08s] ease-[cubic-bezier(0.37,0.24,0.53,0.99)]",
        /* Top-level link */
        !isSubmenu && "py-2.5 px-5",
        !isSubmenu &&
          active &&
          "border-l-[3px] border-sidebar-primary bg-black/10 text-white font-medium",
        !isSubmenu &&
          !active &&
          "text-sidebar-foreground hover:border-l-[3px] hover:border-sidebar-primary hover:bg-black/10 hover:text-white hover:font-medium",
        /* Submenu link */
        isSubmenu && !collapsed && "py-[7px] pe-[30px] ps-[60px]",
        isSubmenu &&
          active &&
          "font-medium text-sidebar-primary",
        isSubmenu &&
          !active &&
          "text-sidebar-foreground hover:text-sidebar-primary",
      )}
    >
      {/* Submenu vertical line indicator */}
      {isSubmenu && !collapsed && (
        <span
          className={cn(
            "absolute left-[28px] top-1/2 -translate-y-1/2 h-[20px] w-[2px] rounded-full transition-opacity duration-200",
            active
              ? "opacity-100 bg-sidebar-primary"
              : "opacity-0 group-hover:opacity-100 group-hover:bg-sidebar-primary",
          )}
        />
      )}

      {/* Top-level icon */}
      {Icon && !isSubmenu && (
        <span className="flex w-6 h-6 shrink-0 items-center justify-center me-[15px]">
          <Icon className="h-[18px] w-[18px] shrink-0" />
        </span>
      )}

      {!collapsed && (
        <span className="flex-1 truncate">{translate(item.title)}</span>
      )}

      {/* Badge */}
      {!collapsed && item.badge && (
        <span className="flex w-5 h-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] text-white font-semibold float-right ms-auto">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  NavItemCollapsible � item with children                           */
/* ------------------------------------------------------------------ */

function NavItemCollapsible({
  item,
  collapsed,
  depth = 0,
  translate,
}: {
  item: NavItem;
  collapsed: boolean;
  depth?: number;
  translate: (title: string) => string;
}) {
  const pathname = usePathname();
  const childActive = hasActiveChild(pathname, item.children);
  const [expanded, setExpanded] = useState(childActive);
  const Icon = item.icon;
  const isSubmenu = depth > 0;

  // Auto-expand when an active child is detected (e.g. on navigation)
  useEffect(() => {
    if (childActive) setExpanded(true);
  }, [childActive]);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  // When sidebar is collapsed, don't render children
  if (collapsed) {
    return (
      <div className="flex items-center justify-center">
        <button
          className={cn(
            "group flex w-full items-center justify-center py-2.5 px-5 text-sm transition-[all] duration-[0.08s] ease-[cubic-bezier(0.37,0.24,0.53,0.99)]",
            childActive
              ? "border-l-[3px] border-sidebar-primary bg-black/10 text-white"
              : "text-sidebar-foreground hover:border-l-[3px] hover:border-sidebar-primary hover:bg-black/10 hover:text-white",
          )}
          title={translate(item.title)}
        >
          {Icon && (
            <span className="flex w-6 h-6 shrink-0 items-center justify-center">
              <Icon className="h-[18px] w-[18px] shrink-0" />
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={toggle}
        className={cn(
          "group relative flex w-full items-center text-sm transition-[all] duration-[0.08s] ease-[cubic-bezier(0.37,0.24,0.53,0.99)]",
          /* Top-level parent */
          !isSubmenu && "py-2.5 px-5",
          !isSubmenu &&
            childActive &&
            "border-l-[3px] border-sidebar-primary bg-black/10 text-white font-medium",
          !isSubmenu &&
            !childActive &&
            "text-sidebar-foreground hover:border-l-[3px] hover:border-sidebar-primary hover:bg-black/10 hover:text-white hover:font-medium",
          /* Submenu parent */
          isSubmenu && "py-[7px] pe-[30px] ps-[60px]",
          isSubmenu &&
            childActive &&
            "font-medium text-sidebar-primary",
          isSubmenu &&
            !childActive &&
            "text-sidebar-foreground hover:text-sidebar-primary",
        )}
      >
        {/* Submenu vertical line indicator */}
        {isSubmenu && (
          <span
            className={cn(
              "absolute left-[28px] top-1/2 -translate-y-1/2 h-[20px] w-[2px] rounded-full transition-opacity duration-200",
              childActive
                ? "opacity-100 bg-sidebar-primary"
                : "opacity-0 group-hover:opacity-100 group-hover:bg-sidebar-primary",
            )}
          />
        )}

        {/* Top-level icon */}
        {Icon && !isSubmenu && (
          <span className="flex w-6 h-6 shrink-0 items-center justify-center me-[15px]">
            <Icon className="h-[18px] w-[18px] shrink-0" />
          </span>
        )}

        <span className="flex-1 truncate text-start">{translate(item.title)}</span>

        {/* Badge */}
        {item.badge && (
          <span className="flex w-5 h-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] text-white font-semibold ms-auto me-2">
            {item.badge}
          </span>
        )}

        {/* Chevron-right that rotates 90deg when expanded */}
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-200",
            expanded && "rotate-90",
          )}
        />
      </button>

      {/* Animated children container using grid trick */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="py-[15px]">
            {item.children?.map((child, i) =>
              child.children && child.children.length > 0 ? (
                <NavItemCollapsible
                  key={`${child.title}-${i}`}
                  item={child}
                  collapsed={false}
                  depth={depth + 1}
                  translate={translate}
                />
              ) : (
                <NavItemLink
                  key={`${child.title}-${i}`}
                  item={child}
                  collapsed={false}
                  depth={depth + 1}
                  translate={translate}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NavGroupSection � group caption + items                           */
/* ------------------------------------------------------------------ */

function NavGroupSection({
  group,
  collapsed,
  showCaption,
  isFirst = false,
  translate,
}: {
  group: NavGroup;
  collapsed: boolean;
  showCaption: boolean;
  isFirst?: boolean;
  translate: (title: string) => string;
}) {
  return (
    <div>
      {!collapsed && showCaption && (
        <div
          className={cn(
            "px-[23px] pb-2 text-[11px] font-semibold uppercase tracking-widest text-[#e8edf7]",
            isFirst ? "pt-2.5" : "pt-6",
          )}
        >
          {group.label ? translate(group.label) : null}
        </div>
      )}
      <nav className="flex flex-col">
        {group.items.map((item, i) =>
          item.children && item.children.length > 0 ? (
            <NavItemCollapsible
              key={`${item.title}-${i}`}
              item={item}
              collapsed={collapsed}
              translate={translate}
            />
          ) : (
            <NavItemLink
              key={`${item.title}-${i}`}
              item={item}
              collapsed={collapsed}
              translate={translate}
            />
          ),
        )}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarContent � logo, navigation, user                           */
/* ------------------------------------------------------------------ */

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const { sidebarCaptions } = useSwitchyard();
  const t = useTranslations();
  const translate = (title: string): string => {
    const key = titleToKey[title];
    return key ? t(key) : title;
  };

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
            <span className="text-base font-semibold text-white tracking-tight">
              SwitchYard Capital
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-74px)] py-[10px]">
        {navGroups.map((group, i) => (
          <NavGroupSection
            key={group.label ?? i}
            group={group}
            collapsed={collapsed}
            showCaption={sidebarCaptions === "show"}
            isFirst={i === 0}
            translate={translate}
          />
        ))}

        {/* System nav items */}
        {systemNav.length > 0 && (
          <div>
            {!collapsed && sidebarCaptions === "show" && (
              <div className="px-[23px] pt-6 pb-2 text-[11px] font-semibold uppercase tracking-widest text-[#e8edf7]">
                System
              </div>
            )}
            <nav className="flex flex-col">
              {systemNav.map((item, i) => (
                <NavItemLink
                  key={`${item.title}-${i}`}
                  item={item}
                  collapsed={collapsed}
                  translate={translate}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* User section */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2">
          <Link
            href="/settings/profile"
            className="flex flex-1 items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-black/10"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sidebar-primary/80 to-sidebar-primary text-[11px] font-bold text-sidebar-primary-foreground">
              SY
            </div>
            {!collapsed && (
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">
                  SwitchYard FX
                </span>
                <span className="text-[11px] text-sidebar-foreground/50">
                  Administrator
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

/* ------------------------------------------------------------------ */
/*  Sidebar � desktop fixed + mobile drawer                           */
/* ------------------------------------------------------------------ */

export function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen, layout } =
    useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed ltr:left-0 rtl:right-0 top-0 z-40 hidden h-screen flex-col bg-sidebar shadow-[1px_0_20px_0_rgba(38,53,68,1)] transition-all duration-300 ease-in-out",
          layout === "sidebar" ? "lg:flex" : "",
          collapsed ? "w-[80px]" : "w-[264px]",
        )}
      >
        <SidebarContent collapsed={collapsed} />
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
          "fixed ltr:left-0 rtl:right-0 top-0 z-50 flex h-screen w-[264px] flex-col bg-sidebar shadow-lg transition-transform duration-300 ease-in-out lg:hidden",
          mobileOpen
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full",
        )}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
          className="absolute ltr:right-3 rtl:left-3 top-4 flex h-7 w-7 items-center justify-center rounded-md text-sidebar-foreground/50 transition-colors hover:bg-black/10 hover:text-sidebar-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <SidebarContent collapsed={false} />
      </aside>
    </>
  );
}
