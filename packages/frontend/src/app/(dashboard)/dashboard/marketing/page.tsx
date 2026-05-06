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
import { Globe, UserPlus, Percent, TrendingUp } from "lucide-react";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";

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

const visitorsSparkOpts = kpiSparkOpts("#4680ff");
const visitorsSparkSeries = [{ data: [4200, 5100, 4800, 6200, 5900, 7100, 6800, 7500, 7200, 7900, 8100, 8423] }];

const leadsSparkOpts = kpiSparkOpts("#2ca87f");
const leadsSparkSeries = [{ data: [68, 82, 75, 91, 88, 105, 98, 112, 108, 118, 121, 124] }];

const convSparkOpts = kpiSparkOpts("#e58a00");
const conversionSparkSeries = [{ data: [2.8, 3.0, 2.9, 3.1, 3.2, 3.4, 3.3, 3.5, 3.6, 3.7, 3.75, 3.8] }];

const roiSparkOpts = kpiSparkOpts("#04a9f5");
const roiSparkSeries = [{ data: [2.8, 3.0, 3.2, 3.1, 3.4, 3.6, 3.5, 3.8, 3.9, 4.0, 4.1, 4.2] }];

// ---------------------------------------------------------------------------
// Row 2: Campaign Performance bar chart
// ---------------------------------------------------------------------------

const campaignPerfOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    height: 350,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
  dataLabels: { enabled: false },
  colors: ["#4680ff", "#1abc9c", "#e58a00"],
  xaxis: {
    categories: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const campaignPerfSeries = [
  { name: "Email", data: [4200, 3800, 5100, 4600, 5500, 6200] },
  { name: "Social", data: [2800, 3200, 2900, 3600, 4100, 3800] },
  { name: "PPC", data: [1800, 2100, 2400, 1900, 2800, 3100] },
];

// ---------------------------------------------------------------------------
// Row 2: Traffic Sources donut chart
// ---------------------------------------------------------------------------

const trafficSourcesOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 300, fontFamily: "inherit" },
  labels: ["Organic", "Social", "Paid", "Direct"],
  colors: ["#4680ff", "#1abc9c", "#e58a00", "#7c4dff"],
  legend: { position: "bottom" },
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: "60%" } } },
  tooltip: { theme: "dark" },
};
const trafficSourcesSeries = [35, 28, 22, 15];

// ---------------------------------------------------------------------------
// Row 3: Social Media radar chart
// ---------------------------------------------------------------------------

const socialMediaOpts: ApexCharts.ApexOptions = {
  chart: { type: "radar", height: 280, toolbar: { show: false }, fontFamily: "inherit" },
  xaxis: { categories: ["Facebook", "Twitter", "Instagram", "LinkedIn", "TikTok"] },
  colors: ["#4680ff", "#1abc9c"],
  fill: { opacity: 0.2 },
  stroke: { width: 2 },
  markers: { size: 4 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const socialMediaSeries = [
  { name: "Engagement", data: [80, 50, 90, 40, 70] },
  { name: "Reach", data: [65, 59, 80, 81, 56] },
];

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const emailMetrics = [
  {
    label: "Sent",
    value: "24,500",
    badge: "Total",
    badgeStyle: "bg-muted text-muted-foreground hover:bg-muted",
    changeColor: "",
  },
  {
    label: "Open Rate",
    value: "28.4%",
    badge: "+2.1%",
    badgeStyle: "bg-green-100 text-green-700 hover:bg-green-100",
    changeColor: "text-[#2ca87f]",
  },
  {
    label: "Click Rate",
    value: "4.2%",
    badge: "+0.8%",
    badgeStyle: "bg-green-100 text-green-700 hover:bg-green-100",
    changeColor: "text-[#2ca87f]",
  },
  {
    label: "Unsubscribe",
    value: "0.3%",
    badge: "-0.1%",
    badgeStyle: "bg-green-100 text-green-700 hover:bg-green-100",
    changeColor: "text-[#2ca87f]",
  },
];

const topLandingPages = [
  { path: "/pricing", views: "8,432", bounce: "32%" },
  { path: "/features", views: "6,218", bounce: "28%" },
  { path: "/blog/seo-guide", views: "4,891", bounce: "45%" },
  { path: "/demo", views: "3,567", bounce: "22%" },
  { path: "/about", views: "2,134", bounce: "51%" },
];

// ---------------------------------------------------------------------------
// Active Campaigns mock data (15 rows) — inline per-page data
// ---------------------------------------------------------------------------

type CampaignStatus = "Active" | "Paused" | "Completed";

interface Campaign {
  id: number;
  name: string;
  platform: string;
  budget: number;
  spent: number;
  conversions: number;
  roi: string;
  status: CampaignStatus;
}

const activeCampaigns: Campaign[] = [
  { id: 1,  name: "Spring Product Launch",         platform: "Email",     budget: 5000,  spent: 3820,  conversions: 312, roi: "5.2x", status: "Active"    },
  { id: 2,  name: "Brand Awareness Q2",            platform: "Social",    budget: 8500,  spent: 6214,  conversions: 189, roi: "3.8x", status: "Active"    },
  { id: 3,  name: "Google Search - Main",          platform: "PPC",       budget: 12000, spent: 9872,  conversions: 428, roi: "4.5x", status: "Active"    },
  { id: 4,  name: "SEO Content Series",            platform: "Content",   budget: 3200,  spent: 2950,  conversions: 156, roi: "6.1x", status: "Active"    },
  { id: 5,  name: "Retargeting - Cart Abandon",    platform: "PPC",       budget: 4000,  spent: 2100,  conversions: 87,  roi: "3.2x", status: "Paused"    },
  { id: 6,  name: "Newsletter Welcome",            platform: "Email",     budget: 1500,  spent: 1500,  conversions: 210, roi: "8.4x", status: "Completed" },
  { id: 7,  name: "LinkedIn Thought Leadership",   platform: "Social",    budget: 6000,  spent: 4130,  conversions: 145, roi: "3.6x", status: "Active"    },
  { id: 8,  name: "Instagram Stories Ads",         platform: "Social",    budget: 3500,  spent: 2800,  conversions: 98,  roi: "2.9x", status: "Active"    },
  { id: 9,  name: "YouTube Pre-roll",              platform: "Video",     budget: 7000,  spent: 5500,  conversions: 234, roi: "4.1x", status: "Active"    },
  { id: 10, name: "Blog SEO Drive",                platform: "Content",   budget: 2000,  spent: 1800,  conversions: 178, roi: "7.2x", status: "Completed" },
  { id: 11, name: "Facebook Lookalike",            platform: "Social",    budget: 5500,  spent: 3200,  conversions: 143, roi: "3.4x", status: "Paused"    },
  { id: 12, name: "Q2 Email Nurture",              platform: "Email",     budget: 2800,  spent: 2100,  conversions: 267, roi: "6.8x", status: "Active"    },
  { id: 13, name: "Display Remarketing",           platform: "PPC",       budget: 3000,  spent: 1500,  conversions: 62,  roi: "2.4x", status: "Paused"    },
  { id: 14, name: "TikTok Brand Challenge",        platform: "Social",    budget: 4500,  spent: 4500,  conversions: 512, roi: "9.1x", status: "Completed" },
  { id: 15, name: "Podcast Sponsorship",           platform: "Audio",     budget: 6000,  spent: 6000,  conversions: 198, roi: "5.5x", status: "Completed" },
];

// ===========================================================================
// Page Component
// ===========================================================================

const kpiBaselines = [
  { label: "Website Visitors",  value: 84230, total: 200000, color: "#4680ff" },
  { label: "Leads Generated",   value: 1245,  total: 5000,   color: "#2ca87f" },
  { label: "Conversion Rate",   value: 38,    total: 100,    color: "#e58a00" },
  { label: "Ad Spend ROI",      value: 42,    total: 100,    color: "#04a9f5" },
];

const campaignSeriesByRange: Record<Range, ApexCharts.ApexOptions["series"]> = {
  "7d": [
    { name: "Email",  data: [980, 890, 1190, 1070, 1280, 1450] },
    { name: "Social", data: [650, 745, 675, 840, 955, 885] },
    { name: "PPC",    data: [420, 490, 560, 445, 650, 720] },
  ],
  "30d": campaignPerfSeries,
  "90d": [
    { name: "Email",  data: [12600, 11400, 15300, 13800, 16500, 18600] },
    { name: "Social", data: [8400, 9600, 8700, 10800, 12300, 11400] },
    { name: "PPC",    data: [5400, 6300, 7200, 5700, 8400, 9300] },
  ],
};

export default function MarketingDashboardPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);
  const activeCampaignSeries = campaignSeriesByRange[dateRange];

  const campaignColumns = useMemo<ColumnDef<Campaign>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Campaign Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.name}</span>
        ),
        meta: { mobileLabel: "Campaign" },
      },
      {
        accessorKey: "platform",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Platform" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.platform}</span>
        ),
        meta: { mobileLabel: "Platform" },
      },
      {
        accessorKey: "budget",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.budget.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
          </span>
        ),
        meta: { mobileLabel: "Budget" },
      },
      {
        accessorKey: "spent",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Spent" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.spent.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
          </span>
        ),
        meta: { mobileLabel: "Spent" },
      },
      {
        accessorKey: "conversions",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Conversions" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">{row.original.conversions}</span>
        ),
        meta: { mobileLabel: "Conversions" },
      },
      {
        accessorKey: "roi",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="ROI" />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-foreground">{row.original.roi}</span>
        ),
        meta: { mobileLabel: "ROI" },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const s = row.original.status;
          const styles: Record<CampaignStatus, string> = {
            Active: "bg-green-100 text-green-700",
            Paused: "bg-gray-100 text-gray-600",
            Completed: "bg-blue-100 text-blue-700",
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
    ],
    []
  );

  return (
    <>
      <PageBreadcrumb
        title="Marketing"
        items={[{ label: "Dashboard" }, { label: "Marketing" }]}
      />

      {/* ================================================================= */}
      {/* Row 1: KPI Cards                                                   */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Website Visitors */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Website Visitors</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{kpiData[0].value.toLocaleString()}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    +18.2%
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart
                type="area"
                options={visitorsSparkOpts}
                series={visitorsSparkSeries}
                height={80}
              />
            </div>
          </Card>
        </div>

        {/* Leads Generated */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Leads Generated</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{kpiData[1].value.toLocaleString()}</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    +23.5%
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2ca87f]/10">
                  <UserPlus className="h-5 w-5 text-[#2ca87f]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart
                type="area"
                options={leadsSparkOpts}
                series={leadsSparkSeries}
                height={80}
              />
            </div>
          </Card>
        </div>

        {/* Conversion Rate */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{(kpiData[2].value / 10).toFixed(1)}%</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    +0.5%
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e58a00]/10">
                  <Percent className="h-5 w-5 text-[#e58a00]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart
                type="area"
                options={convSparkOpts}
                series={conversionSparkSeries}
                height={80}
              />
            </div>
          </Card>
        </div>

        {/* Ad Spend ROI */}
        <div className="md:col-span-3">
          <Card className="h-full overflow-hidden bg-white">
            <CardContent className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Ad Spend ROI</p>
                  <p className="mt-1 text-2xl font-light text-foreground">{(kpiData[3].value / 10).toFixed(1)}x</p>
                  <Badge className="mt-1 bg-green-100 text-green-700 hover:bg-green-100">
                    +0.8x
                  </Badge>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#04a9f5]/10">
                  <TrendingUp className="h-5 w-5 text-[#04a9f5]" />
                </div>
              </div>
            </CardContent>
            <div className="-mb-1 mt-3">
              <ApexChart
                type="area"
                options={roiSparkOpts}
                series={roiSparkSeries}
                height={80}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 2: Campaign Performance | Traffic Sources                      */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Campaign Performance */}
        <div className="md:col-span-8">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Campaign Performance</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              <ApexChart
                key={dateRange}
                type="bar"
                options={campaignPerfOpts}
                series={activeCampaignSeries}
                height={350}
              />
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={trafficSourcesOpts}
                series={trafficSourcesSeries}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 3: Email Metrics | Social Media | Top Landing Pages            */}
      {/* ================================================================= */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Email Metrics */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Email Metrics</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {emailMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <span className="text-sm">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.value}</span>
                    <Badge className={`text-xs ${metric.badgeStyle}`}>
                      {metric.badge}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Social Media */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="radar"
                options={socialMediaOpts}
                series={socialMediaSeries}
                height={280}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Landing Pages */}
        <div className="md:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top Landing Pages</CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              {topLandingPages.map((page) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between border-b border-border py-3 last:border-0"
                >
                  <span className="font-mono text-sm text-foreground">
                    {page.path}
                  </span>
                  <div className="text-end">
                    <p className="text-sm font-medium">{page.views} views</p>
                    <p className="text-xs text-muted-foreground">
                      {page.bounce} bounce
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 4: Active Campaigns Table                                      */}
      {/* ================================================================= */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={campaignColumns}
              data={activeCampaigns}
              searchPlaceholder="Search campaigns..."
              facetedFilters={[
                {
                  columnId: "status",
                  title: "Status",
                  options: [
                    { label: "Active", value: "Active" },
                    { label: "Paused", value: "Paused" },
                    { label: "Completed", value: "Completed" },
                  ],
                },
              ]}
              perPageOptions={[5, 10, 15]}
              exportFilename="campaigns"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
