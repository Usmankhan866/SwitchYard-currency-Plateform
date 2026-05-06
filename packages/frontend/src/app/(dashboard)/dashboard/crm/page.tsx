"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@dashboardpack/core/components/ui/dialog";
import { Button } from "@dashboardpack/core/components/ui/button";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import { ArrowUp, ArrowDown, Star, Phone, Check, X } from "lucide-react";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Row 1: Transactions sparkline
// ---------------------------------------------------------------------------

const txSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "line", height: 80, sparkline: { enabled: true } },
  stroke: { width: 2, curve: "smooth" },
  colors: ["#4680ff"],
  tooltip: { enabled: false },
};
const txSparkSeries = [{ data: [31, 40, 28, 51, 42, 85, 77, 65, 72, 58] }];

// Row 1: News Statistics horizontal bar
const newsBarOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 200, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: true, barHeight: "40%", borderRadius: 3 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Sport", "Music", "Travel", "News"] },
  colors: ["#1abc9c", "#3498db", "#4680ff", "#dc2626"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  tooltip: { theme: "dark" },
};
const newsBarSeries = [{ data: [53, 13, 30, 4] }];

// ---------------------------------------------------------------------------
// Row 2: Phone Calls donut
// ---------------------------------------------------------------------------

const callDonutOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 250 },
  labels: ["Answered", "Missed", "Voicemail"],
  colors: ["#4680ff", "#e58a00", "#dc2626"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: "60%" } } },
};
const callDonutSeries = [65, 25, 10];

// ---------------------------------------------------------------------------
// Row 3: Total Leads mini donut
// ---------------------------------------------------------------------------

const leadsDonutOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 160 },
  labels: ["Organic", "Purchased", "Blocked", "Buy Leads"],
  colors: ["#4680ff", "#1abc9c", "#dc2626", "#e58a00"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "65%" } } },
  tooltip: { theme: "dark" },
};
const leadsDonutSeries = [340, 150, 120, 245];

// ---------------------------------------------------------------------------
// Row 3: Markets sparklines
// ---------------------------------------------------------------------------

const mkSparkBase: ApexCharts.ApexOptions = {
  chart: { type: "line", sparkline: { enabled: true } },
  stroke: { width: 2, curve: "smooth" },
  tooltip: { enabled: false },
};

const dashSparkOpts: ApexCharts.ApexOptions = {
  ...mkSparkBase,
  colors: ["#1abc9c"],
};
const dashSparkSeries = [{ data: [20, 28, 22, 35, 30, 42, 38, 50, 45] }];

const ethSparkOpts: ApexCharts.ApexOptions = {
  ...mkSparkBase,
  colors: ["#dc2626"],
};
const ethSparkSeries = [{ data: [50, 42, 48, 35, 40, 28, 32, 22, 18] }];

const zecSparkOpts: ApexCharts.ApexOptions = {
  ...mkSparkBase,
  colors: ["#1abc9c"],
};
const zecSparkSeries = [{ data: [15, 22, 18, 30, 25, 38, 32, 42, 40] }];

const btcSparkOpts: ApexCharts.ApexOptions = {
  ...mkSparkBase,
  colors: ["#1abc9c"],
};
const btcSparkSeries = [{ data: [25, 34, 28, 42, 36, 52, 46, 60, 55] }];

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Recent Users mock data (15 rows) — inline per-page data
// ---------------------------------------------------------------------------

type UserStatus = "Approved" | "Pending";

interface RecentUser {
  id: number;
  initials: string;
  name: string;
  email: string;
  bg: string;
  status: UserStatus;
}

const INITIAL_RECENT_USERS: RecentUser[] = [
  { id: 1,  initials: "AS", name: "Alex Smith",     email: "alex.smith@example.com",   bg: "bg-primary",   status: "Approved" },
  { id: 2,  initials: "JD", name: "John Doe",       email: "john.doe@example.com",     bg: "bg-[#2ca87f]", status: "Pending"  },
  { id: 3,  initials: "SW", name: "Sarah Wilson",   email: "sarah.wilson@example.com", bg: "bg-[#e58a00]", status: "Approved" },
  { id: 4,  initials: "MJ", name: "Mike Johnson",   email: "mike.j@example.com",       bg: "bg-[#04a9f5]", status: "Pending"  },
  { id: 5,  initials: "EL", name: "Emma Lewis",     email: "emma.lewis@example.com",   bg: "bg-[#7c4dff]", status: "Pending"  },
  { id: 6,  initials: "DK", name: "David Kim",      email: "david.kim@example.com",    bg: "bg-[#dc2626]", status: "Approved" },
  { id: 7,  initials: "NB", name: "Nina Brown",     email: "nina.brown@example.com",   bg: "bg-[#1abc9c]", status: "Pending"  },
  { id: 8,  initials: "OT", name: "Oliver Taylor",  email: "o.taylor@example.com",     bg: "bg-primary",   status: "Approved" },
  { id: 9,  initials: "PG", name: "Priya Gupta",    email: "priya.g@example.com",      bg: "bg-[#e58a00]", status: "Pending"  },
  { id: 10, initials: "RH", name: "Ryan Harris",    email: "ryan.h@example.com",       bg: "bg-[#04a9f5]", status: "Approved" },
  { id: 11, initials: "SC", name: "Sophia Clark",   email: "sophia.c@example.com",     bg: "bg-[#2ca87f]", status: "Pending"  },
  { id: 12, initials: "TN", name: "Thomas Nguyen",  email: "t.nguyen@example.com",     bg: "bg-[#7c4dff]", status: "Approved" },
  { id: 13, initials: "UA", name: "Uma Anderson",   email: "uma.a@example.com",        bg: "bg-[#dc2626]", status: "Pending"  },
  { id: 14, initials: "VM", name: "Victor Moore",   email: "v.moore@example.com",      bg: "bg-[#1abc9c]", status: "Approved" },
  { id: 15, initials: "WP", name: "Wendy Parker",   email: "wendy.p@example.com",      bg: "bg-primary",   status: "Pending"  },
];

interface LeaderboardPerson {
  name: string;
  score: string;
  up: boolean;
  initials: string;
  bg: string;
  role: string;
  dealsClosed: number;
  revenue: string;
  conversionRate: string;
  avgDealSize: string;
  monthlyPerformance: { month: string; deals: number }[];
}

const leaderboard: LeaderboardPerson[] = [
  {
    name: "Silje Larsen", score: "+3,784", up: true,
    initials: "SL", bg: "bg-primary", role: "Senior Sales Rep",
    dealsClosed: 47, revenue: "$284,500", conversionRate: "34%", avgDealSize: "$6,053",
    monthlyPerformance: [
      { month: "Jan", deals: 6 }, { month: "Feb", deals: 8 }, { month: "Mar", deals: 5 },
      { month: "Apr", deals: 9 }, { month: "May", deals: 10 }, { month: "Jun", deals: 9 },
    ],
  },
  {
    name: "Julie Vad", score: "+3,544", up: true,
    initials: "JV", bg: "bg-[#1abc9c]", role: "Account Executive",
    dealsClosed: 42, revenue: "$256,200", conversionRate: "31%", avgDealSize: "$6,100",
    monthlyPerformance: [
      { month: "Jan", deals: 7 }, { month: "Feb", deals: 6 }, { month: "Mar", deals: 8 },
      { month: "Apr", deals: 7 }, { month: "May", deals: 8 }, { month: "Jun", deals: 6 },
    ],
  },
  {
    name: "Storm Hansen", score: "-2,739", up: false,
    initials: "SH", bg: "bg-[#e58a00]", role: "Sales Rep",
    dealsClosed: 28, revenue: "$142,800", conversionRate: "22%", avgDealSize: "$5,100",
    monthlyPerformance: [
      { month: "Jan", deals: 7 }, { month: "Feb", deals: 6 }, { month: "Mar", deals: 5 },
      { month: "Apr", deals: 4 }, { month: "May", deals: 3 }, { month: "Jun", deals: 3 },
    ],
  },
  {
    name: "Frida Landin", score: "+1,899", up: true,
    initials: "FL", bg: "bg-[#7c4dff]", role: "Business Development",
    dealsClosed: 35, revenue: "$198,400", conversionRate: "28%", avgDealSize: "$5,669",
    monthlyPerformance: [
      { month: "Jan", deals: 4 }, { month: "Feb", deals: 5 }, { month: "Mar", deals: 6 },
      { month: "Apr", deals: 6 }, { month: "May", deals: 7 }, { month: "Jun", deals: 7 },
    ],
  },
  {
    name: "Mai Larsen", score: "-1,600", up: false,
    initials: "ML", bg: "bg-[#dc2626]", role: "Junior Sales Rep",
    dealsClosed: 19, revenue: "$89,300", conversionRate: "18%", avgDealSize: "$4,700",
    monthlyPerformance: [
      { month: "Jan", deals: 5 }, { month: "Feb", deals: 4 }, { month: "Mar", deals: 3 },
      { month: "Apr", deals: 3 }, { month: "May", deals: 2 }, { month: "Jun", deals: 2 },
    ],
  },
];

const markets = [
  {
    pair: "DASH/USD",
    price: "1.0452",
    change: "+2.56%",
    up: true,
    opts: dashSparkOpts,
    series: dashSparkSeries,
  },
  {
    pair: "ETH/USD",
    price: "0.0157",
    change: "-0.87%",
    up: false,
    opts: ethSparkOpts,
    series: ethSparkSeries,
  },
  {
    pair: "ZEC/USD",
    price: "2.0764",
    change: "+1.56%",
    up: true,
    opts: zecSparkOpts,
    series: zecSparkSeries,
  },
  {
    pair: "BTC/USD",
    price: "1.0452",
    change: "+2.56%",
    up: true,
    opts: btcSparkOpts,
    series: btcSparkSeries,
  },
];

// ===========================================================================
// Page Component
// ===========================================================================

const kpiBaselines = [
  { label: "Transactions", value: 59482, total: 100000, color: "#4680ff" },
  { label: "Total Leads",  value: 59482, total: 100000, color: "#1abc9c" },
];

export default function CrmPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);

  const [recentUsers, setRecentUsers] = useState<RecentUser[]>(INITIAL_RECENT_USERS);
  const [selectedPerson, setSelectedPerson] = useState<LeaderboardPerson | null>(null);

  const updateUserStatus = (id: number, newStatus: UserStatus) => {
    setRecentUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    if (newStatus === "Approved") {
      toast.success("User approved");
    } else {
      toast.success("User rejected");
    }
  };

  const recentUsersColumns = useMemo<ColumnDef<RecentUser>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="User" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${row.original.bg}`}
            >
              {row.original.initials}
            </div>
            <span className="font-medium text-foreground">{row.original.name}</span>
          </div>
        ),
        meta: { mobileLabel: "User" },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
        meta: { mobileLabel: "Email" },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status}
            </span>
          );
        },
        filterFn: (row, _id, filterValues: string[]) => {
          if (!filterValues.length) return true;
          return filterValues.includes(row.original.status);
        },
        meta: { mobileLabel: "Status" },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateUserStatus(row.original.id, "Approved")}
              className="flex items-center gap-1 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              aria-label={`Approve ${row.original.name}`}
            >
              <Check className="h-3 w-3" />
              Approve
            </button>
            <button
              onClick={() => updateUserStatus(row.original.id, "Pending")}
              className="flex items-center gap-1 rounded-md bg-[#dc2626]/10 px-3 py-1.5 text-xs font-medium text-[#dc2626] transition-colors hover:bg-[#dc2626] hover:text-white"
              aria-label={`Reject ${row.original.name}`}
            >
              <X className="h-3 w-3" />
              Reject
            </button>
          </div>
        ),
        meta: { mobileLabel: "Actions" },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <PageBreadcrumb
        title="CRM"
        items={[{ label: "Dashboard" }, { label: "CRM" }]}
      />

      {/* ================================================================= */}
      {/* Row 1: Transactions | Project Rating | News Statistics             */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Transactions */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Transactions</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              <h2 className="mb-1 text-3xl font-semibold text-foreground">
                ${kpiData[0].value.toLocaleString()}
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Total this period
              </p>
              <ApexChart
                type="line"
                options={txSparkOpts}
                series={txSparkSeries}
                height={80}
              />
            </CardContent>
          </Card>
        </div>

        {/* Project Rating */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Project Rating</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-4">
              <div className="mb-3 flex items-center gap-2">
                <Star className="h-10 w-10 fill-[#e58a00] text-[#e58a00]" />
                <span className="text-5xl font-semibold text-foreground">
                  4.3
                </span>
              </div>
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i <= 4
                        ? "fill-[#e58a00] text-[#e58a00]"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <Badge className="bg-[#1abc9c] text-white hover:bg-[#1abc9c]/90">
                <ArrowUp className="me-1 h-3 w-3" />
                +0.4 this month
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* News Statistics */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>News Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="bar"
                options={newsBarOpts}
                series={newsBarSeries}
                height={200}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 2: Phone Calls | Recent Users                                  */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Phone Calls */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Phone className="h-4 w-4 text-primary" />
              <CardTitle>Phone Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={callDonutOpts}
                series={callDonutSeries}
                height={250}
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Users */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={recentUsersColumns}
                data={recentUsers}
                searchPlaceholder="Search users..."
                facetedFilters={[
                  {
                    columnId: "status",
                    title: "Status",
                    options: [
                      { label: "Approved", value: "Approved" },
                      { label: "Pending", value: "Pending" },
                    ],
                  },
                ]}
                perPageOptions={[5, 10, 15]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 3: Leaderboard | Total Leads | Markets                         */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Leaderboard */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {leaderboard.map((entry, idx) => (
                  <li
                    key={entry.name}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-1.5 -mx-1.5 transition-colors hover:bg-muted/50"
                    onClick={() => setSelectedPerson(entry)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedPerson(entry); } }}
                    aria-label={`View performance details for ${entry.name}`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {entry.name}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-semibold ${
                        entry.up ? "text-[#1abc9c]" : "text-[#dc2626]"
                      }`}
                    >
                      {entry.up ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {entry.score}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Performance Detail Dialog */}
        <Dialog open={!!selectedPerson} onOpenChange={(open) => { if (!open) setSelectedPerson(null); }}>
          <DialogContent className="sm:max-w-md">
            {selectedPerson && (
              <>
                <DialogHeader>
                  <DialogTitle>Performance Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-5">
                  {/* Avatar + Name + Role */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${selectedPerson.bg}`}
                    >
                      {selectedPerson.initials}
                    </div>
                    <div>
                      <p className="text-base font-semibold text-foreground">{selectedPerson.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedPerson.role}</p>
                    </div>
                    <span
                      className={`ms-auto flex items-center gap-0.5 text-sm font-semibold ${
                        selectedPerson.up ? "text-[#1abc9c]" : "text-[#dc2626]"
                      }`}
                    >
                      {selectedPerson.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {selectedPerson.score}
                    </span>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Deals Closed", value: selectedPerson.dealsClosed.toString() },
                      { label: "Revenue Generated", value: selectedPerson.revenue },
                      { label: "Conversion Rate", value: selectedPerson.conversionRate },
                      { label: "Avg Deal Size", value: selectedPerson.avgDealSize },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg border bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Monthly Performance Progress Bars */}
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Monthly Deals</p>
                    <div className="space-y-2">
                      {selectedPerson.monthlyPerformance.map((mp) => {
                        const maxDeals = Math.max(...selectedPerson.monthlyPerformance.map((m) => m.deals));
                        const pct = maxDeals > 0 ? (mp.deals / maxDeals) * 100 : 0;
                        return (
                          <div key={mp.month} className="flex items-center gap-3">
                            <span className="w-8 text-xs text-muted-foreground">{mp.month}</span>
                            <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-6 text-right text-xs font-medium text-foreground">{mp.deals}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button
                    className="w-full"
                    onClick={() => toast.info("Profile page coming soon")}
                  >
                    View Profile
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Total Leads */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="mb-4 text-3xl font-semibold text-foreground">
                ${kpiData[1].value.toLocaleString()}
              </h2>
              <ApexChart
                type="donut"
                options={leadsDonutOpts}
                series={leadsDonutSeries}
                height={160}
              />
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: "Organic", color: "#4680ff", value: 340 },
                  { label: "Purchased", color: "#1abc9c", value: 150 },
                  { label: "Blocked", color: "#dc2626", value: 120 },
                  { label: "Buy Leads", color: "#e58a00", value: 245 },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="ms-auto text-xs font-medium text-foreground">
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Markets */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {markets.map((market) => (
                  <li
                    key={market.pair}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {market.pair}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {market.price}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <ApexChart
                        type="line"
                        options={market.opts}
                        series={market.series}
                        width={60}
                        height={30}
                      />
                    </div>
                    <span
                      className={`flex shrink-0 items-center gap-0.5 text-xs font-semibold ${
                        market.up ? "text-[#1abc9c]" : "text-[#dc2626]"
                      }`}
                    >
                      {market.up ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {market.change}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
