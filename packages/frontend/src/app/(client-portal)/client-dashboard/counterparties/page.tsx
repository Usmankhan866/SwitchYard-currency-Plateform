"use client";

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
import { ExternalLink, RefreshCw, Building2, Info } from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type CParty = { name: string; limit: number; utilised: number; color: string; trades: number };

const COUNTERPARTIES: CParty[] = [
  { name: "Convera",   limit: 2_000_000, utilised:   800_000, color: "#3b82f6", trades: 2 },
  { name: "Alpha FX",  limit: 1_500_000, utilised:   600_000, color: "#8b5cf6", trades: 1 },
  { name: "Macquarie", limit: 3_000_000, utilised: 1_200_000, color: "#f59e0b", trades: 1 },
  { name: "eBury",     limit: 1_000_000, utilised:   450_000, color: "#10b981", trades: 1 },
  { name: "XC Trade",  limit:   500_000, utilised:    95_000, color: "#ef4444", trades: 0 },
];

const totalLimit  = COUNTERPARTIES.reduce((s, c) => s + c.limit, 0);
const totalUsed   = COUNTERPARTIES.reduce((s, c) => s + c.utilised, 0);
const totalAvail  = totalLimit - totalUsed;

function fmt(n: number) { return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`; }
function pct(a: number, b: number) { return Math.round((a / b) * 100); }

const barOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 260, toolbar: { show: false }, fontFamily: "inherit" },
  plotOptions: { bar: { horizontal: true, barHeight: "55%", borderRadius: 4, distributed: true } },
  colors: COUNTERPARTIES.map((c) => c.color),
  xaxis: {
    categories: COUNTERPARTIES.map((c) => c.name),
    labels: { style: { colors: "#888", fontSize: "11px" }, formatter: (v: string) => `$${(parseFloat(v) / 1000).toFixed(0)}K` },
  },
  yaxis: { labels: { style: { colors: "#888", fontSize: "11px" } } },
  grid: { borderColor: "var(--border)", strokeDashArray: 3 },
  legend: { show: false },
  dataLabels: { enabled: true, formatter: (v: number) => `${pct(v, totalLimit)}%`, style: { fontSize: "11px", colors: ["#fff"] } },
  tooltip: { theme: "dark", y: { formatter: (v: number) => `AUD ${v.toLocaleString()}` } },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CounterpartiesPage() {
  return (
    <div className="w-full min-w-0 space-y-6">
      <PageBreadcrumb
        title="Counterparties"
        items={[{ label: "Client Portal" }, { label: "Counterparties" }]}
      />

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Counterparty Facilities</h1>
          <p className="mt-1 text-sm text-muted-foreground">Credit limits and utilisation across all FX providers</p>
        </div>
        <Button size="sm" variant="outline">
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh Limits
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Total Credit Facilities", value: fmt(totalLimit), sub: `${COUNTERPARTIES.length} providers`, color: "text-foreground" },
          { label: "Total Utilised",          value: fmt(totalUsed),  sub: `${pct(totalUsed, totalLimit)}% of facilities`, color: "text-primary" },
          { label: "Total Available",         value: fmt(totalAvail), sub: `${100 - pct(totalUsed, totalLimit)}% headroom`, color: "text-success" },
        ].map(({ label, value, sub, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Utilisation by Provider</CardTitle>
            <p className="text-xs text-muted-foreground">Amount drawn vs total facility</p>
          </CardHeader>
          <CardContent>
            <ApexChart
              type="bar"
              options={barOpts}
              series={[{ data: COUNTERPARTIES.map((c) => c.utilised) }]}
              height={260}
            />
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
              <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Percentages show each provider's utilisation as a share of your total facilities ({fmt(totalLimit)}).
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-7">
          {COUNTERPARTIES.map((cp) => {
            const utilPct = pct(cp.utilised, cp.limit);
            const available = cp.limit - cp.utilised;
            const isHigh = utilPct >= 80;
            const isMed  = utilPct >= 60 && !isHigh;

            return (
              <Card key={cp.name} className="overflow-hidden">
                <div className="h-1 w-full" style={{ backgroundColor: cp.color }} />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white text-xs font-bold"
                        style={{ backgroundColor: cp.color }}
                      >
                        {cp.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{cp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cp.trades} active trade{cp.trades !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`text-xs ${isHigh ? "bg-destructive/10 text-destructive" : isMed ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}
                    >
                      {utilPct}% used
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1.5 text-muted-foreground">
                      <span>Utilisation</span>
                      <span className="font-medium text-foreground">{fmt(cp.utilised)} / {fmt(cp.limit)}</span>
                    </div>
                    <Progress value={utilPct} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Limit",     value: fmt(cp.limit),     color: "text-foreground" },
                      { label: "Utilised",  value: fmt(cp.utilised),  color: "text-foreground" },
                      { label: "Available", value: fmt(available),    color: "text-success" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="rounded-lg bg-muted/40 p-2.5 text-center">
                        <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
                        <p className={`text-sm font-bold ${color}`}>{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                      <ExternalLink className="mr-1 h-3 w-3" /> View Trades
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 px-2.5">
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Explainer */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 flex items-start gap-3">
          <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">About Credit Facilities</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Each FX provider has assigned a credit facility — the maximum notional exposure you can hold at any
              one time. As trades expire or settle, utilisation decreases automatically. If you are approaching a
              limit, contact your account manager Hannah Mitchell to discuss facility increases or rebalancing across providers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
