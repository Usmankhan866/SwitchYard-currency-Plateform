"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { AlertTriangle, Calendar, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Fixing = {
  date: string;
  tradeId: string;
  product: string;
  pair: string;
  notional: number;
  rate: number;
  time: string;
};

const FIXINGS: Fixing[] = [
  { date: "2026-05-14", tradeId: "TRD-0041", product: "TARF",                 pair: "AUD/USD", notional: 20_833, rate: 0.6485, time: "3:00 PM Tokyo" },
  { date: "2026-05-16", tradeId: "TRD-0038", product: "Knock-In Collar",       pair: "AUD/EUR", notional: 20_833, rate: 0.5912, time: "3:00 PM Tokyo" },
  { date: "2026-05-21", tradeId: "TRD-0035", product: "Participating Forward", pair: "AUD/GBP", notional: 16_667, rate: 0.5041, time: "3:00 PM Tokyo" },
  { date: "2026-05-28", tradeId: "TRD-0041", product: "TARF",                 pair: "AUD/USD", notional: 20_833, rate: 0.6485, time: "3:00 PM Tokyo" },
  { date: "2026-05-30", tradeId: "TRD-0031", product: "Enhanced Forward",      pair: "AUD/CNH", notional: 16_667, rate: 4.721,  time: "3:00 PM Tokyo" },
  { date: "2026-06-04", tradeId: "TRD-0038", product: "Knock-In Collar",       pair: "AUD/EUR", notional: 20_833, rate: 0.5912, time: "3:00 PM Tokyo" },
  { date: "2026-06-07", tradeId: "TRD-0029", product: "Vanilla Forward",       pair: "AUD/JPY", notional: 20_000, rate: 98.45,  time: "3:00 PM Tokyo" },
  { date: "2026-06-11", tradeId: "TRD-0035", product: "Participating Forward", pair: "AUD/GBP", notional: 16_667, rate: 0.5041, time: "3:00 PM Tokyo" },
  { date: "2026-06-25", tradeId: "TRD-0041", product: "TARF",                 pair: "AUD/USD", notional: 20_833, rate: 0.6485, time: "3:00 PM Tokyo" },
];

const TODAY = "2026-05-07";
const daysTo = (d: string) =>
  Math.ceil((new Date(d).getTime() - new Date(TODAY).getTime()) / 86400000);

const byDate = FIXINGS.reduce<Record<string, Fixing[]>>((acc, f) => {
  (acc[f.date] = acc[f.date] ?? []).push(f);
  return acc;
}, {});

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ---------------------------------------------------------------------------
// Calendar grid
// ---------------------------------------------------------------------------

function MonthGrid({ year, monthIdx, label }: { year: number; monthIdx: number; label: string }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const days = new Date(year, monthIdx + 1, 0).getDate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <p key={d} className="pb-2 text-center text-[11px] font-semibold text-muted-foreground">{d}</p>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const dk = `${year}-${String(monthIdx + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const events = byDate[dk] ?? [];
            const isToday = dk === TODAY;
            const hasEvent = events.length > 0;
            const isHovered = hovered === dk;

            return (
              <div
                key={day}
                className={`relative min-h-[56px] cursor-default rounded-lg p-1 transition-colors
                  ${hasEvent ? "border border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer" : "hover:bg-muted/30"}
                  ${isToday ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""}
                `}
                onMouseEnter={() => hasEvent && setHovered(dk)}
                onMouseLeave={() => setHovered(null)}
              >
                <p className={`text-center text-xs font-semibold ${isToday ? "text-primary" : hasEvent ? "text-foreground" : "text-muted-foreground"}`}>
                  {day}
                </p>
                {events.slice(0, 2).map((e, ei) => (
                  <div
                    key={ei}
                    className="mt-0.5 truncate rounded px-1 py-0.5 text-[9px] font-bold text-primary-foreground bg-primary leading-tight"
                  >
                    {e.pair}
                  </div>
                ))}
                {events.length > 2 && (
                  <p className="text-center text-[9px] font-bold text-primary">+{events.length - 2}</p>
                )}

                {/* Tooltip */}
                {isHovered && events.length > 0 && (
                  <div className="absolute left-1/2 top-full z-50 mt-1 w-52 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 shadow-lg">
                    <p className="mb-2 text-xs font-bold text-foreground">{dk}</p>
                    {events.map((e, ei) => (
                      <div key={ei} className="mb-1.5 text-xs">
                        <p className="font-semibold text-foreground">{e.pair} · {e.product}</p>
                        <p className="text-muted-foreground">AUD {e.notional.toLocaleString()} @ {e.rate}</p>
                        <p className="text-muted-foreground">{e.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CalendarPage() {
  const upcomingCount = FIXINGS.filter((f) => daysTo(f.date) > 0).length;
  const urgentCount   = FIXINGS.filter((f) => daysTo(f.date) <= 7 && daysTo(f.date) > 0).length;

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageBreadcrumb
        title="Expiry Calendar"
        items={[{ label: "Client Portal" }, { label: "Expiry Calendar" }]}
      />

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Expiry Calendar</h1>
          <p className="mt-1 text-sm text-muted-foreground">All scheduled leg fixing dates — hover a date to see details</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-warning/10 text-warning hover:bg-warning/10">
            <AlertTriangle className="mr-1 h-3 w-3" /> {urgentCount} urgent (≤7 days)
          </Badge>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            <Calendar className="mr-1 h-3 w-3" /> {upcomingCount} upcoming
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Calendars */}
        <div className="space-y-5 lg:col-span-8">
          <MonthGrid year={2026} monthIdx={4} label="May 2026" />
          <MonthGrid year={2026} monthIdx={5} label="June 2026" />
        </div>

        {/* Fixings list */}
        <div className="lg:col-span-4">
          <Card className="sticky top-20">
            <CardHeader className="flex flex-wrap items-start justify-between gap-3 pb-3">
              <CardTitle className="text-base font-semibold">All Fixings</CardTitle>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">{FIXINGS.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {FIXINGS.map((f, i) => {
                const days = daysTo(f.date);
                const urgent = days <= 7;
                const [, m, d] = f.date.split("-");
                return (
                  <div key={i} className={`rounded-lg border p-3 ${urgent ? "border-warning/40 bg-warning/5" : "border-border bg-muted/20"}`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg text-center ${urgent ? "bg-warning text-warning-foreground" : "bg-primary/10 text-primary"}`}>
                        <span className="text-[11px] font-bold leading-none">{d}</span>
                        <span className="text-[9px] leading-none mt-0.5 opacity-80">{MONTH_NAMES[parseInt(m) - 1]?.toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-xs font-bold text-foreground">{f.pair}</p>
                          {urgent && <AlertTriangle className="h-3 w-3 text-warning" />}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{f.product}</p>
                        <p className="text-xs text-muted-foreground">{f.tradeId} · {f.time}</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">
                          AUD {f.notional.toLocaleString()} @ {f.rate}
                        </p>
                      </div>
                      <div className={`shrink-0 text-sm font-bold ${urgent ? "text-warning" : "text-muted-foreground"}`}>
                        {days}d
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
