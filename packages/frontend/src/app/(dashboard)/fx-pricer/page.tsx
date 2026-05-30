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
  Activity,
  Percent,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PriceResult {
  price: number;
  delta: number;
  premium: number;
}

interface FormState {
  spot: string;
  strike: string;
  expiry_days: string;
  notional: string;
  vol: string;
  rate_dom: string;
  rate_for: string;
  option_type: "call" | "put";
}

const DEFAULT_FORM: FormState = {
  spot: "0.6500",
  strike: "0.6500",
  expiry_days: "90",
  notional: "1000000",
  vol: "10.00",
  rate_dom: "4.35",
  rate_for: "5.25",
  option_type: "call",
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
// Result stat card
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
    <div
      className={`rounded-lg p-5 ${highlight ? "bg-primary/10 border border-primary/20" : "bg-muted/50"}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${highlight ? "bg-primary" : "bg-muted"}`}
        >
          <Icon className={`h-4 w-4 ${highlight ? "text-white" : "text-muted-foreground"}`} />
        </div>
        <span className={`text-xs font-medium ${highlight ? "text-primary" : "text-muted-foreground"}`}>
          {label}
        </span>
      </div>
      <p className={`text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      {sub && (
        <p className={`mt-1 text-xs ${highlight ? "text-primary/70" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function VanillaPricerPage() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [result, setResult] = useState<PriceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      spot: parseFloat(form.spot),
      strike: parseFloat(form.strike),
      T: parseFloat(form.expiry_days) / 365,
      notional: parseFloat(form.notional),
      vol: parseFloat(form.vol) / 100,
      rate_dom: parseFloat(form.rate_dom) / 100,
      rate_for: parseFloat(form.rate_for) / 100,
      option_type: form.option_type,
    };

    try {
      const res = await fetch("/api/price/vanilla", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? data?.detail ?? `Error ${res.status}`);
        return;
      }

      setResult({
        price: data.price ?? 0,
        delta: data.delta ?? 0,
        premium: data.premium ?? data.price * parseFloat(form.notional),
      });
    } catch (err) {
      setError(`Network error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Vanilla Option Pricer"
        items={[{ label: "FX Tools" }, { label: "Vanilla Option Pricer" }]}
      />

      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">Vanilla Option Pricer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Price AUD/USD vanilla FX options using the SwitchYard pricing engine. Results are
          indicative and for internal use only.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ------------------------------------------------------------------ */}
        {/* Left — inputs                                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
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

              {/* Spot & Strike */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Spot Rate</Label>
                  <Input
                    value={form.spot}
                    onChange={(e) => update("spot", e.target.value)}
                    placeholder="0.6500"
                    className="text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Strike Rate</Label>
                  <Input
                    value={form.strike}
                    onChange={(e) => update("strike", e.target.value)}
                    placeholder="0.6500"
                    className="text-sm font-mono"
                  />
                </div>
              </div>

              {/* Expiry & Notional */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Days to Expiry</Label>
                  <Input
                    type="number"
                    value={form.expiry_days}
                    onChange={(e) => update("expiry_days", e.target.value)}
                    placeholder="90"
                    min="1"
                    className="text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Notional (AUD)</Label>
                  <Input
                    type="number"
                    value={form.notional}
                    onChange={(e) => update("notional", e.target.value)}
                    placeholder="1000000"
                    className="text-sm font-mono"
                  />
                </div>
              </div>

              {/* Volatility */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Implied Volatility (%)</Label>
                <Input
                  type="number"
                  value={form.vol}
                  onChange={(e) => update("vol", e.target.value)}
                  placeholder="10.00"
                  step="0.1"
                  className="text-sm font-mono"
                />
              </div>

              {/* Rates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">AUD Rate (%)</Label>
                  <Input
                    type="number"
                    value={form.rate_dom}
                    onChange={(e) => update("rate_dom", e.target.value)}
                    placeholder="4.35"
                    step="0.01"
                    className="text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">USD Rate (%)</Label>
                  <Input
                    type="number"
                    value={form.rate_for}
                    onChange={(e) => update("rate_for", e.target.value)}
                    placeholder="5.25"
                    step="0.01"
                    className="text-sm font-mono"
                  />
                </div>
              </div>

              <Button
                className="w-full"
                onClick={handlePrice}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <TrendingUp className="mr-2 h-4 w-4" />
                )}
                {loading ? "Pricing…" : "Price Option"}
              </Button>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Right — results                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Summary card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Pricing Results</CardTitle>
                  <p className="text-xs text-muted-foreground">AUD/USD · Vanilla {form.option_type}</p>
                </div>
              </div>
              {result && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  Priced
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">
                    {loading ? "Contacting pricing engine…" : "Ready to Price"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {loading
                      ? "This may take a moment on a cold start."
                      : "Fill in the parameters and click \"Price Option\" to get a live quote."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Option Price"
                    value={fmt(result.price, 6)}
                    sub="% of notional (decimal)"
                    icon={Percent}
                  />
                  <StatCard
                    label="Delta"
                    value={fmt(result.delta, 4)}
                    sub="sensitivity to spot move"
                    icon={Activity}
                  />
                  <StatCard
                    label="Premium (AUD)"
                    value={fmtAUD(result.premium)}
                    sub={`on ${parseFloat(form.notional).toLocaleString("en-AU")} AUD notional`}
                    icon={DollarSign}
                    highlight
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trade summary card (always shown) */}
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
                  { label: "Pair", value: "AUD/USD" },
                  { label: "Type", value: `${form.option_type.charAt(0).toUpperCase()}${form.option_type.slice(1)}` },
                  { label: "Spot", value: form.spot },
                  { label: "Strike", value: form.strike },
                  { label: "Expiry", value: `${form.expiry_days} days` },
                  { label: "Notional", value: `AUD ${parseFloat(form.notional || "0").toLocaleString("en-AU")}` },
                  { label: "Vol", value: `${form.vol}%` },
                  { label: "AUD / USD Rate", value: `${form.rate_dom}% / ${form.rate_for}%` },
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
                      {form.option_type} on {parseFloat(form.notional || "0").toLocaleString("en-AU")} AUD
                    </span>{" "}
                    with a strike of{" "}
                    <span className="font-semibold text-foreground">{form.strike}</span> expiring in{" "}
                    <span className="font-semibold text-foreground">{form.expiry_days} days</span> costs{" "}
                    <span className="font-semibold text-primary">{fmtAUD(result.premium)}</span> in
                    premium. Delta is{" "}
                    <span className="font-semibold text-foreground">{fmt(result.delta, 4)}</span>, meaning
                    the option moves{" "}
                    <span className="font-semibold text-foreground">
                      {fmtAUD(Math.abs(result.delta) * parseFloat(form.notional || "0") * 0.0001)}
                    </span>{" "}
                    per pip.
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
