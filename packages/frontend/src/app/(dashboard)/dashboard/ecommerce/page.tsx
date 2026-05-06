"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { DataTable } from "@dashboardpack/core/components/shared/data-table";
import { ArrowUp, ArrowDown, Star, Package, Truck, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@dashboardpack/core/components/ui/dialog";
import { Button } from "@dashboardpack/core/components/ui/button";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import {
  ecommerceOrders,
  generateMockKpiData,
  type Order,
  type Range,
} from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// KPI baseline data
// ---------------------------------------------------------------------------

const kpiBaselines = [
  { label: "Delivery Orders", value: 237, total: 400, color: "from-[#1abc9c] to-[#16a085]" },
  { label: "Pending", value: 100, total: 500, color: "from-[#3498db] to-[#2980b9]" },
  { label: "Return", value: 50, total: 400, color: "bg-primary" },
];

// ---------------------------------------------------------------------------
// Yearly Summary chart config
// ---------------------------------------------------------------------------

const yearlySummaryOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    height: 270,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  plotOptions: { bar: { columnWidth: "50%", borderRadius: 3 } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
  },
  colors: ["#4680ff", "#1abc9c"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};

const chartSeriesMonthly = [
  { name: "Invoiced", data: [44, 55, 41, 67, 22, 43, 44, 55, 41, 67, 22, 43] },
  { name: "Profit", data: [13, 23, 20, 8, 13, 27, 13, 23, 20, 8, 13, 27] },
];

const chartSeriesQuarterly = [
  { name: "Invoiced", data: [140, 132, 140, 108] },
  { name: "Profit", data: [56, 48, 46, 48] },
];

const quarterlyOpts: ApexCharts.ApexOptions = {
  ...yearlySummaryOpts,
  xaxis: { categories: ["Q1", "Q2", "Q3", "Q4"] },
};

// ---------------------------------------------------------------------------
// Earnings day data
// ---------------------------------------------------------------------------

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const earningsData: Record<DayKey, { value: number; up: boolean }> = {
  Mon: { value: 359_234, up: true },
  Tue: { value: 412_890, up: true },
  Wed: { value: 287_654, up: false },
  Thu: { value: 525_100, up: true },
  Fri: { value: 487_300, up: true },
  Sat: { value: 215_640, up: false },
  Sun: { value: 178_920, up: false },
};

const DAYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---------------------------------------------------------------------------
// Star rating helper
// ---------------------------------------------------------------------------

function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
          }
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: string }) {
  if (status === "Completed")
    return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">{status}</Badge>;
  if (status === "Processing")
    return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10">{status}</Badge>;
  return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/10">{status}</Badge>;
}

// ---------------------------------------------------------------------------
// Orders table column definitions
// ---------------------------------------------------------------------------

const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
    meta: { mobileLabel: "ID" },
  },
  {
    accessorKey: "code",
    header: "Code",
    meta: { mobileLabel: "Code" },
  },
  {
    accessorKey: "date",
    header: "Date",
    meta: { mobileLabel: "Date" },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    meta: { mobileLabel: "Budget" },
  },
  {
    accessorKey: "status",
    header: "Status",
    meta: { mobileLabel: "Status" },
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "stars",
    header: "Rating",
    meta: { mobileLabel: "Rating" },
    cell: ({ row }) => <StarRating count={row.getValue("stars")} />,
  },
];

const statusFacetedFilters = [
  {
    columnId: "status",
    title: "Status",
    options: [
      { label: "Completed", value: "Completed" },
      { label: "Processing", value: "Processing" },
      { label: "Failed", value: "Failed" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function EcommerceDashboardPage() {
  const [dateRange, setDateRange] = useState<Range>("7d");
  const [earningsDay, setEarningsDay] = useState<DayKey>("Mon");
  const [chartView, setChartView] = useState<"monthly" | "quarterly">("monthly");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const kpiData = generateMockKpiData(kpiBaselines, dateRange);
  const activeDay = earningsData[earningsDay];
  const chartSeries = chartView === "monthly" ? chartSeriesMonthly : chartSeriesQuarterly;
  const chartOpts = chartView === "monthly" ? yearlySummaryOpts : quarterlyOpts;

  const handleRowClick = useCallback((order: Order) => {
    setSelectedOrder(order);
  }, []);

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="eCommerce"
        items={[{ label: "Dashboard" }, { label: "eCommerce" }]}
      />

      {/* Row 1 — Order progress cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Row header with DateRangeToggle */}
        <div className="col-span-12 flex items-center justify-between">
          <h6 className="text-sm font-medium text-muted-foreground">Order Progress</h6>
          <DateRangeToggle value={dateRange} onChange={setDateRange} />
        </div>

        {/* Delivery Orders */}
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h6 className="mb-2 text-sm font-medium">{kpiData[0].label}</h6>
              <div className="mb-2 flex items-baseline gap-1">
                <h4 className="text-2xl font-light">{kpiData[0].value.toLocaleString()}</h4>
                <span className="text-sm text-muted-foreground">/ {kpiData[0].total.toLocaleString()}</span>
              </div>
              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1abc9c] to-[#16a085]"
                  style={{ width: `${Math.round((kpiData[0].value / kpiData[0].total) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round((kpiData[0].value / kpiData[0].total) * 100)}% Done
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Pending */}
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h6 className="mb-2 text-sm font-medium">{kpiData[1].label}</h6>
              <div className="mb-2 flex items-baseline gap-1">
                <h4 className="text-2xl font-light">{kpiData[1].value.toLocaleString()}</h4>
                <span className="text-sm text-muted-foreground">/ {kpiData[1].total.toLocaleString()}</span>
              </div>
              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3498db] to-[#2980b9]"
                  style={{ width: `${Math.round((kpiData[1].value / kpiData[1].total) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round((kpiData[1].value / kpiData[1].total) * 100)}% Pending
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Return */}
        <div className="col-span-12 md:col-span-4">
          <Card>
            <CardContent className="p-6">
              <h6 className="mb-2 text-sm font-medium">{kpiData[2].label}</h6>
              <div className="mb-2 flex items-baseline gap-1">
                <h4 className="text-2xl font-light">{kpiData[2].value.toLocaleString()}</h4>
                <span className="text-sm text-muted-foreground">/ {kpiData[2].total.toLocaleString()}</span>
              </div>
              <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${Math.round((kpiData[2].value / kpiData[2].total) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round((kpiData[2].value / kpiData[2].total) * 100)}% Return
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 2 — Yearly Summary + Earnings */}
      <div className="grid grid-cols-12 gap-6">
        {/* Yearly Summary */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-semibold">Yearly Summary</CardTitle>
                  <div className="flex flex-wrap gap-4 pt-1 text-sm">
                    <span className="text-muted-foreground">
                      Invoiced{" "}
                      <strong className="text-foreground">$2,356.4</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Profit{" "}
                      <strong className="text-foreground">$1,935.6</strong>
                    </span>
                    <span className="text-muted-foreground">
                      Expenses{" "}
                      <strong className="text-foreground">$468.9</strong>
                    </span>
                  </div>
                </div>
                {/* Monthly / Quarterly toggle */}
                <div className="flex items-center gap-1 shrink-0">
                  {(["monthly", "quarterly"] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setChartView(view)}
                      className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                        chartView === view
                          ? "bg-primary text-white"
                          : "border border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      {view === "monthly" ? "Monthly" : "Quarterly"}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ApexChart
                key={chartView}
                type="bar"
                options={chartOpts}
                series={chartSeries}
                height={270}
              />
            </CardContent>
          </Card>
        </div>

        {/* Earnings */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full bg-linear-to-br from-[#1abc9c] to-[#16a085] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-white">
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Day tabs */}
              <div className="mb-6 flex flex-wrap gap-2">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    onClick={() => setEarningsDay(day)}
                    className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                      day === earningsDay
                        ? "bg-white/30 text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Active day stats */}
              <div className="flex items-end gap-2">
                <span className="text-3xl font-light">
                  {activeDay.value.toLocaleString()}
                </span>
                {activeDay.up ? (
                  <ArrowUp size={20} className="mb-1 text-white" />
                ) : (
                  <ArrowDown size={20} className="mb-1 text-white" />
                )}
              </div>
              <p className="mt-1 text-sm text-white/80">{earningsDay} earnings</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3 — Sale Product + Order Table */}
      <div className="grid grid-cols-12 gap-6">
        {/* Sale Product */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full bg-linear-to-br from-[#3498db] to-[#2980b9] text-white">
            <CardContent className="flex h-full flex-col items-center justify-center p-8 text-center">
              <span className="text-6xl font-light">375</span>
              <p className="mt-3 text-sm text-white/80">Products Sold This Month</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Table */}
        <div className="col-span-12 lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={orderColumns}
                data={ecommerceOrders}
                searchPlaceholder="Search orders..."
                facetedFilters={statusFacetedFilters}
                perPageOptions={[5, 10, 20]}
                exportFilename="ecommerce-orders"
                onRowClick={handleRowClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Code</span>
                </div>
                <span className="font-mono text-sm font-medium">{selectedOrder.code}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Date</span>
                </div>
                <span className="text-sm font-medium">{selectedOrder.date}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <Badge
                  variant={
                    selectedOrder.status === "Completed"
                      ? "success"
                      : selectedOrder.status === "Processing"
                        ? "warning"
                        : "destructive"
                  }
                >
                  {selectedOrder.status}
                </Badge>
              </div>
              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <span className="text-lg font-bold">{selectedOrder.budget}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < selectedOrder.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-muted text-muted"
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => {
                    toast.info("Tracking details coming soon");
                  }}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
