// TODO: Replace hardcoded data with Neon DB queries when Daniel shares credentials

"use client";

import { useState, useMemo } from "react";
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
import { Slider } from "@dashboardpack/core/components/ui/slider";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Briefcase,
  RefreshCw,
  Download,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronRight,
  X,
  AlertCircle,
  Gauge,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Trade {
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
  status: "active" | "sent" | "draft";
}

interface AddTradeFormState {
  product: string;
  direction: string;
  notional: string;
  contract_rate: string;
  provider: string;
  status: string;
}

// ─── Hardcoded Data ───────────────────────────────────────────────────────────

const CLIENTS = ["Convera", "ABC Corp", "XYZ Ltd"];

const INITIAL_TRADES: Record<string, Trade[]> = {
  Convera: [
    { id: 1, product: "Pivot TARF", direction: "Sell", notional: 300000, contract_rate: 0.683, pivot_rate: 0.705, second_strike: 0.754, provider: "SwitchYard", status: "active" },
    { id: 2, product: "EKI Pivot TARF", direction: "Sell", notional: 200000, contract_rate: 0.6375, pivot_rate: 0.67, lower_ki: 0.615, upper_ki: 0.71, provider: "SwitchYard", status: "active" },
    { id: 3, product: "Count TARF", direction: "Buy", notional: 200000, contract_rate: 0.67, provider: "NAB", status: "active" },
    { id: 4, product: "Pivot TARF", direction: "Sell", notional: 200000, contract_rate: 0.619, pivot_rate: 0.6505, second_strike: 0.675, provider: "Westpac", status: "active" },
    { id: 5, product: "TARF", direction: "Sell", notional: 400000, contract_rate: 0.685, provider: "SwitchYard", status: "sent" },
    { id: 6, product: "TARF", direction: "Sell", notional: 400000, contract_rate: 0.64, provider: "ANZ", status: "draft" },
  ],
  "ABC Corp": [],
  "XYZ Ltd": [],
};

const EMPTY_FORM: AddTradeFormState = {
  product: "",
  direction: "Sell",
  notional: "",
  contract_rate: "",
  provider: "",
  status: "active",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcMTM(trade: Trade, spot: number) {
  const audContract = trade.notional / trade.contract_rate;
  const audMarket   = trade.notional / spot;
  const mtm         = audContract - audMarket;
  return { audContract, audMarket, mtm };
}

function fmtAUD(value: number) {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function fmtRate(value: number) {
  return value.toFixed(4);
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  highlight = false,
  variant = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  highlight?: boolean;
  variant?: "default" | "green" | "red";
}) {
  const bg =
    highlight
      ? "bg-primary/10 border border-primary/20"
      : variant === "green"
      ? "bg-green-50 border border-green-200"
      : variant === "red"
      ? "bg-red-50 border border-red-200"
      : "bg-muted/50";

  const iconBg =
    highlight
      ? "bg-primary"
      : variant === "green"
      ? "bg-green-500"
      : variant === "red"
      ? "bg-red-500"
      : "bg-muted";

  const iconColor =
    highlight || variant !== "default" ? "text-white" : "text-muted-foreground";

  const labelColor =
    highlight
      ? "text-primary"
      : variant === "green"
      ? "text-green-700"
      : variant === "red"
      ? "text-red-700"
      : "text-muted-foreground";

  const valueColor =
    highlight
      ? "text-primary"
      : variant === "green"
      ? "text-green-700"
      : variant === "red"
      ? "text-red-600"
      : "text-foreground";

  return (
    <div className={`rounded-lg p-5 ${bg}`}>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      {sub && (
        <p className={`mt-1 text-xs ${labelColor}`}>{sub}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClientPositionsPage() {
  const [selectedClient, setSelectedClient] = useState<string>(CLIENTS[0]);
  const [allTrades, setAllTrades]           = useState(INITIAL_TRADES);
  const [scenarioRate, setScenarioRate]     = useState(0.65);
  const [showAddForm, setShowAddForm]       = useState(false);
  const [addForm, setAddForm]               = useState<AddTradeFormState>(EMPTY_FORM);
  const [addError, setAddError]             = useState<string | null>(null);
  const [nextId, setNextId]                 = useState(100);

  const clientTrades = allTrades[selectedClient] ?? [];

  const enriched = useMemo(
    () =>
      clientTrades.map((t) => {
        const { audContract, audMarket, mtm } = calcMTM(t, scenarioRate);
        return { ...t, audContract, audMarket, mtm, zone: mtm > 0 ? "ITM" : "OTM" };
      }),
    [clientTrades, scenarioRate],
  );

  const activeTrades = enriched.filter((t) => t.status === "active");
  const totalMTM     = activeTrades.reduce((sum, t) => sum + t.mtm, 0);
  const itmCount     = activeTrades.filter((t) => t.mtm > 0).length;
  const otmCount     = activeTrades.filter((t) => t.mtm <= 0).length;
  const largestAbs   = activeTrades.reduce(
    (max, t) => (Math.abs(t.mtm) > Math.abs(max.mtm) ? t : max),
    { mtm: 0 } as (typeof enriched)[0],
  );

  const byProvider = useMemo(() => {
    const groups: Record<string, typeof enriched> = {};
    enriched.forEach((t) => {
      if (!groups[t.provider]) groups[t.provider] = [];
      groups[t.provider].push(t);
    });
    return groups;
  }, [enriched]);

  function handleExportCSV() {
    const headers = [
      "Product", "Provider", "Direction", "Notional USD",
      "Contract Rate", "Spot", "AUD Contract", "AUD Market",
      "MTM AUD", "Zone", "Status",
    ];
    const rows = enriched.map((t) => [
      t.product, t.provider, t.direction, t.notional,
      fmtRate(t.contract_rate), fmtRate(scenarioRate),
      t.audContract.toFixed(2), t.audMarket.toFixed(2),
      t.mtm.toFixed(2), t.zone, t.status,
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${selectedClient.replace(/\s+/g, "_")}_positions_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleAddTrade() {
    if (!addForm.product.trim()) { setAddError("Product name is required."); return; }
    if (!addForm.notional || isNaN(parseFloat(addForm.notional))) { setAddError("Valid notional is required."); return; }
    if (!addForm.contract_rate || isNaN(parseFloat(addForm.contract_rate))) { setAddError("Valid contract rate is required."); return; }
    if (!addForm.provider.trim()) { setAddError("Provider is required."); return; }

    const newTrade: Trade = {
      id:            nextId,
      product:       addForm.product.trim(),
      direction:     addForm.direction as "Buy" | "Sell",
      notional:      parseFloat(addForm.notional),
      contract_rate: parseFloat(addForm.contract_rate),
      provider:      addForm.provider.trim(),
      status:        addForm.status as "active" | "sent" | "draft",
    };

    setAllTrades((prev) => ({
      ...prev,
      [selectedClient]: [...(prev[selectedClient] ?? []), newTrade],
    }));
    setNextId((id) => id + 1);
    setAddForm(EMPTY_FORM);
    setAddError(null);
    setShowAddForm(false);
  }

  function updateAdd(field: keyof AddTradeFormState, value: string) {
    setAddForm((prev) => ({ ...prev, [field]: value }));
    setAddError(null);
  }

  const TABLE_COLS = [
    "Product", "Provider", "Direction", "Notional USD",
    "Contract Rate", "Spot", "AUD Contract", "AUD Market",
    "MTM (AUD)", "Zone", "Status",
  ];

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Client Positions"
        items={[{ label: "FX Tools" }, { label: "Client Positions" }]}
      />

      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-foreground">Client Positions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live mark-to-market across all active FX structured products. Updating spot recalculates every MTM instantly.
        </p>
      </div>

      {/* ── Controls bar ── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Client tabs */}
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              {CLIENTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedClient(c)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedClient === c
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Label className="whitespace-nowrap text-xs text-muted-foreground">
                  Live Spot AUD/USD
                </Label>
                <Input
                  value={fmtRate(scenarioRate)}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v) && v > 0) setScenarioRate(v);
                  }}
                  className="w-28 font-mono text-sm"
                  placeholder="0.6500"
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setScenarioRate(0.65)}>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Export CSV
              </Button>
              <Button size="sm" onClick={() => { setShowAddForm(true); setAddError(null); }}>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Trade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Portfolio MTM (AUD)"
          value={fmtAUD(totalMTM)}
          sub={`${activeTrades.length} active trade${activeTrades.length !== 1 ? "s" : ""}`}
          icon={Activity}
          highlight
        />
        <StatCard
          label="ITM Positions"
          value={String(itmCount)}
          sub="in-the-money"
          icon={TrendingUp}
          variant="green"
        />
        <StatCard
          label="OTM Positions"
          value={String(otmCount)}
          sub="out-of-the-money"
          icon={TrendingDown}
          variant="red"
        />
        <StatCard
          label="Largest Single Exposure"
          value={largestAbs.mtm !== 0 ? fmtAUD(Math.abs(largestAbs.mtm)) : "—"}
          sub={largestAbs.mtm !== 0 ? (largestAbs.mtm > 0 ? "ITM" : "OTM") : "no active trades"}
          icon={DollarSign}
        />
      </div>

      {/* ── Positions table ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {selectedClient} — Open Positions
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Spot {fmtRate(scenarioRate)} · {enriched.length} trade{enriched.length !== 1 ? "s" : ""} · Portfolio MTM{" "}
                <span className={totalMTM >= 0 ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                  {fmtAUD(totalMTM)}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
              {`${itmCount} ITM`}
            </Badge>
            <Badge className="bg-red-100 text-red-600 hover:bg-red-100 text-xs">
              {`${otmCount} OTM`}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {enriched.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14">
              <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">No positions for {selectedClient}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Click &ldquo;Add Trade&rdquo; to create a new position.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {Object.entries(byProvider).map(([provider, rows]) => (
                <div key={provider}>
                  {/* Provider section header */}
                  <div className="flex items-center gap-2 border-y border-border bg-muted/30 px-4 py-2">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {provider}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {rows.length} trade{rows.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/20">
                        {TABLE_COLS.map((col) => (
                          <th
                            key={col}
                            className="whitespace-nowrap px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.map((t) => {
                        const rowBg =
                          t.status === "sent"
                            ? "bg-amber-50/80"
                            : t.status === "draft"
                            ? "bg-purple-50/80"
                            : "hover:bg-muted/30";

                        return (
                          <tr key={t.id} className={`transition-colors ${rowBg}`}>
                            <td className="px-4 py-3 font-medium text-foreground">
                              {t.product}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{t.provider}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`text-xs font-semibold ${
                                  t.direction === "Buy" ? "text-green-600" : "text-red-500"
                                }`}
                              >
                                {t.direction}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-mono text-foreground">
                              {t.notional.toLocaleString("en-AU")}
                            </td>
                            <td className="px-4 py-3 font-mono text-foreground">
                              {fmtRate(t.contract_rate)}
                            </td>
                            <td className="px-4 py-3 font-mono text-muted-foreground">
                              {fmtRate(scenarioRate)}
                            </td>
                            <td className="px-4 py-3 font-mono text-foreground">
                              {fmtAUD(t.audContract)}
                            </td>
                            <td className="px-4 py-3 font-mono text-foreground">
                              {fmtAUD(t.audMarket)}
                            </td>
                            <td
                              className={`px-4 py-3 font-mono font-semibold ${
                                t.mtm >= 0 ? "text-green-600" : "text-red-500"
                              }`}
                            >
                              {t.mtm >= 0 ? "+" : ""}
                              {fmtAUD(t.mtm)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                className={
                                  t.zone === "ITM"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                                    : "bg-red-100 text-red-600 hover:bg-red-100 text-xs"
                                }
                              >
                                {t.zone}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {t.status === "active" && (
                                <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-xs">
                                  Active
                                </Badge>
                              )}
                              {t.status === "sent" && (
                                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs">
                                  Sent
                                </Badge>
                              )}
                              {t.status === "draft" && (
                                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-xs">
                                  Draft
                                </Badge>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* Portfolio totals footer */}
              <div className="flex items-center justify-between border-t-2 border-border bg-muted/40 px-4 py-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Portfolio Total (active trades only)
                </span>
                <span
                  className={`font-mono text-sm font-bold ${
                    totalMTM >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {totalMTM >= 0 ? "+" : ""}
                  {fmtAUD(totalMTM)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Rate Scenario ── */}
      {enriched.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Gauge className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Rate Scenario</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Drag the AUD/USD spot rate to explore full portfolio impact in real time
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">0.5500</span>
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5">
                  <span className="text-xs text-muted-foreground">AUD/USD</span>
                  <span className="font-mono text-base font-bold text-primary">
                    {fmtRate(scenarioRate)}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">0.8500</span>
              </div>

              <Slider
                min={0.55}
                max={0.85}
                step={0.0001}
                value={[scenarioRate]}
                onValueChange={([v]) => setScenarioRate(v)}
                className="w-full"
              />

              {/* Tick marks */}
              <div className="flex justify-between px-0.5">
                {[0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85].map((v) => (
                  <div key={v} className="flex flex-col items-center gap-1">
                    <div className="h-1 w-px bg-border" />
                    <span
                      className={`font-mono text-[10px] ${
                        Math.abs(v - scenarioRate) < 0.003
                          ? "font-semibold text-primary"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {v.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary banner */}
            <div
              className={`flex flex-col items-center justify-between gap-4 rounded-xl border px-6 py-5 transition-colors sm:flex-row ${
                totalMTM >= 0
                  ? "border-green-500/20 bg-green-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              <p className="text-sm text-muted-foreground">
                At{" "}
                <span className="font-mono font-semibold text-foreground">
                  {fmtRate(scenarioRate)}
                </span>{" "}
                your portfolio MTM would be
              </p>
              <span
                className={`font-mono text-2xl font-bold tracking-tight ${
                  totalMTM >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {totalMTM >= 0 ? "+" : ""}
                {fmtAUD(totalMTM)}
              </span>
            </div>

            {/* Per-provider breakdown */}
            {activeTrades.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Breakdown by provider at {fmtRate(scenarioRate)}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(byProvider).map(([provider, rows]) => {
                    const activeRows = rows.filter((t) => t.status === "active");
                    if (activeRows.length === 0) return null;
                    const providerMTM = activeRows.reduce((sum, t) => sum + t.mtm, 0);
                    return (
                      <div
                        key={provider}
                        className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                          providerMTM >= 0
                            ? "border-green-500/15 bg-green-500/5"
                            : "border-red-500/15 bg-red-500/5"
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-foreground">{provider}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {activeRows.length} active trade{activeRows.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span
                          className={`font-mono text-sm font-bold ${
                            providerMTM >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {providerMTM >= 0 ? "+" : ""}
                          {fmtAUD(providerMTM)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Add Trade modal ── */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Add New Trade</CardTitle>
                  <p className="text-xs text-muted-foreground">{selectedClient}</p>
                </div>
              </div>
              <button
                onClick={() => { setShowAddForm(false); setAddError(null); }}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Product</Label>
                <Input
                  value={addForm.product}
                  onChange={(e) => updateAdd("product", e.target.value)}
                  placeholder="e.g. Pivot TARF"
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Direction</Label>
                  <select
                    value={addForm.direction}
                    onChange={(e) => updateAdd("direction", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option>Buy</option>
                    <option>Sell</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <select
                    value={addForm.status}
                    onChange={(e) => updateAdd("status", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="active">Active</option>
                    <option value="sent">Sent</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Notional (USD)</Label>
                <Input
                  type="number"
                  value={addForm.notional}
                  onChange={(e) => updateAdd("notional", e.target.value)}
                  placeholder="200000"
                  className="font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Contract Rate</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={addForm.contract_rate}
                    onChange={(e) => updateAdd("contract_rate", e.target.value)}
                    placeholder="0.6500"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Provider</Label>
                  <Input
                    value={addForm.provider}
                    onChange={(e) => updateAdd("provider", e.target.value)}
                    placeholder="e.g. SwitchYard"
                    className="text-sm"
                  />
                </div>
              </div>

              {addError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <p className="text-xs text-red-700">{addError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowAddForm(false); setAddError(null); }}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleAddTrade}>
                  Add Trade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
