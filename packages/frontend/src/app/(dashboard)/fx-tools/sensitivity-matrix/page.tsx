"use client";

import { useState, useMemo, useCallback, type ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Label } from "@dashboardpack/core/components/ui/label";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Grid3X3, Plus, Trash2, Download, TrendingUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductType =
  | "FEC"
  | "Vanilla"
  | "Barrier"
  | "TARF"
  | "EKI"
  | "Pivot TARF"
  | "Count TARF";
type Direction = "sell" | "buy";

interface Trade {
  id: string;
  product: ProductType;
  direction: Direction;
  notional: number;
  contractRate: number;
  pivotRate?: number;
  secondStrike?: number;
  lowerKI?: number;
  upperKI?: number;
  isProposed: boolean;
}

interface MatrixParams {
  startRate: string;
  endRate: string;
  intervalPips: string;
  liveSpot: string;
}

interface CellResult {
  audMarket: number;
  audContract: number;
  mtm: number;
  zone: "ITM" | "OTM" | "ATM" | "KOd";
}

interface MatrixRow {
  spot: number;
  cells: CellResult[];
  totalMtm: number;
  isLive: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function fmtAUD(v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${abs.toFixed(0)}`;
}

function fmtNotional(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return `${n}`;
}

function tradeName(trade: Trade, idx: number): string {
  return trade.isProposed ? "Proposed (SY)" : `${trade.product} #${idx + 1}`;
}

function calcCell(spot: number, trade: Trade): CellResult {
  if (spot <= 0 || trade.contractRate <= 0) {
    return { audMarket: 0, audContract: 0, mtm: 0, zone: "ATM" };
  }
  // Knock-out check
  const lki = trade.lowerKI;
  const uki = trade.upperKI;
  if ((lki !== undefined && lki > 0 && spot <= lki) ||
      (uki !== undefined && uki > 0 && spot >= uki)) {
    return { audMarket: 0, audContract: 0, mtm: 0, zone: "KOd" };
  }
  const audMarket = trade.notional / spot;
  const audContract = trade.notional / trade.contractRate;
  // Sell USD (receiving AUD): ITM when contract rate < spot (AUD stronger)
  // Buy USD (paying AUD): ITM when contract rate > spot (USD cheaper)
  const rawMtm = audContract - audMarket;
  const mtm = trade.direction === "sell" ? rawMtm : -rawMtm;
  const zone = Math.abs(mtm) < 1 ? "ATM" : mtm > 0 ? "ITM" : "OTM";
  return { audMarket, audContract, mtm, zone };
}

function heatBg(mtm: number, maxAbs: number): string {
  if (maxAbs === 0 || mtm === 0) return "";
  const t = Math.min(Math.abs(mtm) / maxAbs, 1);
  const a = 0.10 + t * 0.50;
  return mtm > 0
    ? `rgba(34,197,94,${a.toFixed(2)})`
    : `rgba(239,68,68,${a.toFixed(2)})`;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRODUCTS: ProductType[] = [
  "FEC", "Vanilla", "Barrier", "TARF", "EKI", "Pivot TARF", "Count TARF",
];

const SAMPLE_TRADES: Trade[] = [
  {
    id: "s1",
    product: "FEC",
    direction: "sell",
    notional: 1_000_000,
    contractRate: 0.6500,
    isProposed: false,
  },
  {
    id: "s2",
    product: "Vanilla",
    direction: "sell",
    notional: 500_000,
    contractRate: 0.6800,
    isProposed: false,
  },
  {
    id: "s3",
    product: "EKI",
    direction: "sell",
    notional: 750_000,
    contractRate: 0.6600,
    lowerKI: 0.6200,
    upperKI: 0.7200,
    isProposed: false,
  },
];

const DEFAULT_PARAMS: MatrixParams = {
  startRate: "0.60",
  endRate: "0.80",
  intervalPips: "50",
  liveSpot: "0.6500",
};

// ─── TradeCard ────────────────────────────────────────────────────────────────

function TradeCard({
  trade,
  index,
  onUpdate,
  onDelete,
}: {
  trade: Trade;
  index: number;
  onUpdate: (t: Trade) => void;
  onDelete: (id: string) => void;
}) {
  const setNum = (key: keyof Trade, val: string) =>
    onUpdate({ ...trade, [key]: val === "" ? undefined : parseFloat(val) });

  const needsKI = trade.product === "EKI" || trade.product === "Barrier";
  const needsPivot =
    trade.product === "Pivot TARF" || trade.product === "Count TARF";

  return (
    <div
      className={`rounded-lg border p-3 space-y-2.5 ${
        trade.isProposed
          ? "border-amber-400/40 bg-amber-500/5"
          : "border-border/60 bg-muted/10"
      }`}
    >
      {/* Row header */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-semibold ${
            trade.isProposed ? "text-amber-400" : "text-foreground"
          }`}
        >
          {trade.isProposed ? "★ Proposed (SY)" : `Trade ${index + 1}`}
        </span>
        <button
          onClick={() => onDelete(trade.id)}
          className="p-0.5 rounded text-muted-foreground hover:text-red-400 transition-colors"
          aria-label="Remove trade"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Product + Direction */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Product
          </Label>
          <select
            value={trade.product}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onUpdate({ ...trade, product: e.target.value as ProductType })
            }
            className="w-full rounded border border-border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Direction
          </Label>
          <div className="flex gap-1">
            {(["sell", "buy"] as Direction[]).map((d) => (
              <button
                key={d}
                onClick={() => onUpdate({ ...trade, direction: d })}
                className={`flex-1 rounded border py-1.5 text-[10px] font-semibold transition-colors ${
                  trade.direction === d
                    ? d === "sell"
                      ? "border-emerald-500 bg-emerald-500/15 text-emerald-400"
                      : "border-blue-500 bg-blue-500/15 text-blue-400"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                }`}
              >
                {d === "sell" ? "Sell" : "Buy"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notional + Contract rate */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Notional USD
          </Label>
          <Input
            type="number"
            value={trade.notional}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNum("notional", e.target.value)}
            className="h-7 text-xs font-mono px-2"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Contract Rate
          </Label>
          <Input
            type="number"
            step="0.0001"
            value={trade.contractRate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNum("contractRate", e.target.value)}
            className="h-7 text-xs font-mono px-2"
          />
        </div>
      </div>

      {/* Pivot Rate + 2nd Strike (Pivot TARF / Count TARF) */}
      {needsPivot && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Pivot Rate
            </Label>
            <Input
              type="number"
              step="0.0001"
              value={trade.pivotRate ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNum("pivotRate", e.target.value)}
              placeholder="Optional"
              className="h-7 text-xs font-mono px-2"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
              2nd Strike
            </Label>
            <Input
              type="number"
              step="0.0001"
              value={trade.secondStrike ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNum("secondStrike", e.target.value)}
              placeholder="Optional"
              className="h-7 text-xs font-mono px-2"
            />
          </div>
        </div>
      )}

      {/* Lower / Upper KI (EKI / Barrier) */}
      {needsKI && (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Lower KI
            </Label>
            <Input
              type="number"
              step="0.0001"
              value={trade.lowerKI ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNum("lowerKI", e.target.value)}
              placeholder="e.g. 0.6200"
              className="h-7 text-xs font-mono px-2"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] text-muted-foreground uppercase tracking-wide">
              Upper KI
            </Label>
            <Input
              type="number"
              step="0.0001"
              value={trade.upperKI ?? ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNum("upperKI", e.target.value)}
              placeholder="e.g. 0.7200"
              className="h-7 text-xs font-mono px-2"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SensitivityMatrixPage() {
  const [params, setParams] = useState<MatrixParams>(DEFAULT_PARAMS);
  const [trades, setTrades] = useState<Trade[]>(SAMPLE_TRADES);

  const updateParam = (k: keyof MatrixParams, v: string) =>
    setParams((p) => ({ ...p, [k]: v }));

  const addTrade = (proposed: boolean) => {
    setTrades((prev) => [
      ...prev,
      {
        id: uid(),
        product: "FEC",
        direction: "sell",
        notional: 1_000_000,
        contractRate: 0.65,
        isProposed: proposed,
      },
    ]);
  };

  const updateTrade = useCallback(
    (t: Trade) => setTrades((prev) => prev.map((x) => (x.id === t.id ? t : x))),
    []
  );

  const deleteTrade = useCallback(
    (id: string) => setTrades((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  // ── Compute matrix ──────────────────────────────────────────────────────────
  const matrix = useMemo(() => {
    const start = parseFloat(params.startRate) || 0.6;
    const end = parseFloat(params.endRate) || 0.8;
    const pips = parseFloat(params.intervalPips) || 50;
    const interval = pips * 0.0001;
    const liveSpot = parseFloat(params.liveSpot) || 0.65;

    // Build spot levels avoiding floating-point drift
    const count = Math.round((end - start) / interval) + 1;
    const spotLevels: number[] = Array.from({ length: count }, (_, i) =>
      parseFloat((start + i * interval).toFixed(4))
    );

    // Find row closest to live spot
    let closestIdx = 0;
    let minDist = Infinity;
    spotLevels.forEach((sp, i) => {
      const d = Math.abs(sp - liveSpot);
      if (d < minDist) {
        minDist = d;
        closestIdx = i;
      }
    });
    const markLive = liveSpot >= start - interval && liveSpot <= end + interval;

    const rows: MatrixRow[] = spotLevels.map((spot, i) => {
      const cells = trades.map((t) => calcCell(spot, t));
      const totalMtm = cells.reduce((sum, c) => sum + c.mtm, 0);
      return { spot, cells, totalMtm, isLive: markLive && i === closestIdx };
    });

    // Max absolute MTM for heatmap scaling
    let maxAbsMtm = 1;
    for (const row of rows) {
      for (const c of row.cells) {
        if (Math.abs(c.mtm) > maxAbsMtm) maxAbsMtm = Math.abs(c.mtm);
      }
      if (Math.abs(row.totalMtm) > maxAbsMtm) maxAbsMtm = Math.abs(row.totalMtm);
    }

    return { rows, maxAbsMtm };
  }, [params, trades]);

  // ── Export CSV ──────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = [
      "Spot Rate",
      ...trades.map((t, i) => tradeName(t, i)),
      "TOTAL MTM (AUD)",
    ];
    const rowData = matrix.rows.map((row) => [
      row.spot.toFixed(4),
      ...row.cells.map((c) => (c.zone === "KOd" ? "KOd" : c.mtm.toFixed(0))),
      row.totalMtm.toFixed(0),
    ]);
    const csv = [headers, ...rowData].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sensitivity-matrix.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Sensitivity Matrix"
        items={[{ label: "FX Tools" }, { label: "Sensitivity Matrix" }]}
      />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          Sensitivity Matrix
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Portfolio MTM across a spot rate range.&nbsp; Green&nbsp;=&nbsp;ITM,
          Red&nbsp;=&nbsp;OTM, darker&nbsp;=&nbsp;larger magnitude.
          Blue row&nbsp;=&nbsp;live spot.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        {/* ── Left panel ────────────────────────────────────────────────────── */}
        <div className="xl:w-[320px] flex-shrink-0 space-y-4">
          {/* Matrix parameters */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base font-semibold">
                Matrix Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Start Rate
                  </Label>
                  <Input
                    type="number"
                    step="0.005"
                    value={params.startRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateParam("startRate", e.target.value)}
                    className="text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    End Rate
                  </Label>
                  <Input
                    type="number"
                    step="0.005"
                    value={params.endRate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateParam("endRate", e.target.value)}
                    className="text-sm font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Interval (pips)
                  </Label>
                  <Input
                    type="number"
                    step="5"
                    min="1"
                    value={params.intervalPips}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateParam("intervalPips", e.target.value)
                    }
                    className="text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Live Spot
                  </Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={params.liveSpot}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateParam("liveSpot", e.target.value)}
                    className="text-sm font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground border-t border-border pt-2">
                {matrix.rows.length} rows &nbsp;·&nbsp;{" "}
                {trades.length} trade{trades.length !== 1 ? "s" : ""}
                &nbsp;·&nbsp; interval {parseFloat(params.intervalPips) || 50}{" "}
                pips
              </p>
            </CardContent>
          </Card>

          {/* Trades list */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold">
                  Trades
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-0.5">
                {trades.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-8">
                    No trades added yet
                  </p>
                ) : (
                  trades.map((t, i) => (
                    <TradeCard
                      key={t.id}
                      trade={t}
                      index={i}
                      onUpdate={updateTrade}
                      onDelete={deleteTrade}
                    />
                  ))
                )}
              </div>

              <div className="space-y-2 pt-1">
                <Button
                  variant="outline"
                  className="w-full text-xs h-8"
                  onClick={() => addTrade(false)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Trade
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs h-8 border-amber-400/40 text-amber-500 hover:bg-amber-500/10 hover:border-amber-400/60"
                  onClick={() => addTrade(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Proposed Trade (SY)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Matrix ────────────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">
                    MTM Sensitivity Matrix
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    AUD mark-to-market by spot rate level
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Legend */}
                <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-green-500/50 inline-block" />
                    ITM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-red-500/50 inline-block" />
                    OTM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-blue-500/30 inline-block" />
                    Live
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportCSV}
                  className="h-8 text-xs gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {trades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Grid3X3 className="h-10 w-10 opacity-20 mb-3" />
                  <p className="text-sm font-medium">No trades in portfolio</p>
                  <p className="text-xs mt-1 opacity-70">
                    Add trades on the left to generate the matrix
                  </p>
                </div>
              ) : (
                <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
                  <table className="text-xs border-collapse w-full">
                    {/* ── Column headers ── */}
                    <thead className="sticky top-0 z-20">
                      <tr className="border-b-2 border-border bg-card">
                        {/* Spot header — sticky left */}
                        <th className="sticky left-0 z-30 bg-card border-r border-border px-3 py-3 text-left text-muted-foreground font-medium whitespace-nowrap min-w-[96px]">
                          Spot Rate
                        </th>

                        {/* Trade headers */}
                        {trades.map((t, i) => (
                          <th
                            key={t.id}
                            className={`px-3 py-2 text-center font-medium min-w-[120px] ${
                              t.isProposed
                                ? "border-l border-r border-amber-400/25 bg-amber-500/5"
                                : ""
                            }`}
                          >
                            <div
                              className={`text-[11px] font-semibold ${
                                t.isProposed
                                  ? "text-amber-400"
                                  : "text-foreground"
                              }`}
                            >
                              {tradeName(t, i)}
                            </div>
                            <div className="text-[9px] text-muted-foreground font-normal mt-0.5">
                              {t.direction === "sell"
                                ? "Sell USD"
                                : "Buy USD"}{" "}
                              · {fmtNotional(t.notional)}
                            </div>
                            <div className="text-[9px] text-muted-foreground/60 font-mono">
                              @ {t.contractRate.toFixed(4)}
                            </div>
                          </th>
                        ))}

                        {/* Total header */}
                        <th className="px-3 py-2 text-center font-bold text-foreground min-w-[120px] bg-primary/5 border-l-2 border-primary/20">
                          <div className="text-[11px]">TOTAL</div>
                          <div className="text-[9px] text-muted-foreground font-normal mt-0.5">
                            Portfolio MTM
                          </div>
                        </th>
                      </tr>
                    </thead>

                    {/* ── Rows ── */}
                    <tbody>
                      {matrix.rows.map((row) => (
                        <tr
                          key={row.spot}
                          className={`border-b border-border/40 group ${
                            row.isLive
                              ? "border-blue-500/40"
                              : "hover:bg-muted/15"
                          }`}
                          style={
                            row.isLive
                              ? { backgroundColor: "rgba(59,130,246,0.10)" }
                              : undefined
                          }
                        >
                          {/* Spot cell — sticky left */}
                          <td
                            className={`sticky left-0 z-10 px-3 py-2 border-r border-border font-mono font-semibold whitespace-nowrap text-[11px] ${
                              row.isLive
                                ? "text-blue-300"
                                : "text-muted-foreground"
                            }`}
                            style={
                              row.isLive
                                ? { backgroundColor: "rgba(59,130,246,0.18)" }
                                : { backgroundColor: "var(--card)" }
                            }
                          >
                            {row.spot.toFixed(4)}
                            {row.isLive && (
                              <span className="ml-1 text-[8px] text-blue-400 font-bold">
                                ●
                              </span>
                            )}
                          </td>

                          {/* Trade cells */}
                          {row.cells.map((cell, ci) => {
                            const t = trades[ci];

                            if (cell.zone === "KOd") {
                              return (
                                <td
                                  key={t.id}
                                  className={`px-2 py-2 text-center ${
                                    t.isProposed
                                      ? "border-l border-r border-amber-400/15"
                                      : ""
                                  }`}
                                >
                                  <span className="text-[10px] text-muted-foreground/35 font-medium tracking-wide">
                                    KO
                                  </span>
                                </td>
                              );
                            }

                            return (
                              <td
                                key={t.id}
                                className={`px-2 py-1.5 text-right ${
                                  t.isProposed
                                    ? "border-l border-r border-amber-400/15"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: heatBg(
                                    cell.mtm,
                                    matrix.maxAbsMtm
                                  ),
                                }}
                              >
                                <div
                                  className={`text-[11px] font-mono font-semibold leading-tight ${
                                    cell.mtm > 0
                                      ? "text-green-400"
                                      : cell.mtm < 0
                                      ? "text-red-400"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {fmtAUD(cell.mtm)}
                                </div>
                                <div className="text-[9px] text-muted-foreground/45 leading-tight">
                                  {cell.zone}
                                </div>
                              </td>
                            );
                          })}

                          {/* Total cell */}
                          <td
                            className="px-2 py-1.5 text-right border-l-2 border-primary/20"
                            style={{
                              backgroundColor: heatBg(
                                row.totalMtm,
                                matrix.maxAbsMtm
                              ),
                            }}
                          >
                            <div
                              className={`text-[11px] font-mono font-bold leading-tight ${
                                row.totalMtm > 0
                                  ? "text-green-400"
                                  : row.totalMtm < 0
                                  ? "text-red-400"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {fmtAUD(row.totalMtm)}
                            </div>
                            <div
                              className={`text-[9px] leading-tight ${
                                row.totalMtm > 0
                                  ? "text-green-400/50"
                                  : row.totalMtm < 0
                                  ? "text-red-400/50"
                                  : "text-muted-foreground/50"
                              }`}
                            >
                              {row.totalMtm >= 0 ? "net ITM" : "net OTM"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
