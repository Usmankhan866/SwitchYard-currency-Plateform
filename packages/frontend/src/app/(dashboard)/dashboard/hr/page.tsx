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
import { Users, Briefcase, CalendarCheck, Clock, Check, X } from "lucide-react";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Row 1: KPI Sparklines
// ---------------------------------------------------------------------------

function kpiSparkOpts(color: string): ApexCharts.ApexOptions {
  return {
    chart: { type: "area", sparkline: { enabled: true } },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.05 } },
    stroke: { colors: [color], width: 2, curve: "smooth" },
    colors: [color],
    tooltip: { enabled: false },
  };
}

const empSparkOpts = kpiSparkOpts("#4680ff");
const employeesSparkSeries = [{ data: [210, 215, 218, 222, 225, 228, 232, 235, 238, 242, 245, 248] }];

const posSparkOpts = kpiSparkOpts("#04a9f5");
const openPositionsSparkSeries = [{ data: [8, 10, 12, 9, 11, 14, 13, 15, 16, 14, 15, 16] }];

const attSparkOpts = kpiSparkOpts("#2ca87f");
const attendanceSparkSeries = [{ data: [91, 92, 90, 93, 92, 94, 93, 95, 94, 93, 94, 94.2] }];

const tenSparkOpts = kpiSparkOpts("#e58a00");
const tenureSparkSeries = [{ data: [2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0, 3.0, 3.1, 3.1, 3.2, 3.2] }];

// ---------------------------------------------------------------------------
// Row 2: Headcount Trend line chart
// ---------------------------------------------------------------------------

const headcountTrendOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "line",
    height: 300,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  colors: ["#4680ff", "#dc2626"],
  xaxis: {
    categories: [
      "Apr 25", "May 25", "Jun 25", "Jul 25", "Aug 25", "Sep 25",
      "Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26",
    ],
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const headcountTrendSeries = [
  { name: "Headcount", data: [220, 225, 228, 232, 235, 238, 240, 242, 245, 244, 246, 248] },
  { name: "Departures", data: [3, 5, 2, 4, 3, 6, 2, 5, 3, 4, 2, 3] },
];

// ---------------------------------------------------------------------------
// Row 2: Department Breakdown donut chart
// ---------------------------------------------------------------------------

const departmentBreakdownOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 300, fontFamily: "inherit" },
  labels: ["Engineering", "Marketing", "Sales", "Design", "HR"],
  colors: ["#4680ff", "#1abc9c", "#e58a00", "#7c4dff", "#3ebfea"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: "60%" } } },
  tooltip: { theme: "dark" },
};
const departmentBreakdownSeries = [35, 25, 20, 12, 8];

// ---------------------------------------------------------------------------
// Row 3: Gender Distribution radialBar chart
// ---------------------------------------------------------------------------

const genderDistributionOpts: ApexCharts.ApexOptions = {
  chart: { type: "radialBar", height: 250, fontFamily: "inherit" },
  colors: ["#4680ff", "#e91e63"],
  labels: ["Male", "Female"],
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: { fontSize: "13px" },
        value: { fontSize: "14px" },
        total: {
          show: true,
          label: "Total",
          formatter: () => "248",
        },
      },
    },
  },
  tooltip: { theme: "dark" },
};
const genderDistributionSeries = [56, 44];

// ---------------------------------------------------------------------------
// Row 3: Attendance This Week column chart
// ---------------------------------------------------------------------------

const attendanceWeekOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 250, toolbar: { show: false }, fontFamily: "inherit" },
  plotOptions: { bar: { columnWidth: "50%", borderRadius: 3 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  colors: ["#1abc9c"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  tooltip: { theme: "dark" },
  yaxis: { min: 80, max: 100 },
};
const attendanceWeekSeries = [{ name: "Attendance %", data: [95, 92, 97, 94, 88] }];

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const upcomingEvents = [
  { title: "Team Standup", datetime: "Today 10:00 AM", dotColor: "bg-primary" },
  { title: "Sarah's Birthday", datetime: "Tomorrow", dotColor: "bg-[#e58a00]" },
  { title: "Q1 Review", datetime: "Mar 31", dotColor: "bg-[#3ebfea]" },
  { title: "New Hire Orientation", datetime: "Apr 1", dotColor: "bg-[#1abc9c]" },
  { title: "Company All-Hands", datetime: "Apr 3", dotColor: "bg-[#dc2626]" },
];

// ---------------------------------------------------------------------------
// Applications mock data (15 rows) — inline per-page data
// ---------------------------------------------------------------------------

type AppStatus = "New" | "Reviewed" | "Shortlisted";

interface Application {
  id: number;
  initials: string;
  name: string;
  position: string;
  dateApplied: string;
  status: AppStatus;
  bg: string;
}

const applications: Application[] = [
  { id: 1,  initials: "AK", name: "Alex Kumar",       position: "Senior Developer",    dateApplied: "Mar 28", status: "Reviewed",    bg: "bg-primary"   },
  { id: 2,  initials: "LP", name: "Lisa Park",        position: "UX Designer",         dateApplied: "Mar 27", status: "New",         bg: "bg-[#e58a00]" },
  { id: 3,  initials: "JR", name: "James Rodriguez",  position: "Sales Manager",       dateApplied: "Mar 26", status: "Shortlisted", bg: "bg-[#1abc9c]" },
  { id: 4,  initials: "MN", name: "Maria Nguyen",     position: "Data Analyst",        dateApplied: "Mar 25", status: "New",         bg: "bg-[#dc2626]" },
  { id: 5,  initials: "TW", name: "Tom Wilson",       position: "Marketing Lead",      dateApplied: "Mar 24", status: "Shortlisted", bg: "bg-[#7c4dff]" },
  { id: 6,  initials: "SC", name: "Sophia Chen",      position: "Backend Engineer",    dateApplied: "Mar 23", status: "Reviewed",    bg: "bg-[#04a9f5]" },
  { id: 7,  initials: "DB", name: "Daniel Brown",     position: "Product Manager",     dateApplied: "Mar 22", status: "New",         bg: "bg-[#2ca87f]" },
  { id: 8,  initials: "EM", name: "Emily Martinez",   position: "HR Specialist",       dateApplied: "Mar 21", status: "Reviewed",    bg: "bg-primary"   },
  { id: 9,  initials: "FK", name: "Frank Kim",        position: "DevOps Engineer",     dateApplied: "Mar 20", status: "Shortlisted", bg: "bg-[#e58a00]" },
  { id: 10, initials: "GL", name: "Grace Lee",        position: "Content Writer",      dateApplied: "Mar 19", status: "New",         bg: "bg-[#1abc9c]" },
  { id: 11, initials: "HS", name: "Henry Smith",      position: "QA Engineer",         dateApplied: "Mar 18", status: "Reviewed",    bg: "bg-[#dc2626]" },
  { id: 12, initials: "IJ", name: "Iris Johnson",     position: "UI Designer",         dateApplied: "Mar 17", status: "Shortlisted", bg: "bg-[#7c4dff]" },
  { id: 13, initials: "JP", name: "Jack Peters",      position: "Data Scientist",      dateApplied: "Mar 16", status: "New",         bg: "bg-[#04a9f5]" },
  { id: 14, initials: "KR", name: "Karen Rodriguez",  position: "Finance Analyst",     dateApplied: "Mar 15", status: "Reviewed",    bg: "bg-[#2ca87f]" },
  { id: 15, initials: "LT", name: "Leo Thompson",     position: "Full Stack Developer",dateApplied: "Mar 14", status: "Shortlisted", bg: "bg-primary"   },
];

// ---------------------------------------------------------------------------
// Leave Requests mock data (15 rows) — inline per-page data
// ---------------------------------------------------------------------------

type LeaveStatus = "Pending" | "Approved" | "Rejected";

interface LeaveRequest {
  id: number;
  initials: string;
  name: string;
  leaveType: string;
  from: string;
  to: string;
  days: number;
  status: LeaveStatus;
  bg: string;
}

const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  { id: 1,  initials: "AK", name: "Alex Kumar",       leaveType: "Vacation", from: "Apr 05", to: "Apr 12", days: 8,  status: "Pending",  bg: "bg-primary"   },
  { id: 2,  initials: "LP", name: "Lisa Park",        leaveType: "Sick",     from: "Mar 31", to: "Mar 31", days: 1,  status: "Approved", bg: "bg-[#e58a00]" },
  { id: 3,  initials: "JR", name: "James Rodriguez",  leaveType: "Personal", from: "Apr 02", to: "Apr 03", days: 2,  status: "Pending",  bg: "bg-[#1abc9c]" },
  { id: 4,  initials: "MN", name: "Maria Nguyen",     leaveType: "Vacation", from: "Apr 07", to: "Apr 14", days: 8,  status: "Rejected", bg: "bg-[#dc2626]" },
  { id: 5,  initials: "TW", name: "Tom Wilson",       leaveType: "Sick",     from: "Apr 01", to: "Apr 02", days: 2,  status: "Approved", bg: "bg-[#7c4dff]" },
  { id: 6,  initials: "SC", name: "Sophia Chen",      leaveType: "Personal", from: "Apr 10", to: "Apr 10", days: 1,  status: "Pending",  bg: "bg-[#04a9f5]" },
  { id: 7,  initials: "DB", name: "Daniel Brown",     leaveType: "Vacation", from: "Apr 15", to: "Apr 22", days: 8,  status: "Pending",  bg: "bg-[#2ca87f]" },
  { id: 8,  initials: "EM", name: "Emily Martinez",   leaveType: "Sick",     from: "Apr 03", to: "Apr 04", days: 2,  status: "Approved", bg: "bg-primary"   },
  { id: 9,  initials: "FK", name: "Frank Kim",        leaveType: "Vacation", from: "Apr 20", to: "Apr 27", days: 8,  status: "Pending",  bg: "bg-[#e58a00]" },
  { id: 10, initials: "GL", name: "Grace Lee",        leaveType: "Personal", from: "Apr 08", to: "Apr 09", days: 2,  status: "Rejected", bg: "bg-[#1abc9c]" },
  { id: 11, initials: "HS", name: "Henry Smith",      leaveType: "Sick",     from: "Apr 05", to: "Apr 07", days: 3,  status: "Approved", bg: "bg-[#dc2626]" },
  { id: 12, initials: "IJ", name: "Iris Johnson",     leaveType: "Vacation", from: "May 01", to: "May 08", days: 8,  status: "Pending",  bg: "bg-[#7c4dff]" },
  { id: 13, initials: "JP", name: "Jack Peters",      leaveType: "Personal", from: "Apr 14", to: "Apr 14", days: 1,  status: "Pending",  bg: "bg-[#04a9f5]" },
  { id: 14, initials: "KR", name: "Karen Rodriguez",  leaveType: "Sick",     from: "Apr 06", to: "Apr 07", days: 2,  status: "Approved", bg: "bg-[#2ca87f]" },
  { id: 15, initials: "LT", name: "Leo Thompson",     leaveType: "Vacation", from: "Apr 25", to: "May 02", days: 8,  status: "Pending",  bg: "bg-primary"   },
];

// ===========================================================================
// Page Component
// ===========================================================================

const kpiBaselines = [
  { label: "Total Employees", value: 248, total: 500,  color: "#4680ff" },
  { label: "Open Positions",  value: 16,  total: 50,   color: "#04a9f5" },
  { label: "Attendance Rate", value: 942, total: 1000, color: "#2ca87f" },
  { label: "Avg Tenure",      value: 32,  total: 120,  color: "#e58a00" },
];

export default function HrDashboardPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);

  const updateLeaveStatus = (id: number, newStatus: LeaveStatus) => {
    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (newStatus === "Approved") {
      toast.success("User approved");
    } else {
      toast.success("User rejected");
    }
  };

  const applicationsColumns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
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
        meta: { mobileLabel: "Name" },
      },
      {
        accessorKey: "position",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Position" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.position}</span>
        ),
        meta: { mobileLabel: "Position" },
      },
      {
        accessorKey: "dateApplied",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date Applied" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.dateApplied}</span>
        ),
        meta: { mobileLabel: "Date Applied" },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          const styles: Record<AppStatus, string> = {
            New: "bg-blue-100 text-blue-700",
            Reviewed: "bg-yellow-100 text-yellow-700",
            Shortlisted: "bg-green-100 text-green-700",
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
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white">
              View
            </button>
          </div>
        ),
        meta: { mobileLabel: "Actions" },
      },
    ],
    []
  );

  const leaveRequestsColumns = useMemo<ColumnDef<LeaveRequest>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
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
        meta: { mobileLabel: "Name" },
      },
      {
        accessorKey: "leaveType",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Leave Type" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.leaveType}</span>
        ),
        meta: { mobileLabel: "Leave Type" },
      },
      {
        accessorKey: "from",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="From" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.from}</span>
        ),
        meta: { mobileLabel: "From" },
      },
      {
        accessorKey: "to",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="To" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.to}</span>
        ),
        meta: { mobileLabel: "To" },
      },
      {
        accessorKey: "days",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Days" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.days}</span>
        ),
        meta: { mobileLabel: "Days" },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          const styles: Record<LeaveStatus, string> = {
            Pending: "bg-yellow-100 text-yellow-700",
            Approved: "bg-green-100 text-green-700",
            Rejected: "bg-red-100 text-red-700",
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
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateLeaveStatus(row.original.id, "Approved")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700 transition-colors hover:bg-green-200"
              aria-label={`Approve ${row.original.name}'s leave`}
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => updateLeaveStatus(row.original.id, "Rejected")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700 transition-colors hover:bg-red-200"
              aria-label={`Reject ${row.original.name}'s leave`}
            >
              <X className="h-3.5 w-3.5" />
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
        title="HR"
        items={[{ label: "Dashboard" }, { label: "HR" }]}
      />

      {/* ================================================================= */}
      {/* Row 1: KPI Cards                                                   */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Total Employees */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Employees</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{kpiData[0].value.toLocaleString()}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    +12 this month
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={empSparkOpts} series={employeesSparkSeries} height={80} />
            </div>
          </Card>
        </div>

        {/* Open Positions */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Open Positions</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{kpiData[1].value}</p>
                  <Badge className="mt-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                    5 urgent
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#04a9f5]/10">
                  <Briefcase className="h-5 w-5 text-[#04a9f5]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={posSparkOpts} series={openPositionsSparkSeries} height={80} />
            </div>
          </Card>
        </div>

        {/* Attendance Rate */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Attendance Rate</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{(kpiData[2].value / 10).toFixed(1)}%</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    +1.3%
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2ca87f]/10">
                  <CalendarCheck className="h-5 w-5 text-[#2ca87f]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={attSparkOpts} series={attendanceSparkSeries} height={80} />
            </div>
          </Card>
        </div>

        {/* Avg Tenure */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Avg Tenure</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{(kpiData[3].value / 10).toFixed(1)} years</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                    +0.4
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e58a00]/10">
                  <Clock className="h-5 w-5 text-[#e58a00]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={tenSparkOpts} series={tenureSparkSeries} height={80} />
            </div>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 2: Headcount Trend | Department Breakdown                       */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Headcount Trend */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Headcount Trend</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              <ApexChart
                type="line"
                options={headcountTrendOpts}
                series={headcountTrendSeries}
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Department Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={departmentBreakdownOpts}
                series={departmentBreakdownSeries}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 3: Gender Distribution | Attendance This Week | Upcoming Events */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Gender Distribution */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="radialBar"
                options={genderDistributionOpts}
                series={genderDistributionSeries}
                height={250}
              />
            </CardContent>
          </Card>
        </div>

        {/* Attendance This Week */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Attendance This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="bar"
                options={attendanceWeekOpts}
                series={attendanceWeekSeries}
                height={250}
              />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {upcomingEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                >
                  <span
                    className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${event.dotColor}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{event.datetime}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 4: Recent Applications                                        */}
      {/* ================================================================= */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={applicationsColumns}
              data={applications}
              searchPlaceholder="Search applicants..."
              facetedFilters={[
                {
                  columnId: "status",
                  title: "Status",
                  options: [
                    { label: "New", value: "New" },
                    { label: "Reviewed", value: "Reviewed" },
                    { label: "Shortlisted", value: "Shortlisted" },
                  ],
                },
              ]}
              perPageOptions={[5, 10, 15]}
            />
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Row 5: Leave Requests                                             */}
      {/* ================================================================= */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={leaveRequestsColumns}
              data={leaveRequests}
              searchPlaceholder="Search leave requests..."
              facetedFilters={[
                {
                  columnId: "status",
                  title: "Status",
                  options: [
                    { label: "Pending", value: "Pending" },
                    { label: "Approved", value: "Approved" },
                    { label: "Rejected", value: "Rejected" },
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
