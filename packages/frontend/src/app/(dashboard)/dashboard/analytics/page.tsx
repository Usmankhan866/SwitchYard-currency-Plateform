"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Tablet,
  Download,
  Plus,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@dashboardpack/core/components/ui/dialog";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import { WorldMap } from "@/components/dashboard/world-map";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Animated count-up hook
// ---------------------------------------------------------------------------

function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

// ---------------------------------------------------------------------------
// Mock data for region detail dialogs
// ---------------------------------------------------------------------------

const regionDetails: Record<
  string,
  {
    traffic: string;
    revenue: string;
    conversion: string;
    topPages: { page: string; views: string }[];
  }
> = {
  "North America": {
    traffic: "1.2M sessions",
    revenue: "$247,890",
    conversion: "4.8%",
    topPages: [
      { page: "/pricing", views: "142K" },
      { page: "/features", views: "98K" },
      { page: "/dashboard", views: "87K" },
      { page: "/signup", views: "64K" },
    ],
  },
  Europe: {
    traffic: "890K sessions",
    revenue: "$198,456",
    conversion: "4.2%",
    topPages: [
      { page: "/pricing", views: "105K" },
      { page: "/about", views: "78K" },
      { page: "/features", views: "72K" },
      { page: "/blog", views: "55K" },
    ],
  },
  "Asia Pacific": {
    traffic: "720K sessions",
    revenue: "$156,789",
    conversion: "5.1%",
    topPages: [
      { page: "/pricing", views: "98K" },
      { page: "/demo", views: "85K" },
      { page: "/features", views: "67K" },
      { page: "/docs", views: "52K" },
    ],
  },
  "Latin America": {
    traffic: "340K sessions",
    revenue: "$89,234",
    conversion: "3.1%",
    topPages: [
      { page: "/pricing", views: "45K" },
      { page: "/features", views: "38K" },
      { page: "/blog", views: "29K" },
      { page: "/signup", views: "22K" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Mock data for KPI card drill-down dialogs
// ---------------------------------------------------------------------------

const kpiBreakdowns: Record<
  string,
  {
    dailyTrend: { day: string; value: string }[];
    segments: { name: string; value: string; pct: string }[];
  }
> = {
  "Total Revenue": {
    dailyTrend: [
      { day: "Mon", value: "$28,420" },
      { day: "Tue", value: "$31,890" },
      { day: "Wed", value: "$26,750" },
      { day: "Thu", value: "$34,210" },
      { day: "Fri", value: "$29,180" },
      { day: "Sat", value: "$18,920" },
      { day: "Sun", value: "$15,340" },
    ],
    segments: [
      { name: "Subscriptions", value: "$412,500", pct: "48.7%" },
      { name: "One-time Sales", value: "$247,890", pct: "29.3%" },
      { name: "Enterprise", value: "$186,900", pct: "22.0%" },
    ],
  },
  "Active Users": {
    dailyTrend: [
      { day: "Mon", value: "3,842" },
      { day: "Tue", value: "4,125" },
      { day: "Wed", value: "3,967" },
      { day: "Thu", value: "4,312" },
      { day: "Fri", value: "3,756" },
      { day: "Sat", value: "2,489" },
      { day: "Sun", value: "2,198" },
    ],
    segments: [
      { name: "Free Tier", value: "14,820", pct: "60.0%" },
      { name: "Pro Plan", value: "7,410", pct: "30.0%" },
      { name: "Enterprise", value: "2,459", pct: "10.0%" },
    ],
  },
  Orders: {
    dailyTrend: [
      { day: "Mon", value: "312" },
      { day: "Tue", value: "287" },
      { day: "Wed", value: "345" },
      { day: "Thu", value: "298" },
      { day: "Fri", value: "267" },
      { day: "Sat", value: "189" },
      { day: "Sun", value: "149" },
    ],
    segments: [
      { name: "Digital Products", value: "1,108", pct: "60.0%" },
      { name: "Services", value: "462", pct: "25.0%" },
      { name: "Support Plans", value: "277", pct: "15.0%" },
    ],
  },
  "Conversion Rate": {
    dailyTrend: [
      { day: "Mon", value: "3.8%" },
      { day: "Tue", value: "4.1%" },
      { day: "Wed", value: "3.5%" },
      { day: "Thu", value: "4.3%" },
      { day: "Fri", value: "3.9%" },
      { day: "Sat", value: "2.8%" },
      { day: "Sun", value: "2.4%" },
    ],
    segments: [
      { name: "Organic Search", value: "5.2%", pct: "42%" },
      { name: "Direct Traffic", value: "3.8%", pct: "31%" },
      { name: "Social Media", value: "2.1%", pct: "27%" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Section 1: KPI Sparkline configs
// ---------------------------------------------------------------------------

const revenueSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "line", width: 80, height: 50, sparkline: { enabled: true } },
  stroke: { width: 2, colors: ["#ffffff"] },
  tooltip: { enabled: false },
};
const revenueSparkSeries = [{ data: [31, 40, 28, 51, 42, 85, 77] }];

const usersSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "area", width: 80, height: 50, sparkline: { enabled: true } },
  fill: { colors: ["#ffffff"], opacity: 0.3 },
  stroke: { colors: ["#ffffff"] },
  tooltip: { enabled: false },
};
const usersSparkSeries = [{ data: [15, 42, 30, 55, 38, 62, 48] }];

const ordersSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", width: 80, height: 50, sparkline: { enabled: true } },
  colors: ["#ffffff"],
  tooltip: { enabled: false },
};
const ordersSparkSeries = [{ data: [25, 66, 41, 89, 63, 25, 44] }];

const conversionSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "line", width: 80, height: 50, sparkline: { enabled: true } },
  stroke: { width: 2, colors: ["#ffffff"], curve: "smooth" },
  tooltip: { enabled: false },
};
const conversionSparkSeries = [{ data: [12, 18, 15, 22, 19, 28, 25] }];

// ---------------------------------------------------------------------------
// Section 2: Real-time Analytics area chart
// ---------------------------------------------------------------------------

const realtimeOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    height: 350,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: ["#4680ff", "#04a9f5"],
  fill: { opacity: 0.3 },
  stroke: { curve: "smooth", width: 2 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisBorder: { show: false },
    labels: { style: { colors: "#888", fontSize: "12px" } },
  },
  yaxis: {
    labels: { style: { colors: "#888", fontSize: "12px" } },
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: { colors: "#888" },
    markers: { size: 4, offsetX: -2 },
  },
  tooltip: { theme: "dark" },
};
const realtimeSeries = [
  { name: "Sessions", data: [31, 40, 28, 51, 42, 85, 77, 95, 87, 73, 69, 85] },
  { name: "Page Views", data: [87, 76, 65, 89, 95, 76, 89, 67, 78, 95, 87, 92] },
];

// Section 2: Device Analytics donut
const deviceDonutOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 200, fontFamily: "inherit" },
  colors: ["#4680ff", "#2ca87f", "#e58a00"],
  labels: ["Desktop", "Mobile", "Tablet"],
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: { size: "65%" },
    },
  },
  tooltip: { theme: "dark" },
};
const deviceDonutSeries = [45.8, 38.7, 15.5];

// ---------------------------------------------------------------------------
// Section 4: Performance gauge charts
// ---------------------------------------------------------------------------

const salesGaugeOpts: ApexCharts.ApexOptions = {
  chart: { type: "radialBar", height: 160, fontFamily: "inherit" },
  colors: ["#4680ff"],
  plotOptions: {
    radialBar: {
      hollow: { size: "55%" },
      dataLabels: {
        name: { show: false },
        value: { fontSize: "18px", fontWeight: "600", offsetY: 6 },
      },
    },
  },
};

const satisfactionGaugeOpts: ApexCharts.ApexOptions = {
  chart: { type: "radialBar", height: 160, fontFamily: "inherit" },
  colors: ["#2ca87f"],
  plotOptions: {
    radialBar: {
      hollow: { size: "55%" },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: "18px",
          fontWeight: "600",
          offsetY: 6,
          formatter: () => "4.8/5",
        },
      },
    },
  },
};

const uptimeGaugeOpts: ApexCharts.ApexOptions = {
  chart: { type: "radialBar", height: 160, fontFamily: "inherit" },
  colors: ["#e58a00"],
  plotOptions: {
    radialBar: {
      hollow: { size: "55%" },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: "18px",
          fontWeight: "600",
          offsetY: 6,
          formatter: () => "99.9%",
        },
      },
    },
  },
};

const apiSparkOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "line",
    height: 80,
    sparkline: { enabled: true },
    fontFamily: "inherit",
  },
  stroke: { width: 2, curve: "smooth" },
  colors: ["#04a9f5"],
  tooltip: { enabled: false },
};
const apiSparkSeries = [{ data: [310, 240, 280, 220, 260, 190, 247] }];

// Revenue Trends line chart
const revenueTrendsOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "line",
    height: 300,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: ["#4680ff", "#2ed8b6", "#ffb64d"],
  stroke: {
    width: [3, 3, 3],
    dashArray: [0, 5, 0],
    curve: "smooth",
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisBorder: { show: false },
  },
  grid: { borderColor: "var(--border)", strokeDashArray: 4 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const revenueTrendsSeries = [
  {
    name: "Actual",
    data: [18, 22, 28, 32, 38, 42, 48, 52, 55, 60, 65, 72],
  },
  {
    name: "Forecast",
    data: [20, 24, 26, 30, 36, 40, 46, 50, 54, 58, 64, 70],
  },
  {
    name: "Target",
    data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
  },
];

// ---------------------------------------------------------------------------
// Section 3: Transaction data
// ---------------------------------------------------------------------------

const transactions = [
  {
    initials: "JD",
    name: "John Doe",
    email: "john@example.com",
    product: "Admin Dashboard",
    amount: "$890.00",
    status: "Completed" as const,
    date: "Mar 28, 2026",
    bg: "bg-primary",
  },
  {
    initials: "SK",
    name: "Sarah Kim",
    email: "sarah@example.com",
    product: "Landing Page",
    amount: "$450.00",
    status: "Pending" as const,
    date: "Mar 27, 2026",
    bg: "bg-[#2ca87f]",
  },
  {
    initials: "MR",
    name: "Mike Ross",
    email: "mike@example.com",
    product: "E-commerce Theme",
    amount: "$1,290.00",
    status: "Failed" as const,
    date: "Mar 26, 2026",
    bg: "bg-[#e58a00]",
  },
  {
    initials: "LP",
    name: "Lisa Park",
    email: "lisa@example.com",
    product: "Portfolio Template",
    amount: "$320.00",
    status: "Completed" as const,
    date: "Mar 25, 2026",
    bg: "bg-[#04a9f5]",
  },
  {
    initials: "AW",
    name: "Alex Wong",
    email: "alex@example.com",
    product: "Blog Theme",
    amount: "$675.00",
    status: "Processing" as const,
    date: "Mar 24, 2026",
    bg: "bg-[#dc2626]",
  },
];

const statusBadge: Record<string, "success" | "warning" | "destructive"> = {
  Completed: "success",
  Pending: "warning",
  Failed: "destructive",
  Processing: "warning",
};

// Activity Feed data
const activities = [
  {
    color: "bg-primary",
    title: "New user registered",
    desc: "John Doe signed up for the premium plan",
    time: "2 min ago",
  },
  {
    color: "bg-[#2ca87f]",
    title: "Order #4521 completed",
    desc: "Payment of $890.00 processed successfully",
    time: "15 min ago",
  },
  {
    color: "bg-[#e58a00]",
    title: "Server load warning",
    desc: "CPU usage peaked at 89% on node-3",
    time: "1 hour ago",
  },
  {
    color: "bg-[#04a9f5]",
    title: "New feature deployed",
    desc: "Analytics dashboard v2.4 released to production",
    time: "3 hours ago",
  },
  {
    color: "bg-[#dc2626]",
    title: "Payment failed",
    desc: "Subscription renewal failed for user #8842",
    time: "5 hours ago",
  },
];

// Top Regions data
const regions = [
  {
    name: "North America",
    amount: "$247,890",
    change: "+24.5%",
    up: true,
  },
  {
    name: "Europe",
    amount: "$198,456",
    change: "+18.2%",
    up: true,
  },
  {
    name: "Asia Pacific",
    amount: "$156,789",
    change: "+31.7%",
    up: true,
  },
  {
    name: "Latin America",
    amount: "$89,234",
    change: "-5.3%",
    up: false,
  },
];

// ===========================================================================
// KPI baselines
// ===========================================================================

const kpiBaselines = [
  { label: "Total Revenue", value: 847290, total: 1000000, color: "#4680ff" },
  { label: "Active Users",  value: 24689,  total: 50000,   color: "#2ca87f" },
  { label: "Orders",        value: 1847,   total: 3000,    color: "#e58a00" },
  { label: "Conversion Rate", value: 347,  total: 1000,    color: "#04a9f5" },
];

// ===========================================================================
// Page Component
// ===========================================================================

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);

  // Region dialog state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // KPI dialog state
  const [selectedKpi, setSelectedKpi] = useState<string | null>(null);

  // Animated gauge values
  const salesGauge = useCountUp(87);
  const satisfactionGauge = useCountUp(96);
  const uptimeGauge = useCountUp(999); // will display as 99.9
  const apiResponseGauge = useCountUp(247);

  return (
    <>
      <PageBreadcrumb
        title="Analytics"
        items={[{ label: "Dashboard" }, { label: "Analytics" }]}
      />

      {/* ================================================================= */}
      {/* Section 1: 4 KPI Cards                                           */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Total Revenue */}
        <div className="md:col-span-3">
          <div
            className="cursor-pointer rounded-lg bg-primary p-6 transition-opacity hover:opacity-90"
            onClick={() => setSelectedKpi("Total Revenue")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedKpi("Total Revenue")}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h6 className="mb-2 text-sm text-white/80">Total Revenue</h6>
                <h3 className="mb-0 text-2xl font-light text-white">
                  ${kpiData[0].value.toLocaleString()}
                </h3>
                <p className="mb-0 mt-1 text-xs text-white/60">
                  <ArrowUp className="me-1 inline h-3 w-3" />
                  +12.5% from last month
                </p>
              </div>
              <div className="shrink-0">
                <ApexChart
                  type="line"
                  options={revenueSparkOpts}
                  series={revenueSparkSeries}
                  width={80}
                  height={50}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="md:col-span-3">
          <div
            className="cursor-pointer rounded-lg bg-[#2ca87f] p-6 transition-opacity hover:opacity-90"
            onClick={() => setSelectedKpi("Active Users")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedKpi("Active Users")}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h6 className="mb-2 text-sm text-white/80">Active Users</h6>
                <h3 className="mb-0 text-2xl font-light text-white">{kpiData[1].value.toLocaleString()}</h3>
                <p className="mb-0 mt-1 text-xs text-white/60">
                  <ArrowUp className="me-1 inline h-3 w-3" />
                  +8.2% from last week
                </p>
              </div>
              <div className="shrink-0">
                <ApexChart
                  type="area"
                  options={usersSparkOpts}
                  series={usersSparkSeries}
                  width={80}
                  height={50}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="md:col-span-3">
          <div
            className="cursor-pointer rounded-lg bg-[#e58a00] p-6 transition-opacity hover:opacity-90"
            onClick={() => setSelectedKpi("Orders")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedKpi("Orders")}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h6 className="mb-2 text-sm text-white/80">Orders</h6>
                <h3 className="mb-0 text-2xl font-light text-white">{kpiData[2].value.toLocaleString()}</h3>
                <p className="mb-0 mt-1 text-xs text-white/60">
                  <ArrowDown className="me-1 inline h-3 w-3" />
                  -2.1% from yesterday
                </p>
              </div>
              <div className="shrink-0">
                <ApexChart
                  type="bar"
                  options={ordersSparkOpts}
                  series={ordersSparkSeries}
                  width={80}
                  height={50}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="md:col-span-3">
          <div
            className="cursor-pointer rounded-lg bg-[#04a9f5] p-6 transition-opacity hover:opacity-90"
            onClick={() => setSelectedKpi("Conversion Rate")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSelectedKpi("Conversion Rate")}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <h6 className="mb-2 text-sm text-white/80">Conversion Rate</h6>
                <h3 className="mb-0 text-2xl font-light text-white">{(kpiData[3].value / 100).toFixed(2)}%</h3>
                <p className="mb-0 mt-1 text-xs text-white/60">
                  <ArrowUp className="me-1 inline h-3 w-3" />
                  +0.3% from last month
                </p>
              </div>
              <div className="shrink-0">
                <ApexChart
                  type="line"
                  options={conversionSparkOpts}
                  series={conversionSparkSeries}
                  width={80}
                  height={50}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section 2: Real-time Analytics (col-8) + Device Analytics (col-4) */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Real-time Analytics */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Real-time Analytics</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              {/* Stat boxes — matching original with icon circles */}
              <div className="mb-5 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Users className="h-[18px] w-[18px] text-white" />
                  </div>
                  <div>
                    <h6 className="mb-0 text-sm">Sessions</h6>
                    <h4 className="mb-0 text-xl font-light">47,829</h4>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2ca87f]">
                    <TrendingUp className="h-[18px] w-[18px] text-white" />
                  </div>
                  <div>
                    <h6 className="mb-0 text-sm">Page Views</h6>
                    <h4 className="mb-0 text-xl font-light">186,247</h4>
                  </div>
                </div>
              </div>
              <ApexChart
                key={dateRange}
                type="area"
                options={realtimeOpts}
                series={realtimeSeries}
                height={350}
              />
            </CardContent>
          </Card>
        </div>

        {/* Device Analytics */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Device Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={deviceDonutOpts}
                series={deviceDonutSeries}
                height={200}
              />
              <div className="mt-6 space-y-4">
                {/* Desktop */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4 text-primary" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-medium">45.8%</span>
                  </div>
                  <Progress value={45.8} indicatorClassName="bg-primary" />
                </div>
                {/* Mobile */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-[#2ca87f]" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-medium">38.7%</span>
                  </div>
                  <Progress value={38.7} indicatorClassName="bg-[#2ca87f]" />
                </div>
                {/* Tablet */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Tablet className="h-4 w-4 text-[#e58a00]" />
                      <span>Tablet</span>
                    </div>
                    <span className="font-medium">15.5%</span>
                  </div>
                  <Progress value={15.5} indicatorClassName="bg-[#e58a00]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section 2b: Global User Distribution (col-8) + Sentiment (col-4) */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Global User Distribution</CardTitle>
              <span className="text-xs text-muted-foreground">Last 30 Days</span>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-4 gap-4 text-center">
                <div>
                  <h4 className="mb-0 text-lg font-medium text-primary">24.5K</h4>
                  <span className="text-xs text-muted-foreground">USA</span>
                </div>
                <div>
                  <h4 className="mb-0 text-lg font-medium text-[#2ca87f]">18.2K</h4>
                  <span className="text-xs text-muted-foreground">Europe</span>
                </div>
                <div>
                  <h4 className="mb-0 text-lg font-medium text-[#e58a00]">12.8K</h4>
                  <span className="text-xs text-muted-foreground">Asia</span>
                </div>
                <div>
                  <h4 className="mb-0 text-lg font-medium text-[#04a9f5]">8.1K</h4>
                  <span className="text-xs text-muted-foreground">Others</span>
                </div>
              </div>
              <WorldMap />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-4">
          <div className="flex h-full flex-col gap-6">
            {/* Customer Sentiment */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <h6 className="mb-3 text-xs font-semibold uppercase text-destructive">Negative</h6>
                    <h4 className="mt-2 text-2xl font-light text-destructive">24%</h4>
                    <span className="text-xs text-muted-foreground">287 Reviews</span>
                  </div>
                  <div>
                    <h6 className="mb-3 text-xs font-semibold uppercase text-[#2ca87f]">Positive</h6>
                    <h4 className="mt-2 text-2xl font-light text-[#2ca87f]">76%</h4>
                    <span className="text-xs text-muted-foreground">892 Reviews</span>
                  </div>
                </div>
                <button className="mt-4 w-full rounded bg-primary px-3 py-1.5 text-xs text-white hover:opacity-90">
                  View All Reviews
                </button>
              </CardContent>
            </Card>
            {/* Server Performance */}
            <Card>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <h6 className="text-sm font-medium">Server Performance</h6>
                  <Badge variant="success">Optimal</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <ApexChart
                      type="radialBar"
                      options={{
                        chart: { type: "radialBar", height: 80 },
                        colors: ["#dc2626"],
                        plotOptions: { radialBar: { hollow: { size: "50%" }, dataLabels: { show: false } } },
                      }}
                      series={[67]}
                      height={80}
                    />
                    <h6 className="mt-1 text-xs font-medium">CPU Usage</h6>
                    <span className="text-xs text-muted-foreground">67%</span>
                  </div>
                  <div className="text-center">
                    <ApexChart
                      type="radialBar"
                      options={{
                        chart: { type: "radialBar", height: 80 },
                        colors: ["#e58a00"],
                        plotOptions: { radialBar: { hollow: { size: "50%" }, dataLabels: { show: false } } },
                      }}
                      series={[82]}
                      height={80}
                    />
                    <h6 className="mt-1 text-xs font-medium">Memory</h6>
                    <span className="text-xs text-muted-foreground">82%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section 3: Recent Transactions (col-8) + Activity Feed (col-4)    */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Recent Transactions */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Recent Transactions</CardTitle>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
                  <Download className="h-3.5 w-3.5" />
                  Export
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs text-white hover:bg-primary/90">
                  <Plus className="h-3.5 w-3.5" />
                  Add New
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 font-medium">Customer</th>
                      <th className="pb-3 font-medium">Product</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${tx.bg}`}
                            >
                              {tx.initials}
                            </div>
                            <div>
                              <p className="font-medium leading-tight">
                                {tx.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tx.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">{tx.product}</td>
                        <td className="py-3 font-medium">{tx.amount}</td>
                        <td className="py-3">
                          <Badge variant={statusBadge[tx.status]}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-muted-foreground">
                          {tx.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Activity Feed */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Live Activity Feed</CardTitle>
              <span className="flex items-center gap-1.5 text-xs text-[#2ca87f]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2ca87f] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2ca87f]" />
                </span>
                Live
              </span>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-[7px] top-2 h-[calc(100%-24px)] w-px bg-border"
                  aria-hidden="true"
                />
                <div className="space-y-5">
                  {activities.map((act, i) => (
                    <div key={i} className="relative flex gap-4 pl-0">
                      {/* Dot */}
                      <div
                        className={`relative z-10 mt-1 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-white ${act.color}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">
                          {act.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {act.desc}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/60">
                          {act.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-5 w-full rounded-md border py-2 text-xs font-medium text-muted-foreground hover:bg-muted">
                View All Activities
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Section 4: Performance Metrics                                    */}
      {/* ================================================================= */}

      {/* 4 Gauge Cards */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Sales Performance */}
        <div className="md:col-span-3">
          <Card className="text-center">
            <CardContent className="p-6">
              <ApexChart
                type="radialBar"
                options={salesGaugeOpts}
                series={[salesGauge]}
                height={160}
              />
              <h6 className="mt-2 text-sm font-medium">Sales Performance</h6>
              <p className="text-xs text-muted-foreground">{salesGauge}% of target</p>
            </CardContent>
          </Card>
        </div>

        {/* Customer Satisfaction */}
        <div className="md:col-span-3">
          <Card className="text-center">
            <CardContent className="p-6">
              <ApexChart
                type="radialBar"
                options={satisfactionGaugeOpts}
                series={[satisfactionGauge]}
                height={160}
              />
              <h6 className="mt-2 text-sm font-medium">
                Customer Satisfaction
              </h6>
              <p className="text-xs text-muted-foreground">{(satisfactionGauge / 20).toFixed(1)} out of 5</p>
            </CardContent>
          </Card>
        </div>

        {/* System Uptime */}
        <div className="md:col-span-3">
          <Card className="text-center">
            <CardContent className="p-6">
              <ApexChart
                type="radialBar"
                options={uptimeGaugeOpts}
                series={[uptimeGauge / 10]}
                height={160}
              />
              <h6 className="mt-2 text-sm font-medium">System Uptime</h6>
              <p className="text-xs text-muted-foreground">{(uptimeGauge / 10).toFixed(1)}% &mdash; Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* API Response Time */}
        <div className="md:col-span-3">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-4">
                <ApexChart
                  type="line"
                  options={apiSparkOpts}
                  series={apiSparkSeries}
                  width={140}
                  height={80}
                />
              </div>
              <h6 className="mt-2 text-sm font-medium">API Response Time</h6>
              <p className="text-2xl font-light text-[#04a9f5]">~{apiResponseGauge}ms</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revenue Trends (col-8) + Top Regions & Goal Progress (col-4) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Revenue Trends */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="line"
                options={revenueTrendsOpts}
                series={revenueTrendsSeries}
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Regions + Goal Progress */}
        <div className="md:col-span-4">
          <div className="flex flex-col gap-6">
            {/* Top Regions */}
            <Card>
              <CardHeader>
                <CardTitle>Top Regions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regions.map((r, i) => (
                    <div
                      key={i}
                      className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                      onClick={() => setSelectedRegion(r.name)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setSelectedRegion(r.name)}
                    >
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {r.amount}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-0.5 text-xs font-medium ${r.up ? "text-[#2ca87f]" : "text-[#dc2626]"}`}
                      >
                        {r.up ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {r.change}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goal Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>Monthly</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} indicatorClassName="bg-primary" />
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>Quarterly</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} indicatorClassName="bg-[#2ca87f]" />
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>Annual</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} indicatorClassName="bg-[#e58a00]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Region Detail Dialog                                              */}
      {/* ================================================================= */}
      <Dialog
        open={selectedRegion !== null}
        onOpenChange={(open) => !open && setSelectedRegion(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRegion}</DialogTitle>
          </DialogHeader>
          {selectedRegion && regionDetails[selectedRegion] && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Traffic</p>
                  <p className="text-sm font-semibold">
                    {regionDetails[selectedRegion].traffic}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-semibold">
                    {regionDetails[selectedRegion].revenue}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                  <p className="text-sm font-semibold">
                    {regionDetails[selectedRegion].conversion}
                  </p>
                </div>
              </div>
              <div>
                <h6 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Top Pages
                </h6>
                <div className="space-y-2">
                  {regionDetails[selectedRegion].topPages.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{p.page}</span>
                      <span className="text-muted-foreground">{p.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* KPI Drill-down Dialog                                             */}
      {/* ================================================================= */}
      <Dialog
        open={selectedKpi !== null}
        onOpenChange={(open) => !open && setSelectedKpi(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedKpi} Breakdown</DialogTitle>
          </DialogHeader>
          {selectedKpi && kpiBreakdowns[selectedKpi] && (
            <div className="space-y-4">
              <div>
                <h6 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Daily Trend
                </h6>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {kpiBreakdowns[selectedKpi].dailyTrend.map((d, i) => (
                    <div key={i}>
                      <p className="text-[11px] text-muted-foreground">{d.day}</p>
                      <p className="text-xs font-medium">{d.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h6 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                  Top Segments
                </h6>
                <div className="space-y-2">
                  {kpiBreakdowns[selectedKpi].segments.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{s.name}</span>
                      <div className="text-right">
                        <span className="font-medium">{s.value}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {s.pct}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
