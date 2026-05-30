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
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  TrendingUp,
  RefreshCw,
  AlertCircle,
  DollarSign,
  Target,
  Activity,
  CalendarRange,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types — mirror TARFRequest / TARFResponse / MonthlySettlement exactly
// ---------------------------------------------------------------------------

interface MonthlySettlement {
  month: number;
  rate: number;
  pnl: number;
  accrued: number;
}

interface TARFResponse {
  monthly_breakdown: MonthlySettlement[];
  months_to_target: number | null;
  total_accrued: number;
  status: "active" | "target_hit";
}

interface FormState {
  strike: string;
  spot: string;
  notional: string;
  target_profit: string;
  num_months: string;
  r_domestic: string;
  r_foreign: string;
}

const DEFAULT_FORM: FormState = {
  strike: "0.6500",
  spot: "0.6500",
  notional: "100000",
  target_profit: "50000",
  num_months: "12",
  r_domestic: "4.35",
  r_foreign: "5.25",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(value: number, decimals = 4) {
  return value.toLocaleString("en-AU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtAUD(value: number) {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ---------------------------------------------------------------------------
// Stat card — same pattern as Vanilla / Barrier pages
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-5 ${highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${highlight ? "bg-primary" : "bg-muted"}`}>
          <Icon className={`h-4 w-4 ${highlight ? "text-white" : "text-muted-foreground"}`} />
        </div>
        <span className={`text-xs font-medium ${highlight ? "text-primary" : "text-muted-foreground"}`}>
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
      {sub && (
        <p className={`mt-1 text-xs ${highlight ? "text-primary/70" : "text-muted-foreground"}`}>{sub}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function TARFSimulatorPage() {
  const [form, setForm]     = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<TARFResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
    setError(null);
  }

  async function handleSimulate() {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      strike:        parseFloat(form.strike),
      spot:          parseFloat(form.spot),
      notional:      parseFloat(form.notional),
      target_profit: parseFloat(form.target_profit),
      num_months:    parseInt(form.num_months, 10),
      r_domestic:    parseFloat(form.r_domestic) / 100,
      r_foreign:     parseFloat(form.r_foreign) / 100,
    };

    try {
      const res  = await fetch("/api/price/tarf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        const detail = Array.isArray(data?.detail)
          ? data.detail.map((d: { msg: string }) => d.msg).join("; ")
          : (data?.detail ?? data?.error ?? `Error ${res.status}`);
        setError(detail);
        return;
      }

      setResult(data as TARFResponse);
    } catch (err) {
      setError(`Network error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  const targetProfit   = parseFloat(form.target_profit || "0");
  const isTargetHit    = result?.status === "target_hit";
  const progressPct    = result
    ? Math.min(100, (result.total_accrued / targetProfit) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="TARF Simulator"
        items={[{ label: "FX Tools" }, { label: "TARF Simulator" }]}
      />

      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">TARF Simulator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Simulate a Target Accrual Redemption Forward (TARF) — a structured FX product that
          terminates early once a cumulative profit target is reached.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ------------------------------------------------------------------ */}
        {/* Left — form                                                          */}
        {/* ------------------------------------------------------------------ */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">TARF Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Strike & Spot */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Strike Rate</Label>
                  <Input value={form.strike} onChange={(e) => update("strike", e.target.value)} placeholder="0.6500" className="text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Current Spot</Label>
                  <Input value={form.spot} onChange={(e) => update("spot", e.target.value)} placeholder="0.6500" className="text-sm font-mono" />
                </div>
              </div>

              {/* Notional per month */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Notional per Month (AUD)</Label>
                <Input type="number" value={form.notional} onChange={(e) => update("notional", e.target.value)} placeholder="100000" className="text-sm font-mono" />
              </div>

              {/* Target Profit */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Target Profit (AUD)</Label>
                <Input type="number" value={form.target_profit} onChange={(e) => update("target_profit", e.target.value)} placeholder="50000" className="text-sm font-mono" />
                <p className="text-xs text-muted-foreground">Structure terminates when cumulative profit reaches this level</p>
              </div>

              {/* Months */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Number of Months (max 24)</Label>
                <Input
                  type="number"
                  value={form.num_months}
                  onChange={(e) => update("num_months", e.target.value)}
                  placeholder="12"
                  min="1"
                  max="24"
                  className="text-sm font-mono"
                />
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">AUD Rate (%)</Label>
                  <Input type="number" value={form.r_domestic} onChange={(e) => update("r_domestic", e.target.value)} placeholder="4.35" step="0.01" className="text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">USD Rate (%)</Label>
                  <Input type="number" value={form.r_foreign} onChange={(e) => update("r_foreign", e.target.value)} placeholder="5.25" step="0.01" className="text-sm font-mono" />
                </div>
              </div>

              <Button className="w-full" onClick={handleSimulate} disabled={loading}>
                {loading
                  ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  : <Target className="mr-2 h-4 w-4" />}
                {loading ? "Simulating…" : "Simulate TARF"}
              </Button>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-xs text-red-700 break-all">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Right — results                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Summary cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Simulation Results</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    AUD/USD · {form.num_months}-month TARF · Target {fmtAUD(targetProfit)}
                  </p>
                </div>
              </div>
              {result && (
                <Badge className={isTargetHit
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                }>
                  {isTargetHit ? "Target Hit" : "Active"}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Target className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">
                    {loading ? "Running simulation…" : "Ready to Simulate"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {loading
                      ? "This may take a moment on a cold start."
                      : 'Enter the TARF parameters and click "Simulate TARF".'}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* 3 stat cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                      label="Months to Target"
                      value={result.months_to_target !== null ? `Month ${result.months_to_target}` : "Not reached"}
                      sub={result.months_to_target !== null ? "target profit hit" : `across all ${form.num_months} months`}
                      icon={CalendarRange}
                    />
                    <StatCard
                      label="Total Accrued"
                      value={fmtAUD(result.total_accrued)}
                      sub="cumulative profit / loss"
                      icon={DollarSign}
                      highlight
                    />
                    <StatCard
                      label="Status"
                      value={isTargetHit ? "Target Hit" : "Active"}
                      sub={isTargetHit ? "structure has terminated" : "structure still running"}
                      icon={isTargetHit ? CheckCircle2 : Clock}
                    />
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Accrued progress to target</span>
                      <span className="font-medium text-foreground">{progressPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isTargetHit ? "bg-green-500" : "bg-primary"
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>AUD 0</span>
                      <span>Target {fmtAUD(targetProfit)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly breakdown table */}
          {result && (
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <CalendarRange className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Monthly Breakdown</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {result.monthly_breakdown.length} settlement{result.monthly_breakdown.length !== 1 ? "s" : ""} · AUD notional {parseFloat(form.notional).toLocaleString("en-AU")} per month
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">Month</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Rate</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">P&amp;L (AUD)</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">Accrued (AUD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.monthly_breakdown.map((row) => {
                        const isHitMonth = result.months_to_target === row.month;
                        return (
                          <tr
                            key={row.month}
                            className={`transition-colors ${
                              isHitMonth
                                ? "bg-green-50"
                                : "hover:bg-muted/30"
                            }`}
                          >
                            <td className="px-4 py-3 font-medium text-foreground">
                              <div className="flex items-center gap-2">
                                Month {row.month}
                                {isHitMonth && (
                                  <Badge className="bg-green-600 text-white hover:bg-green-600 text-xs px-1.5 py-0">
                                    Target Hit
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">
                              {fmt(row.rate, 5)}
                            </td>
                            <td className={`px-4 py-3 text-right font-mono font-medium ${
                              row.pnl >= 0 ? "text-green-600" : "text-red-500"
                            }`}>
                              {row.pnl >= 0 ? "+" : ""}{fmtAUD(row.pnl)}
                            </td>
                            <td className="px-4 py-3 text-right font-mono text-foreground">
                              {fmtAUD(row.accrued)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-border bg-muted/40">
                        <td className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase" colSpan={2}>Total</td>
                        <td colSpan={2} className="px-4 py-3 text-right font-mono font-bold text-foreground">
                          {fmtAUD(result.total_accrued)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trade summary */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <CardTitle className="text-base font-semibold">Trade Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
                {[
                  { label: "Pair",           value: "AUD/USD" },
                  { label: "Strike",         value: form.strike },
                  { label: "Spot",           value: form.spot },
                  { label: "Monthly Ntnl",   value: `AUD ${parseFloat(form.notional || "0").toLocaleString("en-AU")}` },
                  { label: "Target",         value: fmtAUD(targetProfit) },
                  { label: "Max Months",     value: form.num_months },
                  { label: "AUD / USD Rate", value: `${form.r_domestic}% / ${form.r_foreign}%` },
                  { label: "Status",         value: result ? (isTargetHit ? "Target Hit" : "Active") : "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-0.5 font-medium text-foreground font-mono">{value}</p>
                  </div>
                ))}
              </div>

              {result && (
                <div className="mt-5 flex items-start gap-2 rounded-lg bg-primary/5 p-3">
                  <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground">
                    A TARF with a strike of{" "}
                    <span className="font-semibold text-foreground">{form.strike}</span>, monthly notional
                    of{" "}
                    <span className="font-semibold text-foreground">
                      AUD {parseFloat(form.notional || "0").toLocaleString("en-AU")}
                    </span>
                    , and a target profit of{" "}
                    <span className="font-semibold text-foreground">{fmtAUD(targetProfit)}</span>{" "}
                    {isTargetHit ? (
                      <>
                        <span className="font-semibold text-green-600">hit its target</span> in month{" "}
                        <span className="font-semibold text-foreground">{result.months_to_target}</span>, accruing a total of{" "}
                        <span className="font-semibold text-primary">{fmtAUD(result.total_accrued)}</span>.
                      </>
                    ) : (
                      <>
                        ran for{" "}
                        <span className="font-semibold text-foreground">{result.monthly_breakdown.length} months</span>{" "}
                        without hitting the target, accruing a total of{" "}
                        <span className="font-semibold text-primary">{fmtAUD(result.total_accrued)}</span>.
                      </>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
