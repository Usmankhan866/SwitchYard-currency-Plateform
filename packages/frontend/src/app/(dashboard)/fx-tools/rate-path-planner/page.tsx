"use client";

import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Map,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ─── Convera Active Portfolio ─────────────────────────────────────────────────

interface TradeDef {
  id: number;
  product: string;
  direction: "Buy" | "Sell";
  notional: number;
  contract_rate: number;
  pivot_rate?: number;
  second_strike?: number;
  lower_ki?: number;
  upper_ki?: number;
  provider: string;
  targetAccrual: number;
}

const CONVERA_TRADES: TradeDef[] = [
  {
    id: 1, product: "Pivot TARF", direction: "Sell",
    notional: 300_000, contract_rate: 0.683,
    pivot_rate: 0.705, second_strike: 0.754,
    provider: "SwitchYard",
    targetAccrual: 4 * 300_000,
  },
  {
    id: 2, product: "EKI Pivot TARF", direction: "Sell",
    notional: 200_000, contract_rate: 0.6375,
    pivot_rate: 0.67, lower_ki: 0.615, upper_ki: 0.71,
    provider: "SwitchYard",
    targetAccrual: 4 * 200_000,
  },
  {
    id: 3, product: "Count TARF", direction: "Buy",
    notional: 200_000, contract_rate: 0.67,
    provider: "NAB",
    targetAccrual: 3 * 200_000,
  },
  {
    id: 4, product: "Pivot TARF", direction: "Sell",
    notional: 200_000, contract_rate: 0.619,
    pivot_rate: 0.6505, second_strike: 0.675,
    provider: "Westpac",
    targetAccrual: 4 * 200_000,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Zone = "ITM" | "OTM" | "Pivot" | "KO" | "Terminated";

interface TradeResult {
  tradeId: number;
  product: string;
  provider: string;
  zone: Zone;
  accrualUSD: number;
  mtmAUD: number;
  note: string;
}

interface MonthResult {
  month: number;
  label: string;
  spotRate: number;
  trades: TradeResult[];
  monthlyAccrualUSD: number;
  monthlyMTMAUD: number;
  cumulativeMTMAUD: number;
  cumulativeAccrualUSD: number;
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const PRESETS: Record<string, number[]> = {
  "AUD Strengthens": [0.640, 0.648, 0.656, 0.664, 0.672, 0.680, 0.688, 0.696, 0.704, 0.712, 0.720, 0.728],
  "AUD Weakens":     [0.720, 0.713, 0.706, 0.699, 0.692, 0.685, 0.678, 0.671, 0.664, 0.657, 0.650, 0.643],
  "Volatile":        [0.640, 0.715, 0.625, 0.705, 0.635, 0.720, 0.628, 0.700, 0.638, 0.710, 0.632, 0.708],
  "Flat 0.65":       Array(12).fill(0.650),
  "Flat 0.70":       Array(12).fill(0.700),
};

// ─── Simulation Engine ────────────────────────────────────────────────────────

function runSimulation(spotRates: number[]): MonthResult[] {
  const state = CONVERA_TRADES.map((t) => ({
    ...t,
    isActive: true,
    isKnockedOut: false,
    cumulativeAccrual: 0,
  }));

  let cumulativeMTM = 0;
  let cumulativeAccrual = 0;
  const results: MonthResult[] = [];

  for (let i = 0; i < spotRates.length; i++) {
    const spot = spotRates[i];
    const tradeResults: TradeResult[] = [];

    for (const ts of state) {
      // Already inactive
      if (!ts.isActive) {
        tradeResults.push({
          tradeId: ts.id,
          product: ts.product,
          provider: ts.provider,
          zone: "Terminated",
          accrualUSD: 0,
          mtmAUD: 0,
          note: ts.isKnockedOut ? "Knocked out" : "Target reached",
        });
        continue;
      }

      // Knock-out barrier check (EKI / Barrier products)
      if (ts.lower_ki !== undefined && spot <= ts.lower_ki) {
        ts.isActive = false;
        ts.isKnockedOut = true;
        tradeResults.push({
          tradeId: ts.id, product: ts.product, provider: ts.provider,
          zone: "KO", accrualUSD: 0, mtmAUD: 0,
          note: `Lower barrier ${ts.lower_ki.toFixed(4)} hit`,
        });
        continue;
      }
      if (ts.upper_ki !== undefined && spot >= ts.upper_ki) {
        ts.isActive = false;
        ts.isKnockedOut = true;
        tradeResults.push({
          tradeId: ts.id, product: ts.product, provider: ts.provider,
          zone: "KO", accrualUSD: 0, mtmAUD: 0,
          note: `Upper barrier ${ts.upper_ki.toFixed(4)} hit`,
        });
        continue;
      }

      // Determine zone and effective execution rate
      let zone: "ITM" | "OTM" | "Pivot" = "ITM";
      let effectiveRate = ts.contract_rate;
      let note = "";

      if (ts.direction === "Sell") {
        if (spot < ts.contract_rate) {
          zone = "OTM";
          note = `Below contract ${ts.contract_rate.toFixed(4)}`;
        } else if (ts.pivot_rate !== undefined && spot >= ts.pivot_rate) {
          zone = "Pivot";
          effectiveRate = ts.second_strike ?? ts.pivot_rate;
          note = `Pivot zone → executes at ${effectiveRate.toFixed(4)}`;
        } else {
          note = `Executes at ${ts.contract_rate.toFixed(4)}`;
        }
      } else {
        // Buy direction: ITM when spot < contract_rate (AUD weakened, USD cheaper)
        if (spot > ts.contract_rate) {
          zone = "OTM";
          note = `Above contract ${ts.contract_rate.toFixed(4)}`;
        } else {
          note = `Buys at ${ts.contract_rate.toFixed(4)}`;
        }
      }

      // MTM (Sell: positive = ITM; Buy: positive = spot < contract, pays less AUD than market)
      const audContract = ts.notional / effectiveRate;
      const audMarket = ts.notional / spot;
      const mtmAUD =
        ts.direction === "Sell"
          ? audContract - audMarket
          : audMarket - audContract;

      // Accrual only for ITM / Pivot (not OTM)
      const accrualUSD = zone !== "OTM" ? ts.notional : 0;
      ts.cumulativeAccrual += accrualUSD;

      // Terminate if target reached this month
      if (ts.cumulativeAccrual >= ts.targetAccrual) {
        ts.isActive = false;
        note += " — target reached, terminates";
      }

      tradeResults.push({
        tradeId: ts.id, product: ts.product, provider: ts.provider,
        zone, accrualUSD, mtmAUD, note,
      });
    }

    const monthlyMTM = tradeResults.reduce((s, t) => s + t.mtmAUD, 0);
    const monthlyAccrual = tradeResults.reduce((s, t) => s + t.accrualUSD, 0);
    cumulativeMTM += monthlyMTM;
    cumulativeAccrual += monthlyAccrual;

    results.push({
      month: i + 1,
      label: MONTH_LABELS[i] ?? `M${i + 1}`,
      spotRate: spot,
      trades: tradeResults,
      monthlyAccrualUSD: monthlyAccrual,
      monthlyMTMAUD: monthlyMTM,
      cumulativeMTMAUD: cumulativeMTM,
      cumulativeAccrualUSD: cumulativeAccrual,
    });
  }

  return results;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtAUD(v: number, compact = true) {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "+";
  if (compact) {
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
    return `${sign}$${abs.toFixed(0)}`;
  }
  return (v >= 0 ? "+" : "") + v.toLocaleString("en-AU", {
    style: "currency", currency: "AUD",
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  });
}

function fmtUSD(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v.toFixed(0)}`;
}

const ZONE_STYLES: Record<Zone, string> = {
  ITM:        "bg-green-500/15 text-green-400 border-green-500/25",
  Pivot:      "bg-amber-500/15 text-amber-400 border-amber-500/25",
  OTM:        "bg-red-500/15 text-red-400 border-red-500/25",
  KO:         "bg-orange-500/15 text-orange-400 border-orange-500/25",
  Terminated: "bg-muted/50 text-muted-foreground border-border",
};

// ─── Chart Tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { dataKey: string; value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const monthly    = payload.find((p) => p.dataKey === "monthlyMTMAUD");
  const cumulative = payload.find((p) => p.dataKey === "cumulativeMTMAUD");
  const spot       = payload.find((p) => p.dataKey === "spotRate");

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-xl text-xs space-y-1.5">
      <p className="font-semibold text-foreground">{label}</p>
      {spot && (
        <p className="text-muted-foreground font-mono">
          AUD/USD {spot.value.toFixed(4)}
        </p>
      )}
      {monthly && (
        <p className={monthly.value >= 0 ? "text-green-400" : "text-red-400"}>
          Monthly MTM: {fmtAUD(monthly.value)}
        </p>
      )}
      {cumulative && (
        <p className={`font-bold ${cumulative.value >= 0 ? "text-green-400" : "text-red-400"}`}>
          Cumulative: {fmtAUD(cumulative.value)}
        </p>
      )}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, variant = "default",
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType;
  variant?: "default" | "green" | "red" | "primary";
}) {
  const bg = variant === "primary" ? "bg-primary/10 border border-primary/20"
    : variant === "green" ? "bg-green-500/10 border border-green-500/20"
    : variant === "red" ? "bg-red-500/10 border border-red-500/20"
    : "bg-muted/40 border border-border";
  const iconBg = variant === "primary" ? "bg-primary"
    : variant === "green" ? "bg-green-500"
    : variant === "red" ? "bg-red-500"
    : "bg-muted";
  const textColor = variant === "primary" ? "text-primary"
    : variant === "green" ? "text-green-400"
    : variant === "red" ? "text-red-400"
    : "text-foreground";

  return (
    <div className={`rounded-lg p-5 ${bg}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const DEFAULT_RATES = Array(12).fill("0.6500");

export default function RatePathPlannerPage() {
  const [monthCount, setMonthCount] = useState(12);
  const [rateInputs, setRateInputs] = useState<string[]>(DEFAULT_RATES);
  const [expandedMonths, setExpandedMonths] = useState<Set<number>>(new Set());

  function setRate(idx: number, val: string) {
    setRateInputs((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }

  function applyPreset(name: string) {
    const rates = PRESETS[name];
    if (!rates) return;
    setRateInputs(rates.map((r) => r.toFixed(4)));
  }

  function toggleMonth(m: number) {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m); else next.add(m);
      return next;
    });
  }

  const spotRates = useMemo(() => {
    return rateInputs.slice(0, monthCount).map((s) => {
      const v = parseFloat(s);
      return isNaN(v) || v <= 0 ? 0.65 : v;
    });
  }, [rateInputs, monthCount]);

  const results = useMemo(() => runSimulation(spotRates), [spotRates]);

  const finalResult = results[results.length - 1];
  const totalMTM    = finalResult?.cumulativeMTMAUD ?? 0;
  const totalAccrual = finalResult?.cumulativeAccrualUSD ?? 0;

  const koCount = useMemo(() => {
    const seen = new Set<number>();
    for (const row of results) {
      for (const t of row.trades) {
        if (t.zone === "KO") seen.add(t.tradeId);
      }
    }
    return seen.size;
  }, [results]);

  const terminatedCount = useMemo(() => {
    const seen = new Set<number>();
    for (const row of results) {
      for (const t of row.trades) {
        if (t.zone === "Terminated" && !row.trades.find(
          (x) => x.tradeId === t.tradeId && x.zone === "KO"
        )) seen.add(t.tradeId);
      }
    }
    return seen.size;
  }, [results]);

  const chartData = results.map((r) => ({
    label: r.label,
    spotRate: r.spotRate,
    monthlyMTMAUD: r.monthlyMTMAUD,
    cumulativeMTMAUD: r.cumulativeMTMAUD,
  }));

  const maxAbsMTM = Math.max(...results.map((r) => Math.abs(r.monthlyMTMAUD)), 1);

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Rate Path Planner"
        items={[{ label: "FX Tools" }, { label: "Rate Path Planner" }]}
      />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Rate Path Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter a monthly AUD/USD path and simulate the full Convera portfolio — TARF accruals,
          barrier triggers, and cumulative MTM — month by month.
        </p>
      </div>

      {/* ── Portfolio Overview ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Convera Portfolio — 4 Active Trades</CardTitle>
              <p className="text-xs text-muted-foreground">
                All active positions will be simulated through the rate path
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-2">
            {CONVERA_TRADES.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2"
              >
                <span className="text-xs font-semibold text-foreground">{t.product}</span>
                <span className="text-[10px] text-muted-foreground">
                  {t.direction} · ${(t.notional / 1000).toFixed(0)}k/mo · {t.provider}
                </span>
                <Badge className="h-4 rounded px-1 text-[9px] bg-primary/10 text-primary border-0">
                  target {fmtUSD(t.targetAccrual)}
                </Badge>
                {t.lower_ki && (
                  <Badge className="h-4 rounded px-1 text-[9px] bg-orange-500/10 text-orange-400 border-0">
                    KI {t.lower_ki}–{t.upper_ki}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Rate Path Input ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-base font-semibold">Rate Path Input</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              {/* Month count selector */}
              <div className="flex gap-1 rounded-lg bg-muted p-1">
                {[3, 6, 9, 12].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMonthCount(n)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                      monthCount === n
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {n}mo
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRateInputs(DEFAULT_RATES)}
                className="h-8 text-xs"
              >
                <RefreshCw className="mr-1.5 h-3 w-3" />
                Reset
              </Button>
            </div>
          </div>

          {/* Preset scenario buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="self-center text-xs text-muted-foreground">Presets:</span>
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="rounded-md border border-border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                {name}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12">
            {Array.from({ length: monthCount }, (_, i) => (
              <div key={i} className="space-y-1.5">
                <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {MONTH_LABELS[i]}
                </Label>
                <Input
                  type="number"
                  step="0.0001"
                  min="0.40"
                  max="1.00"
                  value={rateInputs[i]}
                  onChange={(e) => setRate(i, e.target.value)}
                  className="h-9 px-2 text-center font-mono text-sm"
                />
                {/* Mini sparkline bar showing rate relative to 0.55–0.85 range */}
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/60 transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((parseFloat(rateInputs[i]) || 0.65) - 0.55) / 0.30 * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Final Cumulative MTM"
          value={fmtAUD(totalMTM)}
          sub={`after ${monthCount} months`}
          icon={totalMTM >= 0 ? TrendingUp : TrendingDown}
          variant={totalMTM >= 0 ? "green" : "red"}
        />
        <StatCard
          label="Total USD Accrued"
          value={fmtUSD(totalAccrual)}
          sub="across all active periods"
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          label="Products Knocked Out"
          value={String(koCount)}
          sub={koCount > 0 ? "barrier events triggered" : "no barrier events"}
          icon={Zap}
          variant={koCount > 0 ? "red" : "default"}
        />
        <StatCard
          label="Products Hit Target"
          value={String(terminatedCount)}
          sub={terminatedCount > 0 ? "reached accrual target" : "all still running"}
          icon={Activity}
          variant={terminatedCount > 0 ? "green" : "default"}
        />
      </div>

      {/* ── MTM Chart ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Portfolio MTM Path</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Bars = monthly MTM · Line = cumulative MTM
                </p>
              </div>
            </div>
            <div className="hidden items-center gap-4 text-[11px] text-muted-foreground sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500/60" />
                ITM month
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500/60" />
                OTM month
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-5 bg-primary" />
                Cumulative
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 pt-0">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => fmtAUD(v)}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={64}
              />
              <RechartsTooltip content={<ChartTooltip />} />
              <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1.5} />

              {/* Monthly MTM bars — green/red by sign */}
              <Bar dataKey="monthlyMTMAUD" name="Monthly MTM" maxBarSize={36} radius={[3, 3, 0, 0]}>
                {chartData.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={entry.monthlyMTMAUD >= 0
                      ? `rgba(34,197,94,${0.3 + 0.5 * Math.min(1, Math.abs(entry.monthlyMTMAUD) / maxAbsMTM)})`
                      : `rgba(239,68,68,${0.3 + 0.5 * Math.min(1, Math.abs(entry.monthlyMTMAUD) / maxAbsMTM)})`
                    }
                  />
                ))}
              </Bar>

              {/* Cumulative MTM line */}
              <Line
                dataKey="cumulativeMTMAUD"
                name="Cumulative MTM"
                type="monotone"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 2 }}
                activeDot={{ r: 5, strokeWidth: 2, stroke: "hsl(var(--card))" }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Monthly Breakdown Table ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Map className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Month-by-Month Breakdown</CardTitle>
              <p className="text-xs text-muted-foreground">
                Click a row to expand per-product detail
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground w-8" />
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Month</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Spot</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product Activity</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Accrual (USD)</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Monthly MTM</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cumulative MTM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {results.map((row) => {
                  const expanded = expandedMonths.has(row.month);
                  const hasEvents = row.trades.some(
                    (t) => t.zone === "KO" || t.note.includes("terminates")
                  );

                  return (
                    <React.Fragment key={row.month}>
                      {/* Summary row */}
                      <tr
                        onClick={() => toggleMonth(row.month)}
                        className={`cursor-pointer transition-colors hover:bg-muted/20 ${
                          expanded ? "bg-muted/10" : ""
                        } ${hasEvents ? "border-l-2 border-l-orange-400/60" : ""}`}
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {expanded
                            ? <ChevronDown className="h-3.5 w-3.5" />
                            : <ChevronRight className="h-3.5 w-3.5" />
                          }
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground">{row.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">M{row.month}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-sm text-foreground">
                          {row.spotRate.toFixed(4)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {row.trades.map((t) => (
                              <span
                                key={t.tradeId}
                                className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium ${ZONE_STYLES[t.zone]}`}
                              >
                                {t.product.split(" ")[0]}{" "}
                                {t.product.includes("EKI") ? "EKI" : ""}
                                {t.product.includes("Count") ? "Cnt" : ""}{" "}
                                {t.zone}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                          {fmtUSD(row.monthlyAccrualUSD)}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-semibold text-sm ${
                          row.monthlyMTMAUD >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {fmtAUD(row.monthlyMTMAUD)}
                        </td>
                        <td className={`px-4 py-3 text-right font-mono font-bold text-sm ${
                          row.cumulativeMTMAUD >= 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {fmtAUD(row.cumulativeMTMAUD)}
                        </td>
                      </tr>

                      {/* Expanded trade detail */}
                      {expanded && (
                        <tr className="bg-muted/5">
                          <td colSpan={7} className="px-0 py-0">
                            <div className="border-b border-border/40 bg-muted/10 px-6 py-3">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-muted-foreground/70">
                                    <th className="pb-1.5 text-left font-medium">Product</th>
                                    <th className="pb-1.5 text-left font-medium">Provider</th>
                                    <th className="pb-1.5 text-left font-medium">Zone</th>
                                    <th className="pb-1.5 text-right font-medium">Accrual USD</th>
                                    <th className="pb-1.5 text-right font-medium">MTM AUD</th>
                                    <th className="pb-1.5 text-left font-medium pl-4">Note</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                  {row.trades.map((t) => (
                                    <tr key={t.tradeId}>
                                      <td className="py-1.5 font-medium text-foreground">
                                        {t.product}
                                      </td>
                                      <td className="py-1.5 text-muted-foreground">
                                        {t.provider}
                                      </td>
                                      <td className="py-1.5">
                                        <span
                                          className={`inline-flex rounded border px-1.5 py-0.5 text-[9px] font-semibold ${ZONE_STYLES[t.zone]}`}
                                        >
                                          {t.zone}
                                        </span>
                                      </td>
                                      <td className="py-1.5 text-right font-mono text-foreground">
                                        {t.accrualUSD > 0 ? fmtUSD(t.accrualUSD) : "—"}
                                      </td>
                                      <td className={`py-1.5 text-right font-mono font-semibold ${
                                        t.mtmAUD > 0 ? "text-green-400"
                                          : t.mtmAUD < 0 ? "text-red-400"
                                          : "text-muted-foreground"
                                      }`}>
                                        {t.mtmAUD !== 0 ? fmtAUD(t.mtmAUD) : "—"}
                                      </td>
                                      <td className="py-1.5 pl-4 text-muted-foreground/70 italic">
                                        {t.note}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>

            {/* Footer totals */}
            <div className="flex items-center justify-between border-t-2 border-border bg-muted/40 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {monthCount}-Month Total
              </span>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Total Accrual</p>
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {fmtUSD(totalAccrual)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Cumulative MTM</p>
                  <p className={`font-mono text-sm font-bold ${
                    totalMTM >= 0 ? "text-green-400" : "text-red-400"
                  }`}>
                    {fmtAUD(totalMTM)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
