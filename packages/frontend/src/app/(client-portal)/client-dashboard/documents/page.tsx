"use client";

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
  FileText,
  Download,
  Eye,
  Search,
  Shield,
  Receipt,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Doc = {
  id: string;
  name: string;
  category: "Confirmation" | "Statement" | "Compliance" | "Product";
  size: string;
  date: string;
  tradeId?: string;
  new?: boolean;
};

const DOCUMENTS: Doc[] = [
  { id: "D001", name: "Trade Confirmation — TRD-0041 (TARF AUD/USD)",         category: "Confirmation", size: "124 KB", date: "14 Mar 2026", tradeId: "TRD-0041", new: true },
  { id: "D002", name: "Trade Confirmation — TRD-0038 (Knock-In Collar)",       category: "Confirmation", size: "118 KB", date: "02 Mar 2026", tradeId: "TRD-0038" },
  { id: "D003", name: "Trade Confirmation — TRD-0035 (Participating Forward)", category: "Confirmation", size: "110 KB", date: "18 Feb 2026", tradeId: "TRD-0035" },
  { id: "D004", name: "Monthly Portfolio Statement — April 2026",               category: "Statement",    size: "256 KB", date: "01 May 2026", new: true },
  { id: "D005", name: "Monthly Portfolio Statement — March 2026",               category: "Statement",    size: "241 KB", date: "01 Apr 2026" },
  { id: "D006", name: "Monthly Portfolio Statement — February 2026",            category: "Statement",    size: "238 KB", date: "01 Mar 2026" },
  { id: "D007", name: "Financial Services Guide (FSG)",                         category: "Compliance",   size: "892 KB", date: "01 Jan 2026" },
  { id: "D008", name: "Product Disclosure Statement — TARF",                    category: "Product",      size: "1.2 MB", date: "01 Jan 2026" },
  { id: "D009", name: "Product Disclosure Statement — Knock-In Collar",         category: "Product",      size: "1.1 MB", date: "01 Jan 2026" },
  { id: "D010", name: "Target Market Determination (TMD)",                      category: "Compliance",   size: "445 KB", date: "01 Jan 2026" },
];

const CATEGORY_ICON: Record<Doc["category"], React.ElementType> = {
  Confirmation: Receipt,
  Statement:    FileText,
  Compliance:   Shield,
  Product:      BookOpen,
};

const CATEGORY_COLOR: Record<Doc["category"], string> = {
  Confirmation: "bg-primary/10 text-primary",
  Statement:    "bg-chart-2/10 text-chart-2",
  Compliance:   "bg-success/10 text-success",
  Product:      "bg-chart-3/10 text-chart-3",
};

const BADGE_COLOR: Record<Doc["category"], string> = {
  Confirmation: "bg-primary/10 text-primary hover:bg-primary/10",
  Statement:    "bg-chart-2/10 text-chart-2 hover:bg-chart-2/10",
  Compliance:   "bg-success/10 text-success hover:bg-success/10",
  Product:      "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10",
};

type Category = Doc["category"] | "All";
const CATEGORIES: Category[] = ["All", "Confirmation", "Statement", "Compliance", "Product"];

export default function DocumentsPage() {
  const [filter, setFilter]   = useState<Category>("All");
  const [search, setSearch]   = useState("");

  const filtered = DOCUMENTS.filter((d) => {
    const matchCat  = filter === "All" || d.category === filter;
    const matchFind = d.name.toLowerCase().includes(search.toLowerCase()) || (d.tradeId ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchFind;
  });

  const newCount = DOCUMENTS.filter((d) => d.new).length;

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="My Documents"
        items={[{ label: "Client Portal" }, { label: "My Documents" }]}
      />

      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Documents</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Trade confirmations, statements, and compliance documents
          </p>
        </div>
        {newCount > 0 && (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 gap-1">
            <AlertCircle className="h-3 w-3" /> {newCount} new document{newCount > 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {CATEGORIES.slice(1).map((cat) => {
          const Icon = CATEGORY_ICON[cat as Doc["category"]];
          const count = DOCUMENTS.filter((d) => d.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-xl border p-4 text-left transition-colors ${filter === cat ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/30"}`}
            >
              <div className={`mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg ${CATEGORY_COLOR[cat as Doc["category"]]}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-foreground">{cat}s</p>
              <p className="text-xs text-muted-foreground">{count} file{count !== 1 ? "s" : ""}</p>
            </button>
          );
        })}
      </div>

      {/* Filter + search bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents or trade ID…"
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${filter === c ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <FileText className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm font-medium">No documents found</p>
                <p className="text-xs mt-1">Try changing your filter or search term</p>
              </div>
            ) : filtered.map((doc) => {
              const Icon = CATEGORY_ICON[doc.category];
              return (
                <div key={doc.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${CATEGORY_COLOR[doc.category]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                      {doc.new && (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 text-[10px]">New</Badge>
                      )}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-3">
                      <Badge className={`text-[10px] ${BADGE_COLOR[doc.category]}`}>{doc.category}</Badge>
                      <span className="text-xs text-muted-foreground">{doc.size}</span>
                      <span className="text-xs text-muted-foreground">{doc.date}</span>
                      {doc.tradeId && (
                        <span className="text-xs font-mono text-primary">{doc.tradeId}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => toast.info(`Previewing ${doc.name}`)}
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => toast.success(`Downloading ${doc.name}`)}
                    >
                      <Download className="mr-1 h-3.5 w-3.5" /> Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
