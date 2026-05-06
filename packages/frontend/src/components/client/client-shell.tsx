"use client";

import { cn } from "@dashboardpack/core/lib/utils";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import { SwitchyardProvider } from "@/components/dashboard/switchyard-provider";
import { ClientSidebar } from "./client-sidebar";
import { Header } from "@/components/dashboard/header";
import { PageTransition } from "@/components/dashboard/page-transition";
import { CommandPalette } from "@/components/dashboard/command-palette";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const { collapsed, layout, container } = useSidebar();

  return (
    <SwitchyardProvider>
      <div
        className={cn(
          "min-h-screen",
          container === "boxed"
            ? "mx-auto max-w-[1440px] border-x border-border bg-background shadow-sm"
            : "bg-background",
        )}
      >
        <div className="flex min-h-screen">
          <ClientSidebar />
          <CommandPalette />
          <div
            className={cn(
              "flex min-w-0 flex-1 flex-col overflow-x-hidden transition-all duration-300",
              collapsed ? "lg:ms-[80px]" : "lg:ms-[264px]",
            )}
          >
            <Header />
            <main id="main-content" className="min-w-0 flex-1 p-4 sm:p-6">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
      </div>
    </SwitchyardProvider>
  );
}
