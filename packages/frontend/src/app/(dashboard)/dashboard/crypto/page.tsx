"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ApexChart } from "@/components/dashboard/apex-chart";
import { DateRangeToggle } from "@/components/dashboard/date-range-toggle";
import { generateMockKpiData, type Range } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Statistics area chart (Row 2, col-span-8)
// ---------------------------------------------------------------------------

const statisticsOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    height: 330,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: ["#4680ff", "#1abc9c"],
  fill: { opacity: 0.2 },
  stroke: { curve: "smooth", width: 2 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisBorder: { show: false },
    labels: { style: { colors: "#888", fontSize: "12px" } },
  },
  yaxis: {
    labels: { style: { colors: "#888", fontSize: "12px" } },
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: { colors: "#888" },
    markers: { size: 4, offsetX: -2 },
  },
  tooltip: { theme: "dark" },
};

const statisticsSeries = [
  { name: "Bitcoin", data: [31, 40, 28, 51, 42, 85, 77, 95, 87, 73, 69, 85] },
  { name: "Ethereum", data: [11, 32, 45, 32, 34, 52, 41, 58, 47, 35, 42, 55] },
];

// ---------------------------------------------------------------------------
// Portfolio sparkline (Row 3, col-span-4)
// ---------------------------------------------------------------------------

const portfolioOpts: ApexCharts.ApexOptions = {
  chart: {
    type: "area",
    height: 280,
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: ["#4680ff"],
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 } },
  stroke: { curve: "smooth", width: 2 },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: { style: { colors: "#888", fontSize: "11px" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { colors: "#888", fontSize: "11px" },
      formatter: (v: number) => `$${v}`,
    },
  },
  grid: { borderColor: "#e9ecef", strokeDashArray: 3 },
  tooltip: { theme: "dark", y: { formatter: (v: number) => `$${v.toFixed(2)}` } },
};

const portfolioSeries = [
  { name: "Earnings", data: [420, 480, 510, 550, 620, 680, 710, 740, 790, 830, 860, 894] },
];

// ---------------------------------------------------------------------------
// Market Overview sparkline helper
// ---------------------------------------------------------------------------

function makeSparkOpts(positive: boolean): ApexCharts.ApexOptions {
  return {
    chart: {
      type: "line",
      width: 80,
      height: 35,
      sparkline: { enabled: true },
      fontFamily: "inherit",
    },
    colors: [positive ? "#1abc9c" : "#e74c3c"],
    stroke: { curve: "smooth", width: 2 },
    tooltip: { enabled: false },
  };
}

// ---------------------------------------------------------------------------
// Market data
// ---------------------------------------------------------------------------

const marketPairs = [
  {
    pair: "BTC/USD",
    price: "$43,250",
    change: "+2.56%",
    positive: true,
    cap: "$812B",
    sparkData: [38, 42, 40, 45, 43, 47, 44, 49, 46, 50, 47, 43],
  },
  {
    pair: "ETH/USD",
    price: "$2,280",
    change: "-0.87%",
    positive: false,
    cap: "$274B",
    sparkData: [55, 52, 54, 50, 48, 46, 49, 45, 47, 43, 44, 42],
  },
  {
    pair: "BNB/USD",
    price: "$312",
    change: "+1.24%",
    positive: true,
    cap: "$48B",
    sparkData: [28, 30, 29, 31, 33, 32, 34, 35, 33, 36, 35, 37],
  },
  {
    pair: "SOL/USD",
    price: "$98",
    change: "+5.32%",
    positive: true,
    cap: "$42B",
    sparkData: [60, 65, 62, 70, 68, 75, 72, 80, 78, 85, 82, 90],
  },
  {
    pair: "ADA/USD",
    price: "$0.52",
    change: "-1.15%",
    positive: false,
    cap: "$18B",
    sparkData: [45, 43, 44, 41, 40, 38, 39, 36, 37, 34, 35, 33],
  },
];

// ---------------------------------------------------------------------------
// Expanded row details (mock data)
// ---------------------------------------------------------------------------

const pairDetails: Record<string, { high24h: string; low24h: string; volume24h: string; marketCap: string; description: string }> = {
  "BTC/USD": {
    high24h: "$44,120",
    low24h: "$42,380",
    volume24h: "$28.4B",
    marketCap: "$812B",
    description: "Bitcoin is the first decentralized cryptocurrency, created in 2009. It remains the largest by market capitalization and serves as a store of value and medium of exchange.",
  },
  "ETH/USD": {
    high24h: "$2,345",
    low24h: "$2,210",
    volume24h: "$14.2B",
    marketCap: "$274B",
    description: "Ethereum is a decentralized platform that enables smart contracts and decentralized applications (dApps). ETH is the native currency used to pay for transactions and computation.",
  },
  "BNB/USD": {
    high24h: "$318",
    low24h: "$305",
    volume24h: "$1.8B",
    marketCap: "$48B",
    description: "BNB is the native token of the BNB Chain ecosystem, originally created by Binance. It is used for transaction fees, staking, and governance.",
  },
  "SOL/USD": {
    high24h: "$102",
    low24h: "$93",
    volume24h: "$3.6B",
    marketCap: "$42B",
    description: "Solana is a high-performance blockchain supporting fast, low-cost transactions. It is popular for DeFi, NFTs, and Web3 applications.",
  },
  "ADA/USD": {
    high24h: "$0.54",
    low24h: "$0.50",
    volume24h: "$620M",
    marketCap: "$18B",
    description: "Cardano is a proof-of-stake blockchain platform focused on security and sustainability. ADA is used for staking, governance, and transaction fees.",
  },
};

// ---------------------------------------------------------------------------
// Notifications data
// ---------------------------------------------------------------------------

const notifications = [
  {
    text: "New order received",
    amount: "$12.56",
    time: "2 min ago",
    dotColor: "bg-blue-500",
  },
  {
    text: "New user registered",
    amount: "$12.36",
    time: "15 min ago",
    dotColor: "bg-green-500",
  },
  {
    text: "Order completed",
    amount: "$11.45",
    time: "1 hr ago",
    dotColor: "bg-yellow-500",
  },
  {
    text: "Payment pending",
    amount: "$9.39",
    time: "3 hrs ago",
    dotColor: "bg-red-500",
  },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const kpiBaselines = [
  { label: "Bitcoin Wallet",  value: 9302,  total: 20000, color: "#1abc9c" },
  { label: "Dollar Wallet",   value: 8101,  total: 20000, color: "#3498db" },
  { label: "Pound Wallet",    value: 7501,  total: 20000, color: "#4680ff" },
  { label: "Total Earnings",  value: 89439, total: 200000, color: "#4680ff" },
];

const statisticsSeriesByRange: Record<Range, ApexCharts.ApexOptions["series"]> = {
  "7d": [
    { name: "Bitcoin", data: [22, 28, 20, 36, 30, 60, 54] },
    { name: "Ethereum", data: [8, 22, 32, 22, 24, 36, 28] },
  ],
  "30d": statisticsSeries,
  "90d": [
    { name: "Bitcoin", data: [93, 120, 84, 153, 126, 255, 231, 285, 261, 219, 207, 255] },
    { name: "Ethereum", data: [33, 96, 135, 96, 102, 156, 123, 174, 141, 105, 126, 165] },
  ],
};

export default function CryptoDashboardPage() {
  const [dateRange, setDateRange] = useState<Range>("30d");
  const [expandedPair, setExpandedPair] = useState<string | null>(null);
  const kpiData = generateMockKpiData(kpiBaselines, dateRange);
  const activeSeries = statisticsSeriesByRange[dateRange];

  return (
    <div className="space-y-6 p-6">
      <PageBreadcrumb
        title="Crypto"
        items={[{ label: "Dashboard" }, { label: "Crypto" }]}
      />

      {/* Row 1: Wallet cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bitcoin Wallet */}
        <div className="col-span-4">
          <div className="rounded bg-gradient-to-br from-[#1abc9c] to-[#16a085] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-sm text-white/70">Bitcoin Wallet</h6>
                <h3 className="mt-1 text-3xl font-light text-white">${kpiData[0].value.toLocaleString()}</h3>
              </div>
              <span className="text-6xl font-light text-white/20">₿</span>
            </div>
          </div>
        </div>

        {/* Dollar Wallet */}
        <div className="col-span-4">
          <div className="rounded bg-gradient-to-br from-[#3498db] to-[#2980b9] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-sm text-white/70">Dollar Wallet</h6>
                <h3 className="mt-1 text-3xl font-light text-white">${kpiData[1].value.toLocaleString()}</h3>
              </div>
              <span className="text-6xl font-light text-white/20">$</span>
            </div>
          </div>
        </div>

        {/* Pound Wallet */}
        <div className="col-span-4">
          <div className="rounded bg-primary p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="text-sm text-white/70">Pound Wallet</h6>
                <h3 className="mt-1 text-3xl font-light text-white">${kpiData[2].value.toLocaleString()}</h3>
              </div>
              <span className="text-6xl font-light text-white/20">£</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Statistics + Notifications */}
      <div className="grid grid-cols-12 gap-6">
        {/* Statistics */}
        <div className="col-span-8">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Statistics</CardTitle>
              <DateRangeToggle value={dateRange} onChange={setDateRange} />
            </CardHeader>
            <CardContent>
              <ApexChart
                key={dateRange}
                type="area"
                height={330}
                options={statisticsOpts}
                series={activeSeries}
              />
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {notifications.map((n, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.dotColor}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {n.text}
                      </p>
                      <p className="text-xs text-muted-foreground">{n.time}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {n.amount}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 3: Market Overview + Portfolio */}
      <div className="grid grid-cols-12 gap-6">
        {/* Market Overview */}
        <div className="col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Pair
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Change
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        7D Chart
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Market Cap
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {marketPairs.map((row) => {
                      const isExpanded = expandedPair === row.pair;
                      const details = pairDetails[row.pair];
                      return (
                        <tr key={row.pair} className="group">
                          <td colSpan={5} className="p-0">
                            <table className="w-full">
                              <tbody>
                                <tr
                                  className="hover:bg-muted/40 transition-colors cursor-pointer"
                                  onClick={() => setExpandedPair(isExpanded ? null : row.pair)}
                                >
                                  <td className="px-6 py-3 font-semibold text-foreground w-[20%]">
                                    <span className="flex items-center gap-2">
                                      {row.pair}
                                      <motion.span
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex"
                                      >
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                      </motion.span>
                                    </span>
                                  </td>
                                  <td className="px-6 py-3 text-right text-foreground w-[20%]">
                                    {row.price}
                                  </td>
                                  <td className="px-6 py-3 text-right w-[20%]">
                                    <Badge
                                      variant={row.positive ? "default" : "destructive"}
                                      className={
                                        row.positive
                                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                                          : "bg-red-100 text-red-700 hover:bg-red-100"
                                      }
                                    >
                                      {row.change}
                                    </Badge>
                                  </td>
                                  <td className="px-6 py-3 w-[20%]">
                                    <div className="flex justify-center">
                                      <ApexChart
                                        type="line"
                                        width={80}
                                        height={35}
                                        options={makeSparkOpts(row.positive)}
                                        series={[{ data: row.sparkData }]}
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-3 text-right text-muted-foreground w-[20%]">
                                    {row.cap}
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan={5} className="p-0">
                                    <AnimatePresence initial={false}>
                                      {isExpanded && details && (
                                        <motion.div
                                          key={row.pair}
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.25, ease: "easeInOut" }}
                                          className="overflow-hidden"
                                        >
                                          <div className="px-6 py-4 bg-muted/30 border-t border-border">
                                            <div className="grid grid-cols-4 gap-4 mb-3">
                                              <div>
                                                <p className="text-xs text-muted-foreground">24h High</p>
                                                <p className="text-sm font-semibold text-green-600">{details.high24h}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs text-muted-foreground">24h Low</p>
                                                <p className="text-sm font-semibold text-red-600">{details.low24h}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs text-muted-foreground">24h Volume</p>
                                                <p className="text-sm font-semibold text-foreground">{details.volume24h}</p>
                                              </div>
                                              <div>
                                                <p className="text-xs text-muted-foreground">Market Cap</p>
                                                <p className="text-sm font-semibold text-foreground">{details.marketCap}</p>
                                              </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{details.description}</p>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                toast.info("Full chart coming soon");
                                              }}
                                              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                            >
                                              View Full Chart
                                            </button>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio */}
        <div className="col-span-4">
          <Card className="h-full">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Portfolio</CardTitle>
              <div className="text-end">
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <h3 className="text-2xl font-semibold text-foreground">${kpiData[3].value.toLocaleString()}</h3>
              </div>
            </CardHeader>
            <CardContent>
              <ApexChart
                type="area"
                height={280}
                options={portfolioOpts}
                series={portfolioSeries}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
