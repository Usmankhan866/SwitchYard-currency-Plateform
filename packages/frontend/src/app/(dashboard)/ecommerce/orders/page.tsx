"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@dashboardpack/core/components/ui/dialog";
import { DataTable } from "@dashboardpack/core/components/shared/data-table";
import { mockOrders, type MockOrder } from "@/lib/mock-ecommerce";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(m, 10) - 1]} ${d}, ${y}`;
}

// ─── Status Badge ────────────────────────────────────────────────────────────

type OrderStatus = MockOrder["status"];

function StatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "Delivered":
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
          Delivered
        </Badge>
      );
    case "Shipped":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10">
          Shipped
        </Badge>
      );
    case "Processing":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10">
          Processing
        </Badge>
      );
  }
}

const ALL_STATUSES: OrderStatus[] = ["Delivered", "Shipped", "Processing"];

// ─── Order Detail Dialog ─────────────────────────────────────────────────────

interface OrderDetailDialogProps {
  order: MockOrder | null;
  onClose: () => void;
}

function OrderDetailDialog({ order, onClose }: OrderDetailDialogProps) {
  return (
    <Dialog open={order !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        {order && (
          <>
            <DialogHeader>
              <DialogTitle>Order {order.id}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status + Date */}
              <div className="flex items-center justify-between">
                <StatusBadge status={order.status} />
                <span className="text-sm text-muted-foreground">
                  {formatDate(order.date)}
                </span>
              </div>

              {/* Items list */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Items
                </p>
                <div className="rounded-lg border divide-y">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-3 py-2 text-sm"
                    >
                      <span className="text-foreground">
                        {item.name}{" "}
                        <span className="text-muted-foreground">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="font-medium text-foreground">
                        {formatAmount(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Shipping Address
                </p>
                <p className="text-sm text-foreground">{order.shippingAddress}</p>
              </div>

              {/* Payment */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Payment
                </p>
                <p className="text-sm text-foreground">
                  Visa ending in {order.paymentLast4}
                </p>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-bold text-foreground">
                  {formatAmount(order.total)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<MockOrder | null>(null);

  const columns = useMemo<ColumnDef<MockOrder>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order #",
        cell: ({ getValue }) => (
          <span className="font-mono text-sm font-medium text-foreground">
            {getValue<string>()}
          </span>
        ),
        meta: { mobileLabel: "Order #" },
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {formatDate(getValue<string>())}
          </span>
        ),
        meta: { mobileLabel: "Date" },
      },
      {
        id: "itemCount",
        header: "Items",
        accessorFn: (row) => row.items.length,
        cell: ({ getValue }) => (
          <span className="text-foreground">{getValue<number>()}</span>
        ),
        meta: { mobileLabel: "Items" },
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ getValue }) => (
          <span className="font-semibold text-foreground">
            {formatAmount(getValue<number>())}
          </span>
        ),
        meta: { mobileLabel: "Total" },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
        filterFn: (row, _id, filterValues: string[]) => {
          if (!filterValues?.length) return true;
          return filterValues.includes(row.original.status);
        },
        meta: { mobileLabel: "Status" },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            title="View order"
            className="flex h-7 w-7 items-center justify-center rounded border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrder(row.original);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
        ),
        enableSorting: false,
        enableGlobalFilter: false,
        meta: { mobileHidden: true },
      },
    ],
    []
  );

  return (
    <div>
      <PageBreadcrumb
        title="Order History"
        items={[{ label: "E-commerce" }, { label: "Orders" }]}
      />

      <Card>
        <CardHeader className="pb-3">
          <h5 className="text-base font-semibold text-foreground">Order History</h5>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockOrders}
            searchPlaceholder="Search orders..."
            facetedFilters={[
              {
                columnId: "status",
                title: "Status",
                options: ALL_STATUSES.map((s) => ({ label: s, value: s })),
              },
            ]}
            perPageOptions={[5, 10, 20]}
            exportFilename="orders"
          />
        </CardContent>
      </Card>

      <OrderDetailDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
