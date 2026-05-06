"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import { DollarSign, TrendingUp, UserMinus, Heart } from "lucide-react";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";

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
const mrrSparkOpts = kpiSparkOpts("#4680ff");
const mrrSparkSeries = [{ data: [28, 35, 30, 42, 38, 52, 46, 60, 55, 70, 65, 82] }];
const arrSparkOpts = kpiSparkOpts("#1abc9c");
const arrSparkSeries = [{ data: [320, 380, 350, 440, 410, 520, 480, 580, 545, 620, 595, 680] }];
const churnSparkOpts = kpiSparkOpts("#dc2626");
const churnSparkSeries = [{ data: [3.2, 3.0, 2.9, 2.8, 3.1, 2.7, 2.6, 2.5, 2.7, 2.5, 2.4, 2.4] }];
const ltvSparkOpts = kpiSparkOpts("#e58a00");
const ltvSparkSeries = [{ data: [980, 1020, 1050, 1080, 1100, 1120, 1130, 1155, 1180, 1200, 1220, 1240] }];

// ---------------------------------------------------------------------------
// Row 2: Revenue Growth area chart
// ---------------------------------------------------------------------------

const revenueGrowthOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    height: 350,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  fill: {
    type: "solid",
    opacity: 0.15,
  },
  colors: ["#4680ff", "#1abc9c"],
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const revenueGrowthSeries = [
  { name: "MRR ($K)", data: [28, 32, 30, 38, 36, 42, 44, 48, 46, 50, 52, 58] },
  { name: "ARR ($K)", data: [336, 384, 360, 456, 432, 504, 528, 576, 552, 600, 624, 696] },
];

// ---------------------------------------------------------------------------
// Row 2: Revenue by Plan donut chart
// ---------------------------------------------------------------------------

const revenueByPlanOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 350, fontFamily: "inherit" },
  labels: ["Enterprise", "Professional", "Starter", "Free"],
  colors: ["#4680ff", "#1abc9c", "#e58a00", "#e9ecef"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: "60%" } } },
  tooltip: { theme: "dark" },
};
const revenueByPlanSeries = [45, 30, 15, 10];

// ---------------------------------------------------------------------------
// Row 3: Customer Growth bar chart
// ---------------------------------------------------------------------------

const customerGrowthOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 280, toolbar: { show: false }, fontFamily: "inherit" },
  plotOptions: { bar: { columnWidth: "50%", borderRadius: 3 } },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"] },
  colors: ["#1abc9c", "#dc2626"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const customerGrowthSeries = [
  { name: "New Customers", data: [120, 145, 132, 168, 155, 189] },
  { name: "Churned", data: [8, 12, 6, 15, 9, 11] },
];

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const topMetrics = [
  { label: "Trial-to-Paid Rate", value: "25%", change: "+2.1%" },
  { label: "Avg Revenue Per User", value: "$48", change: "+$3" },
  { label: "Expansion Revenue", value: "$4,200", change: "+12%" },
  { label: "Net Revenue Retention", value: "108%", change: "+3%" },
  { label: "Quick Ratio", value: "3.2x", change: "+0.4" },
];

const transactions = [
  {
    initials: "SJ",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    plan: "Enterprise",
    amount: "$2,999/yr",
    date: "Jan 07",
    status: "Active",
    statusStyle: "bg-green-100 text-green-700",
    mrrImpact: "+$250",
    mrrColor: "text-[#2ca87f]",
    bg: "bg-primary",
  },
  {
    initials: "MC",
    name: "Michael Chen",
    email: "m.chen@example.com",
    plan: "Professional",
    amount: "$49/mo",
    date: "Jan 06",
    status: "Active",
    statusStyle: "bg-green-100 text-green-700",
    mrrImpact: "+$49",
    mrrColor: "text-[#2ca87f]",
    bg: "bg-[#2ca87f]",
  },
  {
    initials: "EW",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    plan: "Starter",
    amount: "$19/mo",
    date: "Jan 05",
    status: "Trial",
    statusStyle: "bg-blue-100 text-blue-700",
    mrrImpact: "+$0",
    mrrColor: "text-muted-foreground",
    bg: "bg-[#04a9f5]",
  },
  {
    initials: "AR",
    name: "Alex Rodriguez",
    email: "alex.r@example.com",
    plan: "Enterprise",
    amount: "$2,999/yr",
    date: "Jan 04",
    status: "Active",
    statusStyle: "bg-green-100 text-green-700",
    mrrImpact: "+$250",
    mrrColor: "text-[#2ca87f]",
    bg: "bg-[#7c4dff]",
  },
  {
    initials: "MG",
    name: "Maria Garcia",
    email: "m.garcia@example.com",
    plan: "Professional",
    amount: "$49/mo",
    date: "Jan 03",
    status: "Churned",
    statusStyle: "bg-red-100 text-red-700",
    mrrImpact: "-$49",
    mrrColor: "text-[#dc2626]",
    bg: "bg-[#e58a00]",
  },
  {
    initials: "DK",
    name: "David Kim",
    email: "d.kim@example.com",
    plan: "Starter",
    amount: "$19/mo",
    date: "Jan 02",
    status: "Active",
    statusStyle: "bg-green-100 text-green-700",
    mrrImpact: "+$19",
    mrrColor: "text-[#2ca87f]",
    bg: "bg-[#3ebfea]",
  },
];

// ===========================================================================
// Page Component
// ===========================================================================

const kpiBaselines = [
  { label: "MRR",   value: 48250,  total: 100000,  color: "#4680ff" },
  { label: "ARR",   value: 579000, total: 1000000, color: "#1abc9c" },
  { label: "Churn", value: 24,     total: 100,     color: "#dc2626" },
  { label: "LTV",   value: 1240,   total: 5000,    color: "#e58a00" },
];

const revenueGrowthSeriesByRange: Record<Range, ApexCharts.ApexOptions["series"]> = {
  "7d": [
    { name: "MRR ($K)", data: [8, 9, 8, 11, 10, 12, 12] },
    { name: "ARR ($K)", data: [96, 108, 96, 132, 120, 144, 144] },
  ],
  "30d": revenueGrowthSeries,
  "90d": [
    { name: "MRR ($K)", data: [84, 96, 90, 114, 108, 126, 132, 144, 138, 150, 156, 174] },
    { name: "ARR ($K)", data: [1008, 1152, 1080, 1368, 1296, 1512, 1584, 1728, 1656, 1800, 1872, 2088] },
  ],
};

export default function SaasDashboardPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);
  const activeRevenueSeries = revenueGrowthSeriesByRange[dateRange];

  return (
    <>
      <PageBreadcrumb
        title="SaaS"
        items={[{ label: "Dashboard" }, { label: "SaaS" }]}
      />

      {/* ================================================================= */}
      {/* Row 1: KPI Cards                                                   */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* MRR */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
                  <p className="mt-1 text-2xl font-light text-foreground">${kpiData[0].value.toLocaleString()}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">+12.5%</Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={mrrSparkOpts} series={mrrSparkSeries} height={80} />
            </div>
          </Card>
        </div>

        {/* ARR */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Annual Recurring Revenue</p>
                  <p className="mt-1 text-2xl font-light text-foreground">${kpiData[1].value.toLocaleString()}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">+8.3%</Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1abc9c]/10">
                  <TrendingUp className="h-5 w-5 text-[#1abc9c]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={arrSparkOpts} series={arrSparkSeries} height={80} />
            </div>
          </Card>
        </div>

        {/* Churn Rate */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Churn Rate</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{(kpiData[2].value / 10).toFixed(1)}%</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">-0.3%</Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dc2626]/10">
                  <UserMinus className="h-5 w-5 text-[#dc2626]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={churnSparkOpts} series={churnSparkSeries} height={80} />
            </div>
          </Card>
        </div>

        {/* LTV */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Customer Lifetime Value</p>
                  <p className="mt-1 text-2xl font-light text-foreground">${kpiData[3].value.toLocaleString()}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">+$85</Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e58a00]/10">
                  <Heart className="h-5 w-5 text-[#e58a00]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart type="area" options={ltvSparkOpts} series={ltvSparkSeries} height={80} />
            </div>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 2: Revenue Growth | Revenue by Plan                            */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Revenue Growth */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Revenue Growth</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              <ApexChart
                key={dateRange}
                type="area"
                options={revenueGrowthOpts}
                series={activeRevenueSeries}
                height={350}
              />
            </CardContent>
          </Card>
        </div>

        {/* Revenue by Plan */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Revenue by Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={revenueByPlanOpts}
                series={revenueByPlanSeries}
                height={350}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 3: Conversion Funnel | Customer Growth | Top Metrics           */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Conversion Funnel */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Visitors */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Visitors</span>
                  <span className="text-muted-foreground">
                    12,450 <span className="text-xs">(100%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-muted-foreground/40" />
                </div>
              </div>

              {/* Signups */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Signups</span>
                  <span className="text-muted-foreground">
                    1,867 <span className="text-xs">(15%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-full rounded-full bg-primary" />
                </div>
              </div>

              {/* Active Trial */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Active Trial</span>
                  <span className="text-muted-foreground">
                    934 <span className="text-xs">(7.5%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/2 rounded-full bg-[#e58a00]" />
                </div>
              </div>

              {/* Paid */}
              <div>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Paid</span>
                  <span className="text-muted-foreground">
                    467 <span className="text-xs">(3.75%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-1/4 rounded-full bg-[#2ca87f]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Growth */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Customer Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="bar"
                options={customerGrowthOpts}
                series={customerGrowthSeries}
                height={280}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Metrics */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Metrics</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {topMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <span className="text-sm">{metric.label}</span>
                  <div className="text-end">
                    <span className="text-sm font-medium">{metric.value}</span>
                    <span className="ms-2 text-xs text-[#2ca87f]">
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 4: Recent Transactions                                          */}
      {/* ================================================================= */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="px-6 pb-3 font-medium">Customer</th>
                    <th className="px-4 pb-3 font-medium">Plan</th>
                    <th className="px-4 pb-3 font-medium">Amount</th>
                    <th className="px-4 pb-3 font-medium">Date</th>
                    <th className="px-4 pb-3 font-medium">Status</th>
                    <th className="px-6 pb-3 text-right font-medium">
                      MRR Impact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx) => (
                    <tr key={tx.email} className="hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${tx.bg}`}
                          >
                            {tx.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {tx.name}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {tx.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-foreground">
                        {tx.plan}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-foreground">
                        {tx.amount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {tx.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.statusStyle}`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td
                        className={`whitespace-nowrap px-6 py-3 text-right text-sm font-semibold ${tx.mrrColor}`}
                      >
                        {tx.mrrImpact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
