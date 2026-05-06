import { SidebarProvider } from "@dashboardpack/core/providers/sidebar-context";
import { ClientShell } from "@/components/client/client-shell";

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider storageKeyPrefix="switchyard-client">
      <ClientShell>{children}</ClientShell>
    </SidebarProvider>
  );
}
