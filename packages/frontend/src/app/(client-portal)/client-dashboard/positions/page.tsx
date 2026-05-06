"use client";

import { useState } from "react";
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
import {
  Layers,
  ChevronDown,
  CheckCircle2,
  Clock,
  RefreshCw,
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

type Trade = {
  id: string;
  product: string;
  counterparty: string;
  pair: string;
  direction: "Buy" | "Sell";
  notional: number;
  strike: number;
  spot: number;
  mtm: number;
  legs: number;
  legsRemaining: number;
  nextFixing: string;
  status: "Active" | "Expiring Soon" | "Knocked Out";
};

const SPOT: Record<string, number> = {
  "AUD/USD": 0.6501, "AUD/EUR": 0.5928, "AUD/GBP": 0.5053, "AUD/CNH": 4.734, "AUD/JPY": 98.72,
};

const TRADES: Trade[] = [
  { id: "TRD-0041", product: "Target Accrual Range Forward (TARF)", counterparty: "Convera",    pair: "AUD/USD", direction: "Sell", notional: 500_000, strike: 0.6485, spot: 0.6501, mtm:  142_300, legs: 24, legsRemaining: 18, nextFixing: "14 May 2026", status: "Active" },
  { id: "TRD-0038", product: "Knock-In Collar",                      counterparty: "Alpha FX",  pair: "AUD/EUR", direction: "Sell", notional: 250_000, strike: 0.5912, spot: 0.5928, mtm:   88_750, legs: 12, legsRemaining:  9, nextFixing: "16 May 2026", status: "Active" },
  { id: "TRD-0035", product: "Participating Forward",                 counterparty: "Macquarie", pair: "AUD/GBP", direction: "Sell", notional: 300_000, strike: 0.5041, spot: 0.5053, mtm:  -22_400, legs: 18, legsRemaining: 14, nextFixing: "21 May 2026", status: "Active" },
  { id: "TRD-0031", product: "Enhanced Forward",                      counterparty: "eBury",     pair: "AUD/CNH", direction: "Sell", notional: 100_000, strike: 4.721,  spot: 4.734,  mtm:    9_800, legs:  6, legsRemaining:  2, nextFixing: "30 May 2026", status: "Expiring Soon" },
  { id: "TRD-0029", product: "Vanilla Forward",                       counterparty: "Convera",   pair: "AUD/JPY", direction: "Buy",  notional:  80_000, strike: 98.45,  spot: 98.72,  mtm:    4_120, legs:  4, legsRemaining:  3, nextFixing: "07 Jun 2026", status: "Active" },
];

const TOTAL_MTM      = TRADES.reduce((s, t) => s + t.mtm, 0);
const TOTAL_NOTIONAL = TRADES.reduce((s, t) => s + t.notional, 0);
const TOTAL_LEGS     = TRADES.reduce((s, t) => s + t.legsRemaining, 0);

function pct(a: number, b: number) { return Math.round((a / b) * 100); }
function fmt(n: number) { return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${(n / 1_000).toFixed(0)}K`; }

function statusBadge(s: Trade["status"]) {
  if (s === "Active")        return "bg-success/10 text-success";
  if (s === "Expiring Soon") return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PositionsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageBreadcrumb
        title="My Positions"
        items={[{ label: "Client Portal" }, { label: "My Positions" }]}
      />

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Positions</h1>
          <p className="mt-1 text-sm text-muted-foreground">All active FX trades and fixing schedules</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Hypothetical Trade
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Active Positions", value: `${TRADES.length}`, icon: Activity, color: "bg-primary/10 text-primary" },
          { label: "Total Notional", value: fmt(TOTAL_NOTIONAL), icon: DollarSign, color: "bg-chart-2/10 text-chart-2" },
          { label: "Portfolio MTM", value: `+${fmt(TOTAL_MTM)}`, icon: TrendingUp, color: "bg-success/10 text-success", valueColor: "text-success" },
          { label: "Legs Remaining", value: `${TOTAL_LEGS}`, icon: Layers, color: "bg-chart-3/10 text-chart-3" },
        ].map(({ label, value, icon: Icon, color, valueColor }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  <p className={`truncate text-xl font-bold ${valueColor ?? "text-foreground"}`}>{value}</p>
                </div>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trade cards */}
      <div className="space-y-4">
        {TRADES.map((trade) => {
          const isOpen = expanded === trade.id;
          const legsCompleted = trade.legs - trade.legsRemaining;
          const spotVal = SPOT[trade.pair];
          const diff = spotVal ? (trade.direction === "Sell" ? spotVal - trade.strike : trade.strike - spotVal) : 0;
          const bps = Math.round(Math.abs(diff) * 10000);

          return (
            <Card key={trade.id} className="overflow-hidden">
              {/* Header row — always visible */}
              <button
                className="w-full text-left"
                onClick={() => setExpanded(isOpen ? null : trade.id)}
              >
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    {/* Pair icon */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground text-[10px] font-bold leading-tight text-center">
                      {trade.pair.split("/").join("\n")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{trade.product}</span>
                        <Badge className={`text-xs ${statusBadge(trade.status)}`}>{trade.status}</Badge>
                        <Badge className={`text-xs ${trade.direction === "Sell" ? "bg-chart-1/10 text-chart-1" : "bg-chart-3/10 text-chart-3"}`}>
                          {trade.direction === "Sell" ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                          {trade.direction}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{trade.id} · {trade.counterparty} · Next fixing: {trade.nextFixing}</p>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                        {[
                          { label: "Notional", value: `AUD ${trade.notional.toLocaleString()}` },
                          { label: "Strike Rate", value: trade.strike.toFixed(4) },
                          { label: "Live Spot", value: spotVal?.toFixed(4) ?? "—" },
                          { label: "Difference", value: `${diff >= 0 ? "+" : "-"}${bps} bps` },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
                            <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Leg progress */}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                          <span>{legsCompleted} / {trade.legs} legs completed</span>
                          <span>{trade.legsRemaining} remaining</span>
                        </div>
                        <Progress value={pct(legsCompleted, trade.legs)} className="h-1.5" />
                      </div>
                    </div>

                    {/* MTM + chevron */}
                    <div className="shrink-0 text-right">
                      <p className={`text-xl font-bold ${trade.mtm >= 0 ? "text-success" : "text-destructive"}`}>
                        {trade.mtm >= 0 ? "+" : ""}AUD {trade.mtm.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-muted-foreground">MTM</p>
                      <ChevronDown className={`ml-auto mt-3 h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                </CardContent>
              </button>

              {/* Expanded: leg schedule */}
              {isOpen && (
                <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" /> Full Fixing Schedule — {trade.id}
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <RefreshCw className="mr-1 h-3 w-3" /> Request Roll
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <FileText className="mr-1 h-3 w-3" /> Download
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-border bg-background">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/60">
                          {["Leg", "Fixing Date", "Time", "Notional (AUD)", "Strike", "Live Spot", "Status"].map((h) => (
                            <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
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
                            <tr key={li} className={done ? "opacity-50" : next ? "bg-warning/5" : "hover:bg-muted/20"}>
                              <td className="px-3 py-2.5 font-mono text-xs font-bold text-muted-foreground">{String(li + 1).padStart(2, "0")}</td>
                              <td className="px-3 py-2.5 whitespace-nowrap">{d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</td>
                              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">3:00 PM Tokyo</td>
                              <td className="px-3 py-2.5 font-medium whitespace-nowrap">AUD {Math.round(trade.notional / trade.legs).toLocaleString()}</td>
                              <td className="px-3 py-2.5 font-mono">{trade.strike.toFixed(4)}</td>
                              <td className="px-3 py-2.5 font-mono text-muted-foreground">{SPOT[trade.pair]?.toFixed(4) ?? "—"}</td>
                              <td className="px-3 py-2.5">
                                {done ? (
                                  <span className="flex items-center gap-1 text-xs text-success font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Fixed</span>
                                ) : next ? (
                                  <span className="flex items-center gap-1 text-xs text-warning font-semibold"><Clock className="h-3.5 w-3.5" /> Next</span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Pending</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
