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
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  AlertTriangle,
  CheckCircle2,
  Plus,
  CreditCard,
  Users,
  Trash2,
  Edit,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Payment = {
  id: string;
  description: string;
  pair: string;
  notional: number;
  dueDate: string;
  status: "Upcoming" | "Hedged" | "Unhedged";
  beneficiary: string;
  days: number;
};

const PAYMENTS: Payment[] = [
  { id: "PAY-011", description: "Supplier invoice — Shanghai textiles", pair: "AUD/CNH", notional:  85_000, dueDate: "15 May 2026", status: "Hedged",   beneficiary: "Yiwu Trading Co.",         days:  8 },
  { id: "PAY-012", description: "Office rent — London",                 pair: "AUD/GBP", notional:  45_000, dueDate: "22 May 2026", status: "Unhedged", beneficiary: "Berkeley Properties Ltd",   days: 15 },
  { id: "PAY-013", description: "Equipment purchase",                   pair: "AUD/USD", notional: 120_000, dueDate: "01 Jun 2026", status: "Unhedged", beneficiary: "TechEquip Inc.",            days: 25 },
  { id: "PAY-014", description: "Consultancy fees — Germany",           pair: "AUD/EUR", notional:  32_000, dueDate: "10 Jun 2026", status: "Hedged",   beneficiary: "München Consulting GmbH",  days: 34 },
  { id: "PAY-015", description: "Quarterly transfer to US operations",  pair: "AUD/USD", notional: 200_000, dueDate: "30 Jun 2026", status: "Upcoming", beneficiary: "US Operations LLC",        days: 54 },
];

type Beneficiary = { name: string; country: string; currency: string; flag: string; account: string };

const BENEFICIARIES: Beneficiary[] = [
  { name: "Yiwu Trading Co.",       country: "China",          currency: "CNH", flag: "🇨🇳", account: "CNH •••• 8821" },
  { name: "Berkeley Properties Ltd",country: "United Kingdom", currency: "GBP", flag: "🇬🇧", account: "GBP •••• 4432" },
  { name: "TechEquip Inc.",         country: "United States",  currency: "USD", flag: "🇺🇸", account: "USD •••• 7765" },
  { name: "München Consulting GmbH",country: "Germany",        currency: "EUR", flag: "🇩🇪", account: "EUR •••• 2290" },
  { name: "US Operations LLC",      country: "United States",  currency: "USD", flag: "🇺🇸", account: "USD •••• 3341" },
];

const totalNotional = PAYMENTS.reduce((s, p) => s + p.notional, 0);
const hedgedCount   = PAYMENTS.filter((p) => p.status === "Hedged").length;
const unhedgedList  = PAYMENTS.filter((p) => p.status === "Unhedged");

function payBadge(s: Payment["status"]) {
  if (s === "Hedged")   return "bg-success/10 text-success";
  if (s === "Unhedged") return "bg-destructive/10 text-destructive";
  return "bg-primary/10 text-primary";
}

function urgencyColor(days: number) {
  if (days <= 7)  return "text-destructive font-bold";
  if (days <= 14) return "text-warning font-semibold";
  return "text-muted-foreground";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PaymentsPage() {
  const [tab, setTab] = useState<"payments" | "beneficiaries">("payments");

  return (
    <div className="w-full min-w-0 space-y-6">
      <PageBreadcrumb
        title="My Payments"
        items={[{ label: "Client Portal" }, { label: "My Payments" }]}
      />

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payments & Beneficiaries</h1>
          <p className="mt-1 text-sm text-muted-foreground">Upcoming FX obligations and registered payment recipients</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {tab === "payments" ? "Add Payment" : "Add Beneficiary"}
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Obligations",   value: `AUD ${(totalNotional / 1000).toFixed(0)}K`, color: "text-foreground" },
          { label: "Fully Hedged",        value: `${hedgedCount} payments`,                   color: "text-success" },
          { label: "Unhedged / At Risk",  value: `${unhedgedList.length} payments`,            color: "text-destructive" },
          { label: "Beneficiaries",       value: `${BENEFICIARIES.length} saved`,              color: "text-foreground" },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Unhedged alert */}
      {unhedgedList.length > 0 && (
        <div className="flex flex-wrap items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground mb-0.5">
              {unhedgedList.length} payment{unhedgedList.length > 1 ? "s" : ""} are exposed to FX rate risk
            </p>
            <p className="text-xs text-muted-foreground">
              {unhedgedList.map((p) => `${p.pair} AUD ${p.notional.toLocaleString()} — due ${p.dueDate}`).join(" · ")}
            </p>
          </div>
          <Button size="sm" variant="destructive" className="shrink-0">Hedge Now</Button>
        </div>
      )}

      {/* Tab toggle */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {([
            { key: "payments",      label: "Payments",      icon: CreditCard },
            { key: "beneficiaries", label: "Beneficiaries", icon: Users },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${tab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
              {key === "payments" && (
                <Badge className="ml-1 bg-primary/10 text-primary hover:bg-primary/10 text-xs">{PAYMENTS.length}</Badge>
              )}
              {key === "beneficiaries" && (
                <Badge className="ml-1 bg-muted text-muted-foreground hover:bg-muted text-xs">{BENEFICIARIES.length}</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Payments tab */}
      {tab === "payments" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {["ID", "Description", "Beneficiary", "Pair", "Amount (AUD)", "Due Date", "Days", "Status", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {PAYMENTS.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-foreground max-w-[180px] truncate">{p.description}</p>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground max-w-[140px] truncate">{p.beneficiary}</td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{p.pair}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">AUD {p.notional.toLocaleString()}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-foreground">{p.dueDate}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm ${urgencyColor(p.days)}`}>{p.days}d</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {p.status === "Hedged" && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                          {p.status === "Unhedged" && <AlertTriangle className="h-3.5 w-3.5 text-destructive" />}
                          <Badge className={`text-xs ${payBadge(p.status)}`}>{p.status}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {p.status === "Unhedged" && (
                          <Button size="sm" className="h-7 text-xs">Hedge</Button>
                        )}
                        {p.status === "Upcoming" && (
                          <Button size="sm" variant="outline" className="h-7 text-xs">Review</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border bg-muted/30">
                    <td colSpan={4} className="px-4 py-3 font-bold text-foreground">Total</td>
                    <td className="px-4 py-3 font-bold text-foreground">AUD {totalNotional.toLocaleString()}</td>
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Beneficiaries tab */}
      {tab === "beneficiaries" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFICIARIES.map((b) => (
            <Card key={b.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted text-2xl">
                    {b.flag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{b.country}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Currency</p>
                        <p className="text-sm font-bold text-foreground">{b.currency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Account</p>
                        <p className="text-xs font-mono text-muted-foreground">{b.account}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-7">
                    <Edit className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-7 px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add new card */}
          <button className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-5 text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[140px]">
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">Add Beneficiary</span>
          </button>
        </div>
      )}
    </div>
  );
}
