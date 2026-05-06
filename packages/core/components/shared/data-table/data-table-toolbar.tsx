"use client";

import React from "react";
import { type Table } from "@tanstack/react-table";
import { Search, SlidersHorizontal, Download, X } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface FacetedFilterConfig {
  columnId: string;
  title: string;
  options?: { label: string; value: string }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchPlaceholder?: string;
  exportFilename?: string;
  facetedFilters?: FacetedFilterConfig[];
  bulkActions?: (selectedRows: TData[]) => React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = "Search...",
  exportFilename,
  facetedFilters,
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter ?? "";
  const selectedCount = Object.keys(table.getState().rowSelection).length;
  const isFiltered =
    table.getState().columnFilters.length > 0 || globalFilter.length > 0;

  const handleExport = () => {
    const visibleColumns = table
      .getAllLeafColumns()
      .filter(
        (col) =>
          col.getIsVisible() && col.id !== "select" && col.id !== "actions"
      );

    const header = visibleColumns
      .map((col) => {
        const headerValue = col.columnDef.header;
        return typeof headerValue === "string" ? headerValue : col.id;
      })
      .join(",");

    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns
        .map((col) => {
          const val = row.getValue(col.id);
          const str = val != null ? String(val) : "";
          return str.includes(",") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    );

    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportFilename || "export"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    // Dynamic import to avoid hard dependency on sonner
    import("sonner").then(({ toast }) => {
      toast.success(`Exported ${rows.length} rows to CSV`);
    }).catch(() => {
      // sonner not available, skip toast
    });
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        {/* Bulk actions bar */}
        {selectedCount > 0 && bulkActions ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            {bulkActions(
              table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original)
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              <X className="me-1 size-3.5" />
              Clear
            </Button>
          </div>
        ) : (
          <>
            {/* Search */}
            <div className="relative max-w-sm flex-1">
              <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
                className="ps-9"
              />
            </div>

            {/* Faceted filters */}
            {facetedFilters?.map((filter) => {
              const column = table.getColumn(filter.columnId);
              if (!column) return null;
              return (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              );
            })}

            {/* Reset filters */}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  table.resetColumnFilters();
                  table.setGlobalFilter("");
                }}
              >
                Reset
                <X className="ms-1 size-3.5" />
              </Button>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <SlidersHorizontal className="size-4" />
              <span className="hidden sm:inline">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter(
                (col) =>
                  col.getCanHide() &&
                  col.id !== "select" &&
                  col.id !== "actions"
              )
              .map((column) => {
                const headerValue = column.columnDef.header;
                const label =
                  typeof headerValue === "string"
                    ? headerValue
                    : column.id;
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Export */}
        {exportFilename && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-1.5"
          >
            <Download className="size-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}
      </div>
    </div>
  );
}
