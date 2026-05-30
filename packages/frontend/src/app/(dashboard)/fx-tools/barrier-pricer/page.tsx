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
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Ruler,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types — mirror BarrierRequest / BarrierResponse exactly
// ---------------------------------------------------------------------------

type BarrierType = "down-in" | "down-out" | "up-in" | "up-out";

interface BarrierResponse {
  price: number;
  trigger_status: "triggered" | "not triggered";
  distance_to_trigger: number;
}

interface FormState {
  option_type: "call" | "put";
  barrier_type: BarrierType;
  spot: string;
  strike: string;
  barrier_level: string;
  expiry: string;
  notional: string;
  vol: string;
  r_domestic: string;
  r_foreign: string;
}

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toISOString().slice(0, 10);
}

const DEFAULT_FORM: FormState = {
  option_type: "call",
  barrier_type: "down-out",
  spot: "0.6500",
  strike: "0.6500",
  barrier_level: "0.6200",
  expiry: defaultExpiry(),
  notional: "1000000",
  vol: "10.00",
  r_domestic: "4.35",
  r_foreign: "5.25",
};

const BARRIER_TYPE_LABELS: Record<BarrierType, string> = {
  "down-in":  "Down-In",
  "down-out": "Down-Out",
  "up-in":    "Up-In",
  "up-out":   "Up-Out",
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

function daysUntil(dateStr: string) {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(1, Math.round(ms / 86_400_000));
}

// ---------------------------------------------------------------------------
// Stat card — identical pattern to Vanilla page
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

export default function BarrierPricerPage() {
  const [form, setForm]     = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<BarrierResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
    setError(null);
  }

  async function handlePrice() {
    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      spot:          parseFloat(form.spot),
      strike:        parseFloat(form.strike),
      barrier_level: parseFloat(form.barrier_level),
      expiry:        form.expiry,
      notional:      parseFloat(form.notional),
      vol:           parseFloat(form.vol) / 100,
      r_domestic:    parseFloat(form.r_domestic) / 100,
      r_foreign:     parseFloat(form.r_foreign) / 100,
      option_type:   form.option_type,
      barrier_type:  form.barrier_type,
    };

    try {
      const res  = await fetch("/api/price/barrier", {
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

      setResult(data as BarrierResponse);
    } catch (err) {
      setError(`Network error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  const premium       = result ? result.price * parseFloat(form.notional || "0") : 0;
  const isTriggered   = result?.trigger_status === "triggered";
  const days          = daysUntil(form.expiry);
  const barrierLabel  = BARRIER_TYPE_LABELS[form.barrier_type];

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Barrier Option Pricer"
        items={[{ label: "FX Tools" }, { label: "Barrier Option Pricer" }]}
      />

      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">Barrier / Trigger Option Pricer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Price AUD/USD knock-in and knock-out barrier options. Results are indicative and for
          internal use only.
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
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Option Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Option type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Option Type</Label>
                <div className="flex gap-2">
                  {(["call", "put"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => update("option_type", t)}
                      className={`flex-1 rounded border py-2 text-sm font-medium transition-colors ${
                        form.option_type === t
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Barrier type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Barrier Type</Label>
                <select
                  value={form.barrier_type}
                  onChange={(e) => update("barrier_type", e.target.value)}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {(Object.entries(BARRIER_TYPE_LABELS) as [BarrierType, string][]).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Spot & Strike */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Spot Rate</Label>
                  <Input value={form.spot} onChange={(e) => update("spot", e.target.value)} placeholder="0.6500" className="text-sm font-mono" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Strike Rate</Label>
                  <Input value={form.strike} onChange={(e) => update("strike", e.target.value)} placeholder="0.6500" className="text-sm font-mono" />
                </div>
              </div>

              {/* Barrier Level */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Barrier Level</Label>
                <Input value={form.barrier_level} onChange={(e) => update("barrier_level", e.target.value)} placeholder="0.6200" className="text-sm font-mono" />
                <p className="text-xs text-muted-foreground">
                  {form.barrier_type.startsWith("down") ? "Should be below spot rate" : "Should be above spot rate"}
                </p>
              </div>

              {/* Expiry */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                <Input type="date" value={form.expiry} onChange={(e) => update("expiry", e.target.value)} className="text-sm font-mono" />
                <p className="text-xs text-muted-foreground">{days} days to expiry</p>
              </div>

              {/* Notional */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Notional (AUD)</Label>
                <Input type="number" value={form.notional} onChange={(e) => update("notional", e.target.value)} placeholder="1000000" className="text-sm font-mono" />
              </div>

              {/* Vol */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Implied Volatility (%)</Label>
                <Input type="number" value={form.vol} onChange={(e) => update("vol", e.target.value)} placeholder="10.00" step="0.1" min="0.01" className="text-sm font-mono" />
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

              <Button className="w-full" onClick={handlePrice} disabled={loading}>
                {loading
                  ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  : <Shield className="mr-2 h-4 w-4" />}
                {loading ? "Pricing…" : "Price Option"}
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
          {/* Pricing Results */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Pricing Results</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    AUD/USD · {barrierLabel} {form.option_type.charAt(0).toUpperCase() + form.option_type.slice(1)}
                  </p>
                </div>
              </div>
              {result && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Priced</Badge>
              )}
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">
                    {loading ? "Contacting pricing engine…" : "Ready to Price"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {loading
                      ? "This may take a moment on a cold start."
                      : 'Set your barrier parameters and click "Price Option".'}
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Stat row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Option Price" value={fmt(result.price, 6)} sub="per unit of notional" icon={Activity} />
                    <StatCard label="Premium (AUD)" value={fmtAUD(premium)} sub={`on ${parseFloat(form.notional).toLocaleString("en-AU")} AUD`} icon={DollarSign} highlight />
                    <StatCard label="Distance to Barrier" value={fmt(Math.abs(result.distance_to_trigger), 4)} sub={result.distance_to_trigger >= 0 ? "not yet breached" : "barrier already breached"} icon={Ruler} />
                  </div>

                  {/* Trigger status banner */}
                  <div className={`flex items-center gap-4 rounded-xl border p-5 ${
                    isTriggered
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}>
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                      isTriggered ? "bg-green-100" : "bg-red-100"
                    }`}>
                      {isTriggered
                        ? <CheckCircle2 className="h-6 w-6 text-green-600" />
                        : <XCircle className="h-6 w-6 text-red-500" />}
                    </div>
                    <div>
                      <Badge className={isTriggered
                        ? "bg-green-600 text-white hover:bg-green-600 text-sm px-3 py-1"
                        : "bg-red-500 text-white hover:bg-red-500 text-sm px-3 py-1"
                      }>
                        {isTriggered ? "TRIGGERED" : "Not Triggered"}
                      </Badge>
                      <p className={`mt-1 text-xs ${isTriggered ? "text-green-700" : "text-red-700"}`}>
                        {isTriggered
                          ? `Spot has already reached the ${barrierLabel.toLowerCase()} barrier at ${form.barrier_level}.`
                          : `Spot is ${fmt(Math.abs(result.distance_to_trigger), 4)} away from the ${barrierLabel.toLowerCase()} barrier at ${form.barrier_level}.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trade Summary */}
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
                  { label: "Pair",         value: "AUD/USD" },
                  { label: "Type",         value: `${form.option_type.charAt(0).toUpperCase()}${form.option_type.slice(1)}` },
                  { label: "Barrier",      value: barrierLabel },
                  { label: "Spot",         value: form.spot },
                  { label: "Strike",       value: form.strike },
                  { label: "Barrier Lvl",  value: form.barrier_level },
                  { label: "Expiry",       value: `${form.expiry} (${days}d)` },
                  { label: "Notional",     value: `AUD ${parseFloat(form.notional || "0").toLocaleString("en-AU")}` },
                  { label: "Vol",          value: `${form.vol}%` },
                  { label: "AUD / USD",    value: `${form.r_domestic}% / ${form.r_foreign}%` },
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
                    A{" "}
                    <span className="font-semibold text-foreground">
                      {barrierLabel} {form.option_type} on{" "}
                      {parseFloat(form.notional || "0").toLocaleString("en-AU")} AUD
                    </span>{" "}
                    with a {form.barrier_type.startsWith("down") ? "downside" : "upside"} barrier at{" "}
                    <span className="font-semibold text-foreground">{form.barrier_level}</span> costs{" "}
                    <span className="font-semibold text-primary">{fmtAUD(premium)}</span> in premium.
                    The barrier is currently{" "}
                    <span className={`font-semibold ${isTriggered ? "text-green-600" : "text-red-500"}`}>
                      {isTriggered ? "triggered" : "not triggered"}
                    </span>
                    {!isTriggered && (
                      <>, with spot{" "}
                        <span className="font-semibold text-foreground">
                          {fmt(Math.abs(result.distance_to_trigger), 4)}
                        </span>{" "}
                        away from the trigger level</>
                    )}.
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
