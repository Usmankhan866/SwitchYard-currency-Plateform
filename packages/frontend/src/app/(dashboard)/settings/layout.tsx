"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, UserCog, Shield, Lock, Mail } from "lucide-react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";

const tabs = [
  { label: "Profile Overview", href: "/settings/profile", icon: User },
  { label: "Personal Info", href: "/settings/personal", icon: UserCog },
  { label: "Account Settings", href: "/settings/account", icon: Shield },
  { label: "Change Password", href: "/settings/password", icon: Lock },
  { label: "Email Settings", href: "/settings/email-settings", icon: Mail },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const activeTab = tabs.find((t) => pathname === t.href || pathname.startsWith(t.href + "/"));
  const breadcrumbLabel = activeTab?.label ?? "Settings";

  return (
    <>
      <PageBreadcrumb
        title="Settings"
        items={[{ label: "Settings" }, { label: breadcrumbLabel }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar */}
        <div className="col-span-12 md:col-span-4">
          {/* User profile card */}
          <Card className="mb-4">
            <CardContent className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-primary text-2xl font-bold text-primary-foreground">
                SY
              </div>
              <h5 className="mt-4 text-lg font-medium text-foreground">SwitchYard FX</h5>
              <p className="text-sm text-muted-foreground">Administrator</p>
              <Badge className="mt-2 bg-red-100 text-red-700 hover:bg-red-100">Pro</Badge>

              <div className="mt-4 grid grid-cols-3 border-t border-border pt-4">
                <div className="text-center">
                  <h6 className="text-lg font-medium text-foreground">37</h6>
                  <p className="text-xs text-muted-foreground">Mails</p>
                </div>
                <div className="border-x border-border text-center">
                  <h6 className="text-lg font-medium text-foreground">2,749</h6>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <h6 className="text-lg font-medium text-foreground">678</h6>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation tabs */}
          <Card>
            <CardContent className="p-2">
              <nav className="flex flex-col gap-0.5">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive =
                    pathname === tab.href || pathname.startsWith(tab.href + "/");
                  return (
                    <Link
                      key={tab.href}
                      href={tab.href}
                      className={[
                        "flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "border-l-[3px] border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      ].join(" ")}
                    >
                      <Icon size={16} className="shrink-0" />
                      {tab.label}
                    </Link>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Right content area */}
        <div className="col-span-12 md:col-span-8">{children}</div>
      </div>
    </>
  );
}
