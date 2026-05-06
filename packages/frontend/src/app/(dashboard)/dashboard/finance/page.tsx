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
import {
  ArrowUp,
  ArrowDown,
  CreditCard,
  Plus,
  ShoppingBag,
  Coffee,
  Plane,
  Heart,
} from "lucide-react";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";
import { DataTable, DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Sparkline chart configs for mini stat cards
// ---------------------------------------------------------------------------

const incomeSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "area", width: 100, height: 50, sparkline: { enabled: true } },
  fill: { colors: ["#2ca87f"], opacity: 0.3 },
  stroke: { colors: ["#2ca87f"], width: 2 },
  tooltip: { enabled: false },
};
const incomeSparkSeries = [{ data: [20, 35, 28, 45, 38, 55, 48, 62, 50, 70] }];

const expensesSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "line", width: 100, height: 50, sparkline: { enabled: true } },
  stroke: { colors: ["#f44336"], width: 2, curve: "smooth" },
  tooltip: { enabled: false },
};
const expensesSparkSeries = [{ data: [15, 22, 18, 30, 20, 28, 25, 35, 22, 40] }];

const profitSparkOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", width: 100, height: 50, sparkline: { enabled: true } },
  colors: ["#4680ff"],
  tooltip: { enabled: false },
};
const profitSparkSeries = [{ data: [10, 18, 14, 22, 16, 28, 20, 35, 25, 40] }];

// ---------------------------------------------------------------------------
// Cashflow bar chart
// ---------------------------------------------------------------------------

const cashflowOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 300, toolbar: { show: false }, fontFamily: "inherit" },
  plotOptions: { bar: { columnWidth: "45%", borderRadius: 4 } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  colors: ["#4680ff", "#e9ecef"],
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { theme: "dark" },
};
const cashflowSeries = [
  { name: "Income", data: [44, 55, 41, 67, 22, 43, 56, 62, 48, 55, 70, 58] },
  { name: "Expenses", data: [13, 23, 20, 8, 13, 27, 18, 22, 15, 20, 25, 19] },
];

// ---------------------------------------------------------------------------
// Category donut chart
// ---------------------------------------------------------------------------

const categoryDonutOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 280, fontFamily: "inherit" },
  labels: ["Salary", "Investment", "Freelance", "Business", "Other"],
  colors: ["#4680ff", "#1abc9c", "#e58a00", "#7c4dff", "#3ebfea"],
  legend: { position: "bottom" },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "65%" } } },
  tooltip: { theme: "dark" },
};
const categoryDonutSeries = [35, 25, 20, 15, 5];

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const recentTransactions = [
  {
    name: "Apple Inc.",
    amount: "-$210,000",
    positive: false,
    icon: <ArrowDown className="h-4 w-4 text-red-500" />,
  },
  {
    name: "Spotify",
    amount: "-$10,000",
    positive: false,
    icon: <ArrowDown className="h-4 w-4 text-red-500" />,
  },
  {
    name: "Medium",
    amount: "-$26",
    positive: false,
    icon: <ArrowDown className="h-4 w-4 text-red-500" />,
  },
  {
    name: "Uber",
    amount: "+$210,000",
    positive: true,
    icon: <ArrowUp className="h-4 w-4 text-green-500" />,
  },
  {
    name: "Ola Cabs",
    amount: "+$210,000",
    positive: true,
    icon: <ArrowUp className="h-4 w-4 text-green-500" />,
  },
];

const spendingCategories = [
  {
    label: "Food & Drink",
    percent: 65,
    amount: "$1,000",
    icon: <Coffee className="h-5 w-5" />,
    color: "bg-primary",
  },
  {
    label: "Travel",
    percent: 30,
    amount: "$400",
    icon: <Plane className="h-5 w-5" />,
    color: "bg-[#1abc9c]",
  },
  {
    label: "Shopping",
    percent: 45,
    amount: "$650",
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "bg-[#e58a00]",
  },
  {
    label: "Healthcare",
    percent: 26,
    amount: "$250",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-[#7c4dff]",
  },
];

// ---------------------------------------------------------------------------
// Transaction History mock data (15 rows) — inline per-page data
// ---------------------------------------------------------------------------

type TxType = "Credit" | "Debit";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: TxType;
  balance: number;
}

const transactionHistory: Transaction[] = [
  { id: 1,  date: "Jan 15", description: "Salary Deposit",         amount:  5200.00,  type: "Credit", balance: 12800.00 },
  { id: 2,  date: "Jan 14", description: "Amazon Purchase",        amount:  -450.00,  type: "Debit",  balance:  7600.00 },
  { id: 3,  date: "Jan 13", description: "Netflix Subscription",   amount:   -15.99,  type: "Debit",  balance:  8050.00 },
  { id: 4,  date: "Jan 12", description: "Freelance Payment",      amount:  2500.00,  type: "Credit", balance:  8065.99 },
  { id: 5,  date: "Jan 11", description: "Grocery Store",          amount:   -32.50,  type: "Debit",  balance:  5565.99 },
  { id: 6,  date: "Jan 10", description: "Investment Return",      amount:  1200.00,  type: "Credit", balance:  5598.49 },
  { id: 7,  date: "Jan 09", description: "Electric Bill",          amount:   -85.00,  type: "Debit",  balance:  4398.49 },
  { id: 8,  date: "Jan 08", description: "Consulting Fee",         amount:  3800.00,  type: "Credit", balance:  4483.49 },
  { id: 9,  date: "Jan 07", description: "Uber Ride",              amount:   -18.75,  type: "Debit",  balance:   683.49 },
  { id: 10, date: "Jan 06", description: "Dividends",              amount:   450.00,  type: "Credit", balance:   702.24 },
  { id: 11, date: "Jan 05", description: "Internet Bill",          amount:   -60.00,  type: "Debit",  balance:   252.24 },
  { id: 12, date: "Jan 04", description: "Bank Transfer In",       amount:  1500.00,  type: "Credit", balance:   312.24 },
  { id: 13, date: "Jan 03", description: "Coffee Shop",            amount:    -8.50,  type: "Debit",  balance: -1187.76 },
  { id: 14, date: "Jan 02", description: "Bonus Payment",          amount:  2000.00,  type: "Credit", balance: -1179.26 },
  { id: 15, date: "Jan 01", description: "Rent Payment",           amount: -1200.00,  type: "Debit",  balance: -3179.26 },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const kpiBaselines = [
  { label: "Total Income",   value: 650000, total: 1000000, color: "#2ca87f" },
  { label: "Total Expenses", value: 350000, total: 1000000, color: "#f44336" },
  { label: "Net Profit",     value: 300000, total: 1000000, color: "#4680ff" },
];

const cashflowSeriesByRange: Record<Range, ApexCharts.ApexOptions["series"]> = {
  "7d": [
    { name: "Income",   data: [10, 13, 10, 16, 5, 10, 13] },
    { name: "Expenses", data: [3, 5, 5, 2, 3, 6, 4] },
  ],
  "30d": cashflowSeries,
  "90d": [
    { name: "Income",   data: [132, 165, 123, 201, 66, 129, 168, 186, 144, 165, 210, 174] },
    { name: "Expenses", data: [39, 69, 60, 24, 39, 81, 54, 66, 45, 60, 75, 57] },
  ],
};

export default function FinanceDashboardPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);
  const activeCashflowSeries = cashflowSeriesByRange[dateRange];

  const txColumns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.date}</span>
        ),
        meta: { mobileLabel: "Date" },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.original.description}</span>
        ),
        meta: { mobileLabel: "Description" },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => {
          const amt = row.original.amount;
          const isCredit = amt > 0;
          return (
            <span className={`font-semibold ${isCredit ? "text-green-600" : "text-red-500"}`}>
              {isCredit ? "+" : ""}
              {amt.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            </span>
          );
        },
        meta: { mobileLabel: "Amount" },
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
          const type = row.original.type;
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                type === "Credit"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {type}
            </span>
          );
        },
        filterFn: (row, _id, filterValues: string[]) => {
          if (!filterValues.length) return true;
          return filterValues.includes(row.original.type);
        },
        meta: { mobileLabel: "Type" },
      },
      {
        accessorKey: "balance",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Balance" />
        ),
        cell: ({ row }) => (
          <span className="text-foreground">
            {row.original.balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </span>
        ),
        meta: { mobileLabel: "Balance" },
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Finance"
        items={[{ label: "Dashboard" }, { label: "Finance" }]}
      />

      {/* Row 1: Left sidebar (col-4) + Right main (col-8) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left col-span-4 */}
        <div className="col-span-12 space-y-6 lg:col-span-4">
          {/* My Card */}
          <Card className="bg-[#1d2630] text-white">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-white/60">Credit Card</span>
                <CreditCard className="h-6 w-6 text-white/40" />
              </div>
              <p className="mb-1 text-lg tracking-[0.2em]">**** **** **** 8361</p>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/50">Card Holder</p>
                  <p className="text-sm font-medium">John Smith</p>
                </div>
                <div className="text-end">
                  <p className="text-[10px] text-white/50">Expires</p>
                  <p className="text-sm font-medium">07/30</p>
                </div>
              </div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-xs text-white/50">Total Balance</p>
                <h3 className="text-2xl font-light">$1,480,000</h3>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
              <button
                onClick={() => toast.info("Add transaction coming soon")}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      {tx.icon}
                    </div>
                    <span className="text-sm font-medium">{tx.name}</span>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      tx.positive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {tx.amount}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right col-span-8 */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Mini stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Income */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Income</p>
                    <h3 className="mt-1 text-xl font-bold">${(kpiData[0].value / 1000).toFixed(0)}K</h3>
                  </div>
                  <ApexChart
                    type="area"
                    options={incomeSparkOpts}
                    series={incomeSparkSeries}
                    height={50}
                    width={100}
                  />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                  <ArrowUp className="h-3 w-3" />
                  <span>+8.2% this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Expenses */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Expenses</p>
                    <h3 className="mt-1 text-xl font-bold">${(kpiData[1].value / 1000).toFixed(0)}K</h3>
                  </div>
                  <ApexChart
                    type="line"
                    options={expensesSparkOpts}
                    series={expensesSparkSeries}
                    height={50}
                    width={100}
                  />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-red-500">
                  <ArrowUp className="h-3 w-3" />
                  <span>+3.1% this month</span>
                </div>
              </CardContent>
            </Card>

            {/* Net Profit */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Net Profit</p>
                    <h3 className="mt-1 text-xl font-bold">${(kpiData[2].value / 1000).toFixed(0)}K</h3>
                  </div>
                  <ApexChart
                    type="bar"
                    options={profitSparkOpts}
                    series={profitSparkSeries}
                    height={50}
                    width={100}
                  />
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                  <ArrowUp className="h-3 w-3" />
                  <span>+5.4% this month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cashflow bar chart */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Cashflow</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">+5.44%</Badge>
                <DateRangeToggle value={dateRange} onChange={setDateRange} />
              </div>
            </CardHeader>
            <CardContent>
              <ApexChart
                key={dateRange}
                type="bar"
                options={cashflowOpts}
                series={activeCashflowSeries}
                height={300}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 2: col-8 spending + col-4 donut */}
      <div className="grid grid-cols-12 gap-6">
        {/* Where your money go? */}
        <div className="col-span-12 lg:col-span-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Where your money go?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {spendingCategories.map((cat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${cat.color}`}>
                          {cat.icon}
                        </div>
                        <span className="text-sm font-medium">{cat.label}</span>
                      </div>
                      <div className="text-end">
                        <p className="text-sm font-semibold">{cat.amount}</p>
                        <p className="text-xs text-muted-foreground">{cat.percent}%</p>
                      </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category donut */}
        <div className="col-span-12 lg:col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="donut"
                options={categoryDonutOpts}
                series={categoryDonutSeries}
                height={280}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Transaction History (full width) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={txColumns}
            data={transactionHistory}
            searchPlaceholder="Search transactions..."
            facetedFilters={[
              {
                columnId: "type",
                title: "Type",
                options: [
                  { label: "Credit", value: "Credit" },
                  { label: "Debit", value: "Debit" },
                ],
              },
            ]}
            perPageOptions={[5, 10, 15]}
            exportFilename="transaction-history"
          />
        </CardContent>
      </Card>
    </div>
  );
}
