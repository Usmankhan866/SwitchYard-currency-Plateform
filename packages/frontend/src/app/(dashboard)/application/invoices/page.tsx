"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@dashboardpack/core/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@dashboardpack/core/components/ui/dropdown-menu";
import { DataTable } from "@dashboardpack/core/components/shared/data-table";
import { DataTableColumnHeader } from "@dashboardpack/core/components/shared/data-table";
import { ConfirmDialog } from "@dashboardpack/core/components/shared/confirm-dialog";

import {
  mockInvoices,
  nextInvoiceId,
  getInitials,
  randomAvatarColor,
  type MockInvoice,
  type InvoiceStatus,
} from "@/lib/mock-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m, 10) - 1]} ${d}, ${y}`;
}

// ─── Status Badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InvoiceStatus }) {
  switch (status) {
    case "Paid":
      return <Badge variant="success">Paid</Badge>;
    case "Pending":
      return <Badge variant="warning">Pending</Badge>;
    case "Overdue":
      return <Badge variant="destructive">Overdue</Badge>;
    case "On Hold":
      return <Badge variant="default">On Hold</Badge>;
  }
}

const ALL_STATUSES: InvoiceStatus[] = ["Paid", "Pending", "Overdue", "On Hold"];

// ─── Zod schema ─────────────────────────────────────────────────────────────

const invoiceSchema = z
  .object({
    client: z.string().min(1, "Client name is required"),
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Must be a positive number"),
    status: z.enum(["Paid", "Pending", "Overdue", "On Hold"]),
    issueDate: z.string().min(1, "Issue date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    notes: z.string().optional(),
  })
  .refine((data) => data.dueDate >= data.issueDate, {
    message: "Due date must be on or after issue date",
    path: ["dueDate"],
  });

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// ─── Invoice Form Dialog ─────────────────────────────────────────────────────

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  invoice?: MockInvoice;
  onSubmit: (values: InvoiceFormValues) => void;
}

function InvoiceFormDialog({
  open,
  onOpenChange,
  mode,
  invoice,
  onSubmit,
}: InvoiceFormDialogProps) {
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      client: invoice?.client ?? "",
      amount: invoice ? String(invoice.amount) : "",
      status: invoice?.status ?? "Pending",
      issueDate: invoice?.issueDate ?? "",
      dueDate: invoice?.dueDate ?? "",
      notes: invoice?.notes ?? "",
    },
  });

  // Reset form when dialog opens/closes or invoice changes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset({
        client: invoice?.client ?? "",
        amount: invoice ? String(invoice.amount) : "",
        status: invoice?.status ?? "Pending",
        issueDate: invoice?.issueDate ?? "",
        dueDate: invoice?.dueDate ?? "",
        notes: invoice?.notes ?? "",
      });
    }
    onOpenChange(open);
  };

  const handleSubmit = (values: InvoiceFormValues) => {
    onSubmit(values);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create Invoice" : "Edit Invoice"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Client Name */}
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Sarah Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 1500" min="0.01" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue Date */}
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Additional notes..."
                      className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "create" ? "Create Invoice" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Invoice Preview Dialog ──────────────────────────────────────────────────

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: MockInvoice | null;
  onEdit: () => void;
}

function InvoicePreviewDialog({
  open,
  onOpenChange,
  invoice,
  onEdit,
}: InvoicePreviewDialogProps) {
  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="rounded-lg border bg-white p-5 space-y-4 text-slate-900">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">INVOICE</p>
              <p className="font-mono text-xl font-bold text-slate-900 mt-1">{invoice.id}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Issued: {formatDate(invoice.issueDate)}
              </p>
              <p className="text-xs text-slate-500">
                Due: {formatDate(invoice.dueDate)}
              </p>
            </div>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Bill To
            </p>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: invoice.color }}
              >
                {invoice.initials}
              </div>
              <span className="font-medium text-slate-900">{invoice.client}</span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
              Total Due
            </p>
            <p className="text-2xl font-bold text-slate-900">{formatAmount(invoice.amount)}</p>
          </div>

          {invoice.notes && (
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
                Notes
              </p>
              <p className="text-sm text-slate-600">{invoice.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

type DialogMode = "create" | "edit" | "view" | null;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<MockInvoice[]>(mockInvoices);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<MockInvoice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<MockInvoice | null>(null);

  // ── Live sidebar stats ──────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + inv.amount, 0);
    const pending = invoices.filter((inv) => inv.status === "Pending").reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = invoices.filter((inv) => inv.status === "Overdue").reduce((sum, inv) => sum + inv.amount, 0);
    const onHold = invoices.filter((inv) => inv.status === "On Hold").reduce((sum, inv) => sum + inv.amount, 0);

    const countTotal = invoices.length || 1;
    const paidCount = invoices.filter((inv) => inv.status === "Paid").length;
    const pendingCount = invoices.filter((inv) => inv.status === "Pending").length;
    const overdueCount = invoices.filter((inv) => inv.status === "Overdue").length;
    const onHoldCount = invoices.filter((inv) => inv.status === "On Hold").length;

    return {
      total,
      paid,
      pending,
      overdue,
      onHold,
      paidPct: Math.round((paidCount / countTotal) * 100),
      pendingPct: Math.round((pendingCount / countTotal) * 100),
      overdueOrOnHoldPct: Math.round(((overdueCount + onHoldCount) / countTotal) * 100),
      canceledPct: 0,
    };
  }, [invoices]);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const handleCreate = (values: InvoiceFormValues) => {
    const newId = nextInvoiceId(invoices);
    const newInvoice: MockInvoice = {
      id: newId,
      client: values.client,
      initials: getInitials(values.client),
      color: randomAvatarColor(),
      amount: Number(values.amount),
      status: values.status,
      issueDate: values.issueDate,
      dueDate: values.dueDate,
      notes: values.notes ?? "",
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    toast.success(`Invoice ${newId} created`);
  };

  const handleEdit = (values: InvoiceFormValues) => {
    if (!selectedInvoice) return;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              client: values.client,
              initials: getInitials(values.client),
              amount: Number(values.amount),
              status: values.status,
              issueDate: values.issueDate,
              dueDate: values.dueDate,
              notes: values.notes ?? "",
            }
          : inv
      )
    );
    toast.success(`Invoice ${selectedInvoice.id} updated`);
    setSelectedInvoice(null);
  };

  const handleDelete = () => {
    if (!deleteConfirm) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== deleteConfirm.id));
    toast.success(`Invoice ${deleteConfirm.id} deleted`);
    setDeleteConfirm(null);
  };

  const handleStatusChange = (invoice: MockInvoice, newStatus: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoice.id ? { ...inv, status: newStatus } : inv))
    );
    toast.success(`${invoice.id} marked as ${newStatus}`);
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<MockInvoice>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-input"
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            className="rounded border-input"
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableGlobalFilter: false,
        size: 40,
        meta: { mobileHidden: true },
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Invoice #" />
        ),
        cell: ({ getValue }) => (
          <span className="font-mono text-sm font-medium text-foreground">
            {getValue<string>()}
          </span>
        ),
        enableSorting: true,
        meta: { mobileLabel: "Invoice #" },
      },
      {
        accessorKey: "client",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Client" />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: row.original.color }}
            >
              {row.original.initials}
            </div>
            <span className="font-medium text-foreground">{row.original.client}</span>
          </div>
        ),
        meta: { mobileLabel: "Client" },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" className="justify-end" />
        ),
        cell: ({ getValue }) => (
          <span className="text-right font-semibold text-foreground block">
            {formatAmount(getValue<number>())}
          </span>
        ),
        enableSorting: true,
        meta: { className: "text-right", mobileLabel: "Amount" },
      },
      {
        accessorKey: "issueDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Issue Date" />
        ),
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue<string>())}</span>
        ),
        enableSorting: true,
        meta: { mobileLabel: "Issue Date" },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Due Date" />
        ),
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue<string>())}</span>
        ),
        enableSorting: true,
        meta: { mobileLabel: "Due Date" },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
                  title="Click to change status"
                >
                  <StatusBadge status={invoice.status} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {ALL_STATUSES.map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (s !== invoice.status) {
                        handleStatusChange(invoice, s);
                      }
                    }}
                    className={invoice.status === s ? "font-semibold" : ""}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        filterFn: (row, _id, filterValues: string[]) => {
          if (!filterValues?.length) return true;
          return filterValues.includes(row.original.status);
        },
        meta: { mobileLabel: "Status" },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const invoice = row.original;
          return (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                title="View"
                className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setDialogMode("view");
                }}
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                title="Edit"
                className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-[#2ca87f] hover:text-[#2ca87f] transition-colors"
                onClick={() => {
                  setSelectedInvoice(invoice);
                  setDialogMode("edit");
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                title="Delete"
                className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"
                onClick={() => setDeleteConfirm(invoice)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
        enableSorting: false,
        enableGlobalFilter: false,
        meta: { mobileHidden: true },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invoices]
  );

  return (
    <div>
      <PageBreadcrumb
        title="Invoices"
        items={[{ label: "Application" }, { label: "Invoices" }]}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left sidebar ───────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-3">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Quick Stats */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Quick Stats
                </p>
                <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold text-foreground">
                      {formatAmount(stats.total)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-semibold text-[#2ca87f]">
                      {formatAmount(stats.paid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-semibold text-primary">
                      {formatAmount(stats.pending)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm border-t pt-2">
                    <span className="text-muted-foreground">Overdue</span>
                    <span className="font-semibold text-[#dc2626]">
                      {formatAmount(stats.overdue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">On Hold</span>
                    <span className="font-semibold text-[#e58a00]">
                      {formatAmount(stats.onHold)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  By Status
                </p>
                <div className="space-y-3">
                  {/* Paid */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Paid</span>
                      <span className="text-muted-foreground">{stats.paidPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#2ca87f] transition-all duration-300"
                        style={{ width: `${stats.paidPct}%` }}
                      />
                    </div>
                  </div>
                  {/* Pending */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Pending</span>
                      <span className="text-muted-foreground">{stats.pendingPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${stats.pendingPct}%` }}
                      />
                    </div>
                  </div>
                  {/* Overdue + On Hold */}
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Overdue / On Hold</span>
                      <span className="text-muted-foreground">{stats.overdueOrOnHoldPct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[#dc2626] transition-all duration-300"
                        style={{ width: `${stats.overdueOrOnHoldPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Main content ────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-9">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <h5 className="text-base font-semibold text-foreground">Invoice List</h5>
              <Button
                onClick={() => {
                  setSelectedInvoice(null);
                  setDialogMode("create");
                }}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={invoices}
                searchPlaceholder="Search invoices..."
                enableRowSelection
                exportFilename="invoices"
                facetedFilters={[
                  {
                    columnId: "status",
                    title: "Status",
                    options: ALL_STATUSES.map((s) => ({ label: s, value: s })),
                  },
                ]}
                perPageOptions={[10, 20, 50]}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Create / Edit Dialog ────────────────────────────────────────── */}
      <InvoiceFormDialog
        open={dialogMode === "create" || dialogMode === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null);
            setSelectedInvoice(null);
          }
        }}
        mode={dialogMode ?? "create"}
        invoice={dialogMode === "edit" ? (selectedInvoice ?? undefined) : undefined}
        onSubmit={dialogMode === "create" ? handleCreate : handleEdit}
      />

      {/* ── Preview Dialog ───────────────────────────────────────────────── */}
      <InvoicePreviewDialog
        open={dialogMode === "view"}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null);
            setSelectedInvoice(null);
          }
        }}
        invoice={selectedInvoice}
        onEdit={() => setDialogMode("edit")}
      />

      {/* ── Delete Confirm ───────────────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}
        title="Delete Invoice"
        description={
          deleteConfirm
            ? `Delete ${deleteConfirm.id} (${formatAmount(deleteConfirm.amount)}) for ${deleteConfirm.client}? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
