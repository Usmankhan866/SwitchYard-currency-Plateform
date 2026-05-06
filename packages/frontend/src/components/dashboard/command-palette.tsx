"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import { navGroups, systemNav } from "@/lib/navigation";
import type { NavItem } from "@/lib/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@dashboardpack/core/components/ui/command";

function flattenNavItems(
  groups: typeof navGroups
): { title: string; href: string; icon?: React.ElementType }[] {
  const items: { title: string; href: string; icon?: React.ElementType }[] = [];
  for (const group of groups) {
    for (const item of group.items) {
      if (item.href) {
        items.push({ title: item.title, href: item.href, icon: item.icon });
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.href) {
            items.push({ title: child.title, href: child.href, icon: item.icon });
          }
        }
      }
    }
  }
  return items;
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Register Cmd+K / Ctrl+K keyboard shortcut
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
    setOpen(false);
  }, [theme, setTheme]);

  const allNavItems = flattenNavItems(navGroups);
  const systemItems = systemNav.filter((item): item is NavItem & { href: string } => !!item.href);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search for pages, actions, and quick links."
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Pages */}
        <CommandGroup heading="Pages">
          {allNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={`${item.href}-${index}`}
                value={`${item.title} ${index}`}
                onSelect={() => navigateTo(item.href)}
              >
                {Icon && <Icon className="me-2 h-4 w-4" />}
                <span>{item.title}</span>
              </CommandItem>
            );
          })}
          {systemItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <CommandItem
                key={`sys-${item.title}-${index}`}
                value={item.title}
                onSelect={() => navigateTo(item.href)}
              >
                {Icon && <Icon className="me-2 h-4 w-4" />}
                <span>{item.title}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem value="toggle theme dark light mode" onSelect={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="me-2 h-4 w-4" />
            ) : (
              <Moon className="me-2 h-4 w-4" />
            )}
            <span>Toggle Theme</span>
            <span className="ms-auto text-xs text-muted-foreground">
              {theme === "dark" ? "Switch to light" : "Switch to dark"}
            </span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
