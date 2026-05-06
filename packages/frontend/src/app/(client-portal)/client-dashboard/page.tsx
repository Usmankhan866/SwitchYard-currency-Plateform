"use client";

import { useState, Fragment } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Progress } from "@dashboardpack/core/components/ui/progress";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  BarChart2,
  Calendar,
  Building2,
  CreditCard,
  ChevronRight,
  ChevronDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Plus,
  ExternalLink,
  Bell,
  Activity,
  FileText,
  Layers,
  CheckCircle2,
  Phone,
  MessageSquare,
  Info,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const SPOT: Record<string, { rate: number; change: number }> = {
  "AUD/USD": { rate: 0.6501, change: +0.0023 },
  "AUD/EUR": { rate: 0.5928, change: -0.0011 },
  "AUD/GBP": { rate: 0.5053, change: +0.0008 },
  "AUD/CNH": { rate: 4.7340, change: +0.0180 },
  "AUD/JPY": { rate: 98.72, change: -0.45 },
};

type Trade = {
  id: string;
  product: string;
  counterparty: string;
  pair: string;
  direction: "Buy" | "Sell";
  notional: number;
  strike: number;
  mtm: number;
  legs: number;
  legsRemaining: number;
  nextFixing: string;
  status: "Active" | "Expiring Soon" | "Knocked Out";
};

const TRADES: Trade[] = [
  { id: "TRD-0041", product: "Target Accrual Range Forward (TARF)", counterparty: "Convera",    pair: "AUD/USD", direction: "Sell", notional: 500_000, strike: 0.6485, mtm:  142_300, legs: 24, legsRemaining: 18, nextFixing: "14 May 2026", status: "Active" },
  { id: "TRD-0038", product: "Knock-In Collar",                      counterparty: "Alpha FX",  pair: "AUD/EUR", direction: "Sell", notional: 250_000, strike: 0.5912, mtm:   88_750, legs: 12, legsRemaining:  9, nextFixing: "16 May 2026", status: "Active" },
  { id: "TRD-0035", product: "Participating Forward",                 counterparty: "Macquarie", pair: "AUD/GBP", direction: "Sell", notional: 300_000, strike: 0.5041, mtm:  -22_400, legs: 18, legsRemaining: 14, nextFixing: "21 May 2026", status: "Active" },
  { id: "TRD-0031", product: "Enhanced Forward",                      counterparty: "eBury",     pair: "AUD/CNH", direction: "Sell", notional: 100_000, strike: 4.7210, mtm:    9_800, legs:  6, legsRemaining:  2, nextFixing: "30 May 2026", status: "Expiring Soon" },
  { id: "TRD-0029", product: "Vanilla Forward",                       counterparty: "Convera",   pair: "AUD/JPY", direction: "Buy",  notional:  80_000, strike: 98.45,  mtm:    4_120, legs:  4, legsRemaining:  3, nextFixing: "07 Jun 2026", status: "Active" },
];

type Fixing = { date: string; tradeId: string; product: string; pair: string; notional: number; rate: number; time: string };

const FIXINGS: Fixing[] = [
  { date: "2026-05-14", tradeId: "TRD-0041", product: "TARF",                  pair: "AUD/USD", notional: 20_833, rate: 0.6485, time: "3:00 PM Tokyo" },
  { date: "2026-05-16", tradeId: "TRD-0038", product: "Knock-In Collar",        pair: "AUD/EUR", notional: 20_833, rate: 0.5912, time: "3:00 PM Tokyo" },
  { date: "2026-05-21", tradeId: "TRD-0035", product: "Participating Forward",  pair: "AUD/GBP", notional: 16_667, rate: 0.5041, time: "3:00 PM Tokyo" },
  { date: "2026-05-28", tradeId: "TRD-0041", product: "TARF",                  pair: "AUD/USD", notional: 20_833, rate: 0.6485, time: "3:00 PM Tokyo" },
  { date: "2026-05-30", tradeId: "TRD-0031", product: "Enhanced Forward",       pair: "AUD/CNH", notional: 16_667, rate: 4.7210, time: "3:00 PM Tokyo" },
  { date: "2026-06-04", tradeId: "TRD-0038", product: "Knock-In Collar",        pair: "AUD/EUR", notional: 20_833, rate: 0.5912, time: "3:00 PM Tokyo" },
  { date: "2026-06-07", tradeId: "TRD-0029", product: "Vanilla Forward",        pair: "AUD/JPY", notional: 20_000, rate: 98.45,  time: "3:00 PM Tokyo" },
  { date: "2026-06-11", tradeId: "TRD-0035", product: "Participating Forward",  pair: "AUD/GBP", notional: 16_667, rate: 0.5041, time: "3:00 PM Tokyo" },
  { date: "2026-06-25", tradeId: "TRD-0041", product: "TARF",                  pair: "AUD/USD", notional: 20_833, rate: 0.6485, time: "3:00 PM Tokyo" },
];

type CParty = { name: string; limit: number; utilised: number };
const COUNTERPARTIES: CParty[] = [
  { name: "Convera",   limit: 2_000_000, utilised:   800_000 },
  { name: "Alpha FX",  limit: 1_500_000, utilised:   600_000 },
  { name: "Macquarie", limit: 3_000_000, utilised: 1_200_000 },
  { name: "eBury",     limit: 1_000_000, utilised:   450_000 },
];

type Payment = { id: string; description: string; pair: string; notional: number; dueDate: string; status: "Upcoming" | "Hedged" | "Unhedged"; beneficiary: string; days: number };
const PAYMENTS: Payment[] = [
  { id: "PAY-011", description: "Supplier invoice — Shanghai textiles", pair: "AUD/CNH", notional:  85_000, dueDate: "15 May 2026", status: "Hedged",   beneficiary: "Yiwu Trading Co.",         days: 8  },
  { id: "PAY-012", description: "Office rent — London",                 pair: "AUD/GBP", notional:  45_000, dueDate: "22 May 2026", status: "Unhedged", beneficiary: "Berkeley Properties Ltd",   days: 15 },
  { id: "PAY-013", description: "Equipment purchase",                   pair: "AUD/USD", notional: 120_000, dueDate: "01 Jun 2026", status: "Unhedged", beneficiary: "TechEquip Inc.",            days: 25 },
  { id: "PAY-014", description: "Consultancy fees — Germany",           pair: "AUD/EUR", notional:  32_000, dueDate: "10 Jun 2026", status: "Hedged",   beneficiary: "München Consulting GmbH",  days: 34 },
  { id: "PAY-015", description: "Quarterly transfer",                   pair: "AUD/USD", notional: 200_000, dueDate: "30 Jun 2026", status: "Upcoming", beneficiary: "US Operations LLC",        days: 54 },
];

// ---------------------------------------------------------------------------
// Derived
// ---------------------------------------------------------------------------

const TOTAL_MTM       = TRADES.reduce((s, t) => s + t.mtm, 0);
const TOTAL_NOTIONAL  = TRADES.reduce((s, t) => s + t.notional, 0);
const TOTAL_LEGS      = TRADES.reduce((s, t) => s + t.legsRemaining, 0);
const HEDGED          = 1_230_000;
const UNHEDGED        = 580_000;
const TOTAL_EXP       = HEDGED + UNHEDGED;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt  = (n: number) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(2)}M` : `$${(n/1_000).toFixed(0)}K`;
const pct  = (a: number, b: number) => Math.round((a / b) * 100);
const daysTo = (d: string) => Math.ceil((new Date(d).getTime() - new Date("2026-05-07").getTime()) / 86400000);

function statusBadge(s: Trade["status"]) {
  if (s === "Active")        return "bg-success/10 text-success";
  if (s === "Expiring Soon") return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}
function payBadge(s: Payment["status"]) {
  if (s === "Hedged")   return "bg-success/10 text-success";
  if (s === "Unhedged") return "bg-destructive/10 text-destructive";
  return "bg-primary/10 text-primary";
}

// ---------------------------------------------------------------------------
// Chart options
// ---------------------------------------------------------------------------

const mtmChartOpts: ApexCharts.ApexOptions = {
  chart: { type: "area", height: 240, toolbar: { show: false }, fontFamily: "inherit", zoom: { enabled: false } },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  colors: ["var(--primary)", "#10b981"],
  fill: { type: "gradient", gradient: { opacityFrom: 0.3, opacityTo: 0.03 } },
  xaxis: {
    categories: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
    labels: { style: { colors: "#888", fontSize: "11px" } },
    axisBorder: { show: false }, axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: "#888", fontSize: "11px" }, formatter: (v: number) => `$${(v/1000).toFixed(0)}K` } },
  grid: { borderColor: "var(--border)", strokeDashArray: 3 },
  legend: { show: true, position: "top", horizontalAlign: "right", fontSize: "12px", labels: { colors: "var(--foreground)" } },
  tooltip: { theme: "dark", y: { formatter: (v: number) => `AUD ${v.toLocaleString()}` } },
};

const mtmSeries = [
  { name: "Portfolio MTM",   data: [210_000, 245_000, 280_000, 195_000, 310_000, 298_000, 222_550] },
  { name: "Hedged Notional", data: [900_000, 950_000, 1_050_000, 1_100_000, 1_150_000, 1_200_000, 1_230_000] },
];

const exposureDonutOpts: ApexCharts.ApexOptions = {
  chart: { type: "donut", height: 260, fontFamily: "inherit" },
  labels: ["AUD/USD", "AUD/EUR", "AUD/GBP", "AUD/CNH", "AUD/JPY"],
  colors: ["var(--primary)", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444"],
  legend: { position: "bottom", fontSize: "12px", labels: { colors: "var(--foreground)" } },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: "68%", labels: { show: true, total: { show: true, label: "Total", color: "var(--muted-foreground)", fontSize: "12px", formatter: () => "AUD 1.23M" } } } } },
  tooltip: { theme: "dark", y: { formatter: (v: number) => `AUD ${v.toLocaleString()}` } },
};

const facilitiesBarOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 200, toolbar: { show: false }, fontFamily: "inherit" },
  plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 4 } },
  colors: ["var(--primary)"],
  xaxis: { categories: COUNTERPARTIES.map((c) => c.name), labels: { style: { colors: "#888", fontSize: "11px" }, formatter: (v: string) => `$${(parseInt(v)/1000).toFixed(0)}K` } },
  yaxis: { labels: { style: { colors: "#888", fontSize: "11px" } } },
  grid: { borderColor: "var(--border)", strokeDashArray: 3 },
  dataLabels: { enabled: false },
  tooltip: { theme: "dark", y: { formatter: (v: number) => `AUD ${v.toLocaleString()}` } },
};

// ---------------------------------------------------------------------------
// KPI summary card (same style as admin stat cards)
// ---------------------------------------------------------------------------

function KpiCard({
  title, value, sub, trend, trendLabel, icon: Icon, iconBg, valueColor = "text-foreground",
}: {
  title: string; value: string; sub: string;
  trend?: "up" | "down"; trendLabel?: string;
  icon: React.ElementType; iconBg: string; valueColor?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-2">{title}</p>
            <p className={`truncate text-xl font-bold leading-none ${valueColor}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>
          </div>
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trendLabel && (
          <div className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${trend === "up" ? "text-success" : "text-destructive"}`}>
            {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {trendLabel}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Spot rate strip
// ---------------------------------------------------------------------------

function SpotStrip() {
  return (
    <Card>
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            <span className="text-xs font-semibold text-muted-foreground">Live Spot</span>
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-5 overflow-x-auto scrollbar-none">
            {Object.entries(SPOT).map(([pair, { rate, change }]) => (
              <div key={pair} className="flex shrink-0 items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">{pair}</span>
                <span className="font-mono text-xs text-foreground">{rate.toFixed(4)}</span>
                <span className={`text-[11px] font-semibold ${change >= 0 ? "text-success" : "text-destructive"}`}>
                  {change >= 0 ? "▲" : "▼"}{Math.abs(change).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
          <div className="shrink-0">
            <Badge className="bg-success/10 text-success hover:bg-success/10 text-xs gap-1.5 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Live
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Positions table (expandable rows)
// ---------------------------------------------------------------------------

function PositionsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 pb-4">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">Active Positions</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Click any row to view fixing schedule</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 whitespace-nowrap">{TRADES.length} trades · {TOTAL_LEGS} legs</Badge>
          <Button size="sm" variant="outline">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Hypothetical
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["Trade ID", "Product", "Pair", "Provider", "Notional", "Strike", "Live Spot", "MTM (AUD)", "Legs Left", "Next Fixing", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TRADES.map((trade) => {
                const spotData = SPOT[trade.pair];
                const isOpen = expanded === trade.id;
                const legsCompleted = trade.legs - trade.legsRemaining;

                return (
                  <Fragment key={trade.id}>
                    <tr
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setExpanded(isOpen ? null : trade.id)}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-primary">{trade.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground max-w-[160px] truncate leading-tight">{trade.product}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{trade.direction}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-foreground">{trade.pair}</td>
                      <td className="px-4 py-3 text-muted-foreground">{trade.counterparty}</td>
                      <td className="px-4 py-3 font-medium">AUD {trade.notional.toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono">{trade.strike.toFixed(4)}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{spotData?.rate.toFixed(4) ?? "—"}</td>
                      <td className={`px-4 py-3 font-bold ${trade.mtm >= 0 ? "text-success" : "text-destructive"}`}>
                        {trade.mtm >= 0 ? "+" : ""}AUD {trade.mtm.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">{trade.legsRemaining}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground whitespace-nowrap">{trade.nextFixing}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${statusBadge(trade.status)}`}>{trade.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                      </td>
                    </tr>

                    {/* Expanded leg schedule */}
                    {isOpen && (
                      <tr>
                        <td colSpan={12} className="px-4 py-4 bg-muted/20">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                                <Layers className="h-3.5 w-3.5" /> Fixing Schedule — {trade.id}
                              </p>
                              <div className="flex shrink-0 gap-1.5">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  <RefreshCw className="mr-1 h-3 w-3" /> Request Roll
                                </Button>
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                  <FileText className="mr-1 h-3 w-3" /> Download
                                </Button>
                              </div>
                            </div>

                            {/* Leg progress bar */}
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-muted-foreground">{legsCompleted} of {trade.legs} legs completed</span>
                                <span className="font-medium">{trade.legsRemaining} remaining</span>
                              </div>
                              <Progress value={pct(legsCompleted, trade.legs)} className="h-1.5" />
                            </div>

                            <div className="overflow-x-auto rounded-lg border border-border bg-background">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b border-border bg-muted/60">
                                    {["Leg #", "Fixing Date", "Fixing Time", "Notional (AUD)", "Strike Rate", "Spot @ Pricing", "Status"].map((h) => (
                                      <th key={h} className="px-3 py-2.5 text-left font-semibold text-muted-foreground">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  {Array.from({ length: trade.legs }).map((_, li) => {
                                    const d = new Date("2026-05-14");
                                    d.setDate(d.getDate() + li * 28);
                                    const done = li < legsCompleted;
                                    const next = li === legsCompleted;
                                    return (
                                      <tr key={li} className={done ? "opacity-50" : next ? "bg-warning/5" : ""}>
                                        <td className="px-3 py-2 font-mono font-bold text-muted-foreground">{String(li + 1).padStart(2, "0")}</td>
                                        <td className="px-3 py-2">{d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</td>
                                        <td className="px-3 py-2 text-muted-foreground">3:00 PM Tokyo</td>
                                        <td className="px-3 py-2 font-medium">AUD {Math.round(trade.notional / trade.legs).toLocaleString()}</td>
                                        <td className="px-3 py-2 font-mono">{trade.strike.toFixed(4)}</td>
                                        <td className="px-3 py-2 font-mono text-muted-foreground">{SPOT[trade.pair]?.rate.toFixed(4) ?? "—"}</td>
                                        <td className="px-3 py-2">
                                          {done ? (
                                            <span className="flex items-center gap-1 text-success font-semibold">
                                              <CheckCircle2 className="h-3.5 w-3.5" /> Fixed
                                            </span>
                                          ) : next ? (
                                            <span className="flex items-center gap-1 text-warning font-semibold">
                                              <Clock className="h-3.5 w-3.5" /> Next
                                            </span>
                                          ) : (
                                            <span className="text-muted-foreground">Pending</span>
                                          )}
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Counterparty facilities
// ---------------------------------------------------------------------------

function FacilitiesSection() {
  const totalLimit = COUNTERPARTIES.reduce((s, c) => s + c.limit, 0);
  const totalUsed  = COUNTERPARTIES.reduce((s, c) => s + c.utilised, 0);

  const facilitiesSeries = [{ data: COUNTERPARTIES.map((c) => c.utilised) }];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="text-base font-semibold">Counterparty Facilities</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Credit utilisation across providers</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Total Available</p>
            <p className="text-lg font-bold text-success">{fmt(totalLimit - totalUsed)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ApexChart type="bar" options={facilitiesBarOpts} series={facilitiesSeries} height={180} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTERPARTIES.map((cp) => {
            const utilPct = pct(cp.utilised, cp.limit);
            return (
              <div key={cp.name} className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-semibold text-foreground mb-2">{cp.name}</p>
                <Progress value={utilPct} className="h-1.5 mb-2" />
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{utilPct}% used</span>
                  <span className="font-medium text-success">{fmt(cp.limit - cp.utilised)} free</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

function PaymentsSection() {
  const unhedged = PAYMENTS.filter((p) => p.status === "Unhedged");

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-3 pb-4">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">Payment Obligations</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Your upcoming FX payments</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {unhedged.length > 0 && (
            <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 gap-1 whitespace-nowrap">
              <AlertTriangle className="h-3 w-3" /> {unhedged.length} unhedged
            </Badge>
          )}
          <Button size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Payment
          </Button>
        </div>
      </CardHeader>

      {unhedged.length > 0 && (
        <div className="mx-6 mb-4 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">{unhedged.length} payments are exposed to FX risk</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {unhedged.map((p) => `${p.pair} AUD ${p.notional.toLocaleString()} (${p.dueDate})`).join(" · ")}
            </p>
          </div>
          <Button size="sm" variant="destructive" className="shrink-0 text-xs h-7">Hedge Now</Button>
        </div>
      )}

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {["ID", "Description", "Beneficiary", "Pair", "Amount", "Due Date", "Days", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PAYMENTS.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground max-w-[180px] truncate">{p.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[140px] truncate">{p.beneficiary}</td>
                  <td className="px-4 py-3 font-bold text-foreground">{p.pair}</td>
                  <td className="px-4 py-3 font-semibold">AUD {p.notional.toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${p.days <= 7 ? "text-destructive" : p.days <= 14 ? "text-warning" : "text-muted-foreground"}`}>
                      {p.days}d
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={`text-xs ${payBadge(p.status)}`}>{p.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {p.status === "Unhedged" && (
                      <Button size="sm" className="h-7 text-xs">Hedge</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Upcoming fixings
// ---------------------------------------------------------------------------

function FixingsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-2 pb-4">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">Upcoming Fixings</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">Scheduled leg expiry dates — closest first</p>
        </div>
        <Badge className="shrink-0 bg-warning/10 text-warning hover:bg-warning/10 whitespace-nowrap">
          <Bell className="mr-1 h-3 w-3" /> {FIXINGS.length} scheduled
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FIXINGS.map((f, i) => {
            const days = daysTo(f.date);
            const urgent = days <= 7;
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const [y, m, d] = f.date.split("-");
            return (
              <div key={i} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${urgent ? "border-warning/40 bg-warning/5" : "border-border bg-muted/20"}`}>
                <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg ${urgent ? "bg-warning text-warning-foreground" : "bg-primary/10 text-primary"}`}>
                  <span className="text-[11px] font-bold leading-none">{d}</span>
                  <span className="text-[9px] leading-none mt-0.5 opacity-80">{months[parseInt(m)-1]?.toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{f.pair}</p>
                  <p className="text-xs text-muted-foreground truncate">{f.product} · {f.time}</p>
                  <p className="text-xs font-medium text-foreground">AUD {f.notional.toLocaleString()} @ {f.rate}</p>
                </div>
                <div className={`text-sm font-bold shrink-0 ${urgent ? "text-warning" : "text-muted-foreground"}`}>{days}d</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClientDashboardPage() {
  const totalMtmPositive = TOTAL_MTM >= 0;

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageBreadcrumb
        title="Portfolio Overview"
        items={[{ label: "Client Portal" }, { label: "Portfolio Overview" }]}
      />

      {/* Page heading */}
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-foreground">Horizon Exports Pty Ltd</h1>
          <p className="mt-1 text-sm text-muted-foreground">FX Portfolio Dashboard · As of 07 May 2026</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
          </Button>
          <Button size="sm">
            <Bell className="mr-1.5 h-3.5 w-3.5" /> 3 Alerts
          </Button>
        </div>
      </div>

      {/* Live spot strip */}
      <SpotStrip />

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          title="Portfolio MTM Value"
          value={`${totalMtmPositive ? "+" : ""}AUD ${TOTAL_MTM.toLocaleString()}`}
          sub="Mark-to-market vs live spot"
          trend="up"
          trendLabel="+8.2% from last month"
          icon={TrendingUp}
          iconBg="bg-success/10"
          valueColor={totalMtmPositive ? "text-success" : "text-destructive"}
        />
        <KpiCard
          title="Hedged Exposure"
          value={fmt(HEDGED)}
          sub={`${pct(HEDGED, TOTAL_EXP)}% of total covered`}
          trend="up"
          trendLabel="+AUD 30K this month"
          icon={Shield}
          iconBg="bg-primary/10"
        />
        <KpiCard
          title="Unhedged Exposure"
          value={fmt(UNHEDGED)}
          sub={`${pct(UNHEDGED, TOTAL_EXP)}% needs coverage`}
          trend="down"
          trendLabel="2 payments at risk"
          icon={AlertTriangle}
          iconBg="bg-warning/10"
          valueColor="text-warning"
        />
        <KpiCard
          title="Active Positions"
          value={`${TRADES.length} trades`}
          sub={`${TOTAL_LEGS} legs remaining`}
          icon={Activity}
          iconBg="bg-chart-3/10"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-wrap items-start justify-between gap-2 pb-2">
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold">Portfolio Performance</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">MTM vs hedged notional — Nov 2025 to May 2026</p>
            </div>
            <Badge className="shrink-0 bg-primary/10 text-primary hover:bg-primary/10">7 Months</Badge>
          </CardHeader>
          <CardContent>
            <ApexChart type="area" options={mtmChartOpts} series={mtmSeries} height={240} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Exposure by Pair</CardTitle>
            <p className="text-xs text-muted-foreground">Notional distribution</p>
          </CardHeader>
          <CardContent>
            <ApexChart type="donut" options={exposureDonutOpts} series={[500_000, 250_000, 300_000, 100_000, 80_000]} height={260} />
          </CardContent>
        </Card>
      </div>

      {/* 3-col hedge summary */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Payments coming up */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-sm font-semibold">Upcoming Payments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">AUD 482K</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">5 obligations in next 60 days</p>
            <div className="space-y-2.5">
              {PAYMENTS.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${p.status === "Hedged" ? "bg-success" : p.status === "Unhedged" ? "bg-destructive" : "bg-primary"}`} />
                    <p className="text-xs text-muted-foreground truncate">{p.description.split("—")[0].trim()}</p>
                  </div>
                  <p className="text-xs font-semibold text-foreground shrink-0">{p.dueDate.split(" 2026")[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hedge coverage */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-success/10">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <CardTitle className="text-sm font-semibold">Hedge Coverage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">{fmt(HEDGED)}</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">{pct(HEDGED, TOTAL_EXP)}% of total exposure protected</p>
            <Progress value={pct(HEDGED, TOTAL_EXP)} className="h-2 mb-3" />
            <div className="space-y-2">
              {TRADES.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.pair}</span>
                  <span className="font-semibold text-foreground">AUD {t.notional.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Unhedged */}
        <Card className="border-warning/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <CardTitle className="text-sm font-semibold">Unhedged Risk</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-warning">{fmt(UNHEDGED)}</p>
            <p className="text-xs text-muted-foreground mt-1 mb-3">{pct(UNHEDGED, TOTAL_EXP)}% at spot rate risk</p>
            <Progress value={pct(UNHEDGED, TOTAL_EXP)} className="h-2 mb-3 [&>div]:bg-warning" />
            {PAYMENTS.filter((p) => p.status === "Unhedged").map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg bg-warning/5 border border-warning/20 px-3 py-2 mb-2">
                <p className="text-xs text-muted-foreground truncate">{p.description.split("—")[0].trim()}</p>
                <span className="text-xs font-bold text-warning shrink-0">AUD {p.notional.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Aggregate book rate table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold">Aggregate Book Rate by Currency Pair</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Hedged rate vs current live spot</p>
            </div>
            <Badge className="shrink-0 bg-success/10 text-success hover:bg-success/10 whitespace-nowrap">
              +AUD {TOTAL_MTM.toLocaleString()} MTM
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {["Currency Pair", "Book Rate (Strike)", "Live Spot", "Difference (bps)", "MTM (AUD)", "Direction", "Counterparty"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TRADES.map((t) => {
                  const s = SPOT[t.pair];
                  const diff = s ? (t.direction === "Sell" ? s.rate - t.strike : t.strike - s.rate) : 0;
                  const bps = Math.round(Math.abs(diff) * 10000);
                  return (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-[10px] font-bold text-primary">
                            {t.pair.split("/")[1]}
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{t.pair}</p>
                            <p className="text-xs text-muted-foreground">{t.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">{t.strike.toFixed(4)}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{s?.rate.toFixed(4) ?? "—"}</td>
                      <td className={`px-4 py-3 font-mono font-semibold ${diff >= 0 ? "text-success" : "text-destructive"}`}>
                        {diff >= 0 ? "+" : "-"}{bps} bps
                      </td>
                      <td className={`px-4 py-3 font-bold ${t.mtm >= 0 ? "text-success" : "text-destructive"}`}>
                        {t.mtm >= 0 ? "+" : ""}AUD {t.mtm.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${t.direction === "Sell" ? "bg-chart-1/10 text-chart-1" : "bg-chart-3/10 text-chart-3"}`}>
                          {t.direction === "Sell" ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                          {t.direction}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.counterparty}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/30">
                  <td colSpan={4} className="px-4 py-3 font-bold text-foreground">Portfolio Total</td>
                  <td className="px-4 py-3 font-bold text-success">+AUD {TOTAL_MTM.toLocaleString()}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Positions */}
      <PositionsSection />

      {/* Two col: Fixings + Counterparties */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <FixingsSection />
        </div>
        <div className="xl:col-span-2">
          <FacilitiesSection />
        </div>
      </div>

      {/* Payments */}
      <PaymentsSection />

      {/* Advisor contact card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                HM
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Hannah Mitchell</p>
                <p className="text-xs text-muted-foreground">Your SwitchYard Capital Account Manager</p>
                <p className="text-xs font-medium text-primary mt-0.5">+61 2 9000 1234</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs text-muted-foreground max-w-xs">
                Have questions about your trades or want to discuss new opportunities?
              </p>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline">
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" /> Message
                </Button>
                <Button size="sm">
                  <Phone className="mr-1.5 h-3.5 w-3.5" /> Request Call
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
