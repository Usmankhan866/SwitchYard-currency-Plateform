"use client";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShoppingCart,
  MessageSquare,
  Calendar,
  Mail,
  Settings,
  BarChart3,
  Palette,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: LayoutDashboard,
    title: "9 Dashboard Variants",
    description: "Analytics, CRM, eCommerce, Finance, Crypto, Project, SaaS, HR, and Marketing — each with live data switching.",
    href: "/dashboard/analytics",
    badge: "Interactive",
  },
  {
    icon: ShoppingCart,
    title: "eCommerce Suite",
    description: "Products with filters, shopping cart, order history, wishlist — full buyer flow with context-based state.",
    href: "/ecommerce/products",
    badge: "Full CRUD",
  },
  {
    icon: Users,
    title: "User Management",
    description: "DataTable with search, sort, pagination, CSV export. Add, edit, view, delete users with form validation.",
    href: "/application/users",
    badge: "Full CRUD",
  },
  {
    icon: FileText,
    title: "Invoice System",
    description: "Create, edit, preview invoices. Clickable status badges, live sidebar stats that recalculate on every change.",
    href: "/application/invoices",
    badge: "Full CRUD",
  },
  {
    icon: MessageSquare,
    title: "Chat Application",
    description: "Per-user conversations, message sending with simulated replies, typing indicators, unread badges, search.",
    href: "/application/chat",
    badge: "Interactive",
  },
  {
    icon: Mail,
    title: "Email Client",
    description: "Compose, read, reply, forward emails. Folder management, label filtering, bulk actions, star toggle.",
    href: "/application/email",
    badge: "Interactive",
  },
  {
    icon: Calendar,
    title: "Calendar",
    description: "Month navigation, click-to-add events, view/edit/delete with dialogs. Events generated relative to today.",
    href: "/application/calendar",
    badge: "Full CRUD",
  },
  {
    icon: Settings,
    title: "Settings Suite",
    description: "5 pages with react-hook-form + zod validation. localStorage persistence — data survives page reloads.",
    href: "/settings/profile",
    badge: "Persistent",
  },
  {
    icon: BarChart3,
    title: "Charts & Tables",
    description: "ApexCharts with legend toggle, DataTable with full features. Form elements with live validation.",
    href: "/charts/apex-charts",
    badge: "Interactive",
  },
  {
    icon: Palette,
    title: "Theme Customizer",
    description: "10 color presets, dark/light mode, sidebar expand/collapse — all accessible from the settings gear.",
    href: "/dashboard/analytics",
    badge: "Live",
  },
];

export default function SamplePage() {
  return (
    <>
      <PageBreadcrumb
        title="Feature Overview"
        items={[{ label: "Other" }, { label: "Feature Overview" }]}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>SwitchYard Capital Feature Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            SwitchYard Capital is a fully interactive admin dashboard template built with Next.js 15, React 19, TypeScript, and Tailwind CSS.
            Every page below is functional — not just a static mockup. Click any card to explore.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} href={feature.href}>
              <Card className="h-full cursor-pointer transition-all hover:border-primary/50 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
                    >
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
