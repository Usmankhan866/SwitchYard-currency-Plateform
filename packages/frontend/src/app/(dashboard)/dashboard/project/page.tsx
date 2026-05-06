"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import { ArrowUp, ArrowDown, CalendarDays } from "lucide-react";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";

// ---------------------------------------------------------------------------
// Chart configs
// ---------------------------------------------------------------------------

const replyBarOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    height: 250,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  plotOptions: { bar: { columnWidth: "40%", borderRadius: 3 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
  colors: ["#4680ff"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  tooltip: { theme: "dark" },
};
const replyBarSeries = [{ name: "Response Time", data: [44, 55, 41, 67, 22, 43, 56] }];

const statsDonutOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 250, fontFamily: "inherit" },
  labels: ["Success", "Warning", "Purple", "Primary"],
  colors: ["#2ca87f", "#e58a00", "#7c4dff", "#4680ff"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: "60%" } } },
  tooltip: { theme: "dark" },
};
const statsDonutSeries = [23, 14, 35, 28];

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const leaderboard = [
  { name: "Emma Wilson", score: "+4,250", up: true },
  { name: "James Chen", score: "+3,890", up: true },
  { name: "Sofia Martinez", score: "-2,150", up: false },
  { name: "Lucas Brown", score: "+1,720", up: true },
  { name: "Olivia Taylor", score: "-980", up: false },
];

// ---------------------------------------------------------------------------
// User Project List mock data (15 rows) — inline per-page data
// ---------------------------------------------------------------------------

type ProjectStatus = "On Track" | "At Risk" | "Delayed";

interface UserProject {
  id: number;
  initials: string;
  name: string;
  project: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  bg: string;
}

const userProjects: UserProject[] = [
  { id: 1,  initials: "JS", name: "John Smith",     project: "Admin Dashboard",      progress: 85,  status: "On Track", dueDate: "Dec 15", bg: "bg-primary"   },
  { id: 2,  initials: "SJ", name: "Sarah Johnson",  project: "Mobile App",           progress: 62,  status: "At Risk",  dueDate: "Jan 05", bg: "bg-[#e58a00]" },
  { id: 3,  initials: "MB", name: "Mike Brown",     project: "E-commerce Site",      progress: 100, status: "On Track", dueDate: "Nov 20", bg: "bg-[#2ca87f]" },
  { id: 4,  initials: "ED", name: "Emily Davis",    project: "API Integration",      progress: 45,  status: "At Risk",  dueDate: "Jan 10", bg: "bg-[#04a9f5]" },
  { id: 5,  initials: "CW", name: "Chris Wilson",   project: "CMS Platform",         progress: 30,  status: "Delayed",  dueDate: "Feb 01", bg: "bg-[#7c4dff]" },
  { id: 6,  initials: "AM", name: "Alice Moore",    project: "Design System",        progress: 72,  status: "On Track", dueDate: "Jan 20", bg: "bg-[#dc2626]" },
  { id: 7,  initials: "BT", name: "Bob Taylor",     project: "Data Pipeline",        progress: 55,  status: "At Risk",  dueDate: "Feb 10", bg: "bg-[#1abc9c]" },
  { id: 8,  initials: "CL", name: "Clara Lewis",    project: "Auth Service",         progress: 90,  status: "On Track", dueDate: "Dec 30", bg: "bg-primary"   },
  { id: 9,  initials: "DH", name: "David Harris",   project: "Reporting Module",     progress: 20,  status: "Delayed",  dueDate: "Mar 01", bg: "bg-[#e58a00]" },
  { id: 10, initials: "EW", name: "Eva White",      project: "Customer Portal",      progress: 65,  status: "On Track", dueDate: "Jan 25", bg: "bg-[#2ca87f]" },
  { id: 11, initials: "FK", name: "Frank Kim",      project: "Notification System",  progress: 40,  status: "At Risk",  dueDate: "Feb 15", bg: "bg-[#04a9f5]" },
  { id: 12, initials: "GR", name: "Grace Roberts",  project: "Analytics Dashboard",  progress: 78,  status: "On Track", dueDate: "Jan 18", bg: "bg-[#7c4dff]" },
  { id: 13, initials: "HB", name: "Henry Brown",    project: "Payment Gateway",      progress: 15,  status: "Delayed",  dueDate: "Apr 01", bg: "bg-[#dc2626]" },
  { id: 14, initials: "IP", name: "Iris Parker",    project: "Search Feature",       progress: 88,  status: "On Track", dueDate: "Jan 12", bg: "bg-[#1abc9c]" },
  { id: 15, initials: "JN", name: "Jack Nelson",    project: "Onboarding Flow",      progress: 50,  status: "At Risk",  dueDate: "Feb 20", bg: "bg-primary"   },
];

// ===========================================================================
// Page Component
// ===========================================================================

const kpiBaselines = [
  { label: "Sales Statistics", value: 230598, total: 500000, color: "#4680ff" },
  { label: "Overdue Tasks",    value: 34,     total: 100,    color: "#dc2626" },
  { label: "Tasks to Do",      value: 25,     total: 100,    color: "#2ca87f" },
  { label: "Completed Tasks",  value: 19,     total: 100,    color: "#dc2626" },
];

export default function ProjectPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);

  const projectColumns = useMemo<ColumnDef<UserProject>[]>(
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
        accessorKey: "project",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Project" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.project}</span>
        ),
        meta: { mobileLabel: "Project" },
      },
      {
        accessorKey: "progress",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Progress" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${row.original.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{row.original.progress}%</span>
          </div>
        ),
        meta: { mobileLabel: "Progress" },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          const styles: Record<ProjectStatus, string> = {
            "On Track": "bg-[#2ca87f]/10 text-[#2ca87f]",
            "At Risk":  "bg-[#e58a00]/10 text-[#e58a00]",
            "Delayed":  "bg-[#dc2626]/10 text-[#dc2626]",
          };
          return (
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[s]}`}>
              {s}
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
        accessorKey: "dueDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Due Date" />
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">{row.original.dueDate}</span>
        ),
        meta: { mobileLabel: "Due Date" },
      },
    ],
    []
  );

  return (
    <>
      <PageBreadcrumb
        title="Project"
        items={[{ label: "Dashboard" }, { label: "Project" }]}
      />

      {/* ================================================================= */}
      {/* Row 1: Project Task | Sales Statistics | Upcoming Event            */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Project Task */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Project Task</CardTitle>
              <Badge className="bg-gradient-to-r from-[#2ca87f] to-[#04a9f5] text-white hover:from-[#2ca87f] hover:to-[#04a9f5]">
                23% Done
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    Complete Task
                  </span>
                  <span className="text-muted-foreground">6/10</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2ca87f] to-[#04a9f5]"
                    style={{ width: "60%" }}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Team: 28 Persons</p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Statistics */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Sales Statistics</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              <h2 className="mb-1 text-3xl font-semibold text-foreground">
                {kpiData[0].value.toLocaleString()}
              </h2>
              <p className="text-sm text-muted-foreground">
                Top selling items statistic by last period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Event */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Upcoming Event</CardTitle>
              <Badge className="bg-gradient-to-r from-primary to-[#04a9f5] text-white hover:from-primary hover:to-[#04a9f5]">
                34%
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 py-4">
              <CalendarDays className="h-12 w-12 text-primary" />
              <p className="text-sm font-medium text-foreground">
                45 Competitors
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 2: Reply | Statistics | Leaderboard                            */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Reply */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Average Response Time: 2.43h
              </p>
              <ApexChart
                type="bar"
                options={replyBarOpts}
                series={replyBarSeries}
                height={250}
              />
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={statsDonutOpts}
                series={statsDonutSeries}
                height={250}
              />
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: "Success", color: "#2ca87f", value: "23%" },
                  { label: "Warning", color: "#e58a00", value: "14%" },
                  { label: "Purple", color: "#7c4dff", value: "35%" },
                  { label: "Primary", color: "#4680ff", value: "28%" },
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

        {/* Leaderboard */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {leaderboard.map((entry, idx) => (
                  <li key={entry.name} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {entry.name}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-semibold ${
                        entry.up ? "text-[#2ca87f]" : "text-[#dc2626]"
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
      </div>

      {/* ================================================================= */}
      {/* Row 3: Overdue Tasks | Tasks to Do | Completed Task                */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Overdue Tasks */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Overdue Tasks</CardTitle>
              <Badge className="bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/20">
                -10%
              </Badge>
            </CardHeader>
            <CardContent>
              <h2 className="mb-1 text-3xl font-semibold text-foreground">
                {kpiData[1].value}
              </h2>
              <p className="text-sm text-muted-foreground">Last Week: 60%</p>
            </CardContent>
          </Card>
        </div>

        {/* Tasks to Do */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Tasks to Do</CardTitle>
              <Badge className="bg-[#2ca87f]/10 text-[#2ca87f] hover:bg-[#2ca87f]/20">
                +30%
              </Badge>
            </CardHeader>
            <CardContent>
              <h2 className="mb-1 text-3xl font-semibold text-foreground">
                {kpiData[2].value}
              </h2>
              <p className="text-sm text-muted-foreground">Last Week: 40%</p>
            </CardContent>
          </Card>
        </div>

        {/* Completed Task */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Completed Task</CardTitle>
              <Badge className="bg-[#dc2626]/10 text-[#dc2626] hover:bg-[#dc2626]/20">
                -25%
              </Badge>
            </CardHeader>
            <CardContent>
              <h2 className="mb-1 text-3xl font-semibold text-foreground">
                {kpiData[3].value}
              </h2>
              <p className="text-sm text-muted-foreground">Last Week: 70%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 4: User Project List                                           */}
      {/* ================================================================= */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Project List</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={projectColumns}
              data={userProjects}
              searchPlaceholder="Search projects..."
              facetedFilters={[
                {
                  columnId: "status",
                  title: "Status",
                  options: [
                    { label: "On Track", value: "On Track" },
                    { label: "At Risk",  value: "At Risk"  },
                    { label: "Delayed",  value: "Delayed"  },
                  ],
                },
              ]}
              perPageOptions={[5, 10, 15]}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
