"use client";

import { useState, useCallback } from "react";
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
import { ApexChart } from "@/components/dashboard/apex-chart";
import {
  TrendingUp,
  BarChart2,
  Calendar,
  RefreshCw,
  Building2,
  Zap,
  ChevronDown,
  Info,
  Clock,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Currency pairs
// ---------------------------------------------------------------------------

const CURRENCIES = [
  "USD", "EUR", "GBP", "AUD", "JPY", "CAD", "CHF", "NZD",
  "SGD", "HKD", "CNY", "INR", "MXN", "BRL", "ZAR",
];

// ---------------------------------------------------------------------------
// Simulated live rates (mid-market)
// ---------------------------------------------------------------------------

const MOCK_RATES: Record<string, Record<string, number>> = {
  USD: { GBP: 0.7892, EUR: 0.9201, AUD: 1.5234, JPY: 149.82, CAD: 1.3645 },
  EUR: { USD: 1.0868, GBP: 0.8577, AUD: 1.6557, JPY: 162.81, CAD: 1.4832 },
  GBP: { USD: 1.2670, EUR: 1.1659, AUD: 1.9302, JPY: 189.86, CAD: 1.7289 },
  AUD: { USD: 0.6564, EUR: 0.6040, GBP: 0.5181, JPY: 98.35, CAD: 0.8959 },
  JPY: { USD: 0.00667, EUR: 0.00614, GBP: 0.00527, AUD: 0.01017, CAD: 0.00910 },
};

function getRate(sell: string, buy: string): number | null {
  if (sell === buy) return 1;
  return MOCK_RATES[sell]?.[buy] ?? null;
}

// ---------------------------------------------------------------------------
// Historical chart options
// ---------------------------------------------------------------------------

const buildHistoricalChartOpts = (pair: string): ApexCharts.ApexOptions => ({
  chart: {
    type: "area",
    height: 220,
    toolbar: { show: false },
    fontFamily: "inherit",
    zoom: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2, colors: ["var(--primary)"] },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.35,
      opacityTo: 0.02,
      stops: [0, 100],
      colorStops: [
        { offset: 0, color: "var(--primary)", opacity: 0.35 },
        { offset: 100, color: "var(--primary)", opacity: 0.02 },
      ],
    },
  },
  xaxis: {
    type: "datetime",
    labels: { datetimeUTC: false, style: { colors: "#888", fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: "#888", fontSize: "11px" },
      formatter: (v: number) => v.toFixed(4),
    },
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  tooltip: { theme: "dark", x: { format: "MMM dd, yyyy" } },
  annotations: { yaxis: [] },
});

function generateHistoricalData(sell: string, buy: string) {
  const baseRate = getRate(sell, buy) ?? 1;
  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  const points: [number, number][] = [];
  for (let i = 365; i >= 0; i--) {
    const t = now - i * 24 * 60 * 60 * 1000;
    const noise = (Math.sin(i * 0.05) * 0.03 + Math.cos(i * 0.02) * 0.02 + (Math.random() - 0.5) * 0.01);
    points.push([t, parseFloat((baseRate * (1 + noise)).toFixed(5))]);
  }
  return points;
}

// ---------------------------------------------------------------------------
// Spread bar chart
// ---------------------------------------------------------------------------

const spreadChartOpts: ApexCharts.ApexOptions = {
  chart: { type: "bar", height: 180, toolbar: { show: false }, fontFamily: "inherit" },
  plotOptions: {
    bar: { horizontal: true, barHeight: "55%", borderRadius: 4, distributed: true },
  },
  colors: ["#e58a00", "var(--primary)"],
  dataLabels: {
    enabled: true,
    formatter: (v: number) => `${v} bps`,
    style: { fontSize: "12px", colors: ["#fff"] },
  },
  xaxis: {
    categories: ["Your Provider", "SwitchYard FX"],
    labels: { style: { colors: "#888" } },
  },
  yaxis: { labels: { style: { colors: "#888" } } },
  grid: { borderColor: "transparent" },
  legend: { show: false },
  tooltip: { theme: "dark", y: { formatter: (v: number) => `${v} basis points` } },
};

// ---------------------------------------------------------------------------
// Settlement date helper (T+2 business days)
// ---------------------------------------------------------------------------

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-AU", { month: "long", day: "numeric", year: "numeric" });
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function FxComparePage() {
  const [sellCurrency, setSellCurrency] = useState("USD");
  const [buyCurrency, setBuyCurrency]   = useState("GBP");
  const [sellAmount, setSellAmount]     = useState("100,000.00");
  const [buyAmount, setBuyAmount]       = useState("100,000.00");
  const [tradeDate, setTradeDate]       = useState("");
  const [provider, setProvider]         = useState("");
  const [providerRate, setProviderRate] = useState("");
  const [calculated, setCalculated]     = useState(false);
  const [isLive, setIsLive]             = useState(true);

  const settlementDate = addBusinessDays(new Date(), 2);
  const midRate        = getRate(sellCurrency, buyCurrency);

  // Provider spread vs mid (default 30 bps)
  const providerRateNum = parseFloat(providerRate.replace(/,/g, "")) || 0;
  const providerSpreadBps = midRate && providerRateNum
    ? Math.abs(Math.round((providerRateNum / midRate - 1) * 10000))
    : 30;
  const switchyardSpreadBps = 8;

  const handleCalculate = useCallback(() => {
    if (!midRate) return;
    const rawSell = parseFloat(sellAmount.replace(/,/g, "")) || 100000;
    const newBuy = (rawSell * midRate).toFixed(2);
    setBuyAmount(parseFloat(newBuy).toLocaleString("en-AU", { minimumFractionDigits: 2 }));
    setCalculated(true);
  }, [sellAmount, midRate]);

  const historicalSeries = [
    { name: `${sellCurrency}/${buyCurrency}`, data: generateHistoricalData(sellCurrency, buyCurrency) },
  ];

  const spreadSeries = [{ data: [providerSpreadBps, switchyardSpreadBps] }];

  const providerCost = midRate && providerRateNum
    ? Math.abs((providerRateNum - midRate) * (parseFloat(sellAmount.replace(/,/g, "")) || 100000))
    : null;
  const switchyardCost = midRate
    ? (midRate * (switchyardSpreadBps / 10000)) * (parseFloat(sellAmount.replace(/,/g, "")) || 100000)
    : null;

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Compare Provider Rates"
        items={[{ label: "FX Tools" }, { label: "Compare Provider Rates" }]}
      />

      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Compare your provider with SwitchYard FX
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the details of a trade with your existing FX provider, and we&apos;ll calculate and compare their rate with SwitchYard FX.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* ---------------------------------------------------------------- */}
        {/* Left col — Trade Details form                                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="col-span-12 lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <BarChart2 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">Trade Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Sell / Buy */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Sell</Label>
                  <div className="flex overflow-hidden rounded border border-border bg-background">
                    <select
                      value={sellCurrency}
                      onChange={(e) => { setSellCurrency(e.target.value); setCalculated(false); }}
                      className="flex-shrink-0 border-r border-border bg-muted px-2 py-2 text-sm font-medium focus:outline-none"
                    >
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input
                      type="text"
                      value={sellAmount}
                      onChange={(e) => { setSellAmount(e.target.value); setCalculated(false); }}
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
                      placeholder="100,000.00"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Buy</Label>
                  <div className="flex overflow-hidden rounded border border-border bg-background">
                    <select
                      value={buyCurrency}
                      onChange={(e) => { setBuyCurrency(e.target.value); setCalculated(false); }}
                      className="flex-shrink-0 border-r border-border bg-muted px-2 py-2 text-sm font-medium focus:outline-none"
                    >
                      {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <input
                      type="text"
                      value={calculated ? buyAmount : ""}
                      readOnly
                      className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-muted-foreground focus:outline-none"
                      placeholder="100,000.00"
                    />
                  </div>
                </div>
              </div>

              {/* Settlement Date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Settlement Date</Label>
                <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(settlementDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                    Spot Trade
                  </Badge>
                  <span className="text-xs text-muted-foreground">T+2 (2 business days)</span>
                </div>
              </div>

              {/* Trade Date */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Trade Date <span className="text-muted-foreground/60">(Optional)</span>
                </Label>
                <div className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={tradeDate}
                    onChange={(e) => setTradeDate(e.target.value)}
                    className="flex-1 bg-transparent text-sm focus:outline-none text-muted-foreground"
                    placeholder="Select trade date for historical analysis"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank for current market analysis, or select a past date to analyse historical trades (from Jan 2022)
                </p>
              </div>

              {/* Provider */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Provider</Label>
                <Input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. Bank of America, Wise, etc."
                  className="text-sm"
                />
              </div>

              {/* Provider Rate */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Your Provider&apos;s Rate <span className="text-muted-foreground/60">(Optional)</span>
                </Label>
                <Input
                  value={providerRate}
                  onChange={(e) => setProviderRate(e.target.value)}
                  placeholder={midRate ? midRate.toFixed(4) : "e.g. 0.7850"}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the exchange rate your provider quoted to see cost comparison
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleCalculate}
                disabled={!midRate}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Calculate &amp; Compare Rates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Right col — Results panels                                        */}
        {/* ---------------------------------------------------------------- */}
        <div className="col-span-12 space-y-6 lg:col-span-8">
          {/* Live Market Rate */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Live Market Rate</CardTitle>
                  <p className="text-xs text-muted-foreground">{sellCurrency}/{buyCurrency}</p>
                </div>
              </div>
              <Badge className="flex items-center gap-1.5 bg-green-100 text-green-700 hover:bg-green-100">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                {isLive ? "Live" : "Historical"}
              </Badge>
            </CardHeader>
            <CardContent>
              {!calculated ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BarChart2 className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">Ready to Calculate</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter your trade details and click &quot;Calculate &amp; Compare Rates&quot; to see market rates
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Mid-Market Rate</p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {midRate?.toFixed(5)}
                    </p>
                    <p className="text-xs text-muted-foreground">{sellCurrency}/{buyCurrency}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground">You Send</p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {parseFloat(sellAmount.replace(/,/g, "")).toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">{sellCurrency}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-4 text-center">
                    <p className="text-xs text-primary">Recipient Gets</p>
                    <p className="mt-1 text-xl font-bold text-primary">{buyAmount}</p>
                    <p className="text-xs text-primary/70">{buyCurrency}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Spread Analysis */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e58a00]/10">
                <BarChart2 className="h-5 w-5 text-[#e58a00]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Spread Analysis</CardTitle>
                <p className="text-xs text-muted-foreground">Compare provider spreads vs market</p>
              </div>
            </CardHeader>
            <CardContent>
              {!calculated ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BarChart2 className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">Waiting for Analysis</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete the form above to see your provider&apos;s spread analysis
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ApexChart
                    type="bar"
                    options={spreadChartOpts}
                    series={spreadSeries}
                    height={180}
                  />
                  <div className="flex items-start gap-2 rounded-lg bg-primary/5 p-3">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      Your provider charges{" "}
                      <span className="font-semibold text-[#e58a00]">{providerSpreadBps} bps</span>{" "}
                      spread vs SwitchYard FX&apos;s{" "}
                      <span className="font-semibold text-primary">{switchyardSpreadBps} bps</span>.
                      That&apos;s{" "}
                      <span className="font-semibold text-foreground">
                        {providerSpreadBps - switchyardSpreadBps} bps more
                      </span>{" "}
                      per trade.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Provider vs SwitchYard — side by side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Your Provider */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    {provider || "Your Provider"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">Rate Analysis</p>
                </div>
              </CardHeader>
              <CardContent>
                {!calculated ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <Building2 className="mb-3 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">Awaiting Provider Rate</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Enter your provider&apos;s rate to see detailed analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="font-semibold">
                        {providerRateNum ? providerRateNum.toFixed(5) : (midRate ? (midRate * (1 - 0.003)).toFixed(5) : "—")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spread</span>
                      <span className="font-semibold text-[#e58a00]">{providerSpreadBps} bps</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hidden Cost</span>
                      <span className="font-semibold text-red-500">
                        {providerCost
                          ? `${buyCurrency} ${providerCost.toFixed(2)}`
                          : `${buyCurrency} ${((midRate ?? 1) * 0.003 * (parseFloat(sellAmount.replace(/,/g, "")) || 100000)).toFixed(2)}`}
                      </span>
                    </div>
                    <div className="mt-2 h-px bg-border" />
                    <p className="text-xs text-muted-foreground">
                      Based on {providerSpreadBps} bps spread above mid-market rate
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SwitchYard FX */}
            <Card className="border border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-primary">SwitchYard FX</CardTitle>
                  <p className="text-xs text-muted-foreground">Our Best Rate</p>
                </div>
              </CardHeader>
              <CardContent>
                {!calculated ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <BarChart2 className="mb-3 h-8 w-8 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">Ready to Compare</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Complete the calculation to see SwitchYard FX&apos;s competitive rates
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rate</span>
                      <span className="font-semibold text-primary">
                        {midRate ? (midRate * (1 - switchyardSpreadBps / 10000)).toFixed(5) : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spread</span>
                      <span className="font-semibold text-primary">{switchyardSpreadBps} bps</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-semibold text-green-600">
                        {switchyardCost
                          ? `${buyCurrency} ${switchyardCost.toFixed(2)}`
                          : "—"}
                      </span>
                    </div>
                    <div className="mt-2 h-px bg-border" />
                    <p className="text-xs text-primary/70">
                      You save{" "}
                      <span className="font-semibold text-primary">
                        {buyCurrency}{" "}
                        {(
                          ((providerCost ?? (midRate ?? 1) * 0.003 * (parseFloat(sellAmount.replace(/,/g, "")) || 100000))) -
                          (switchyardCost ?? 0)
                        ).toFixed(2)}
                      </span>{" "}
                      with SwitchYard FX
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Historical Rates chart */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Historical Rates</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {sellCurrency}/{buyCurrency} — Last 1 Year
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {!calculated ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BarChart2 className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="font-medium text-muted-foreground">Historical Data Ready</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Click &quot;Calculate &amp; Compare Rates&quot; to view historical rate trends
                  </p>
                </div>
              ) : (
                <ApexChart
                  key={`${sellCurrency}-${buyCurrency}`}
                  type="area"
                  options={buildHistoricalChartOpts(`${sellCurrency}/${buyCurrency}`)}
                  series={historicalSeries}
                  height={220}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
