"use client";

import React, { useState, useCallback } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

export interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const presets: { label: string; days: number | null }[] = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last year", days: 365 },
  { label: "All time", days: null },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromInputValue(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const handlePreset = useCallback(
    (days: number | null) => {
      const to = new Date();
      const from = days !== null ? daysAgo(days) : new Date(2020, 0, 1);
      onChange({ from, to });
      setOpen(false);
    },
    [onChange]
  );

  const handleFromChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const from = fromInputValue(e.target.value);
      if (from <= value.to) {
        onChange({ from, to: value.to });
      }
    },
    [onChange, value.to]
  );

  const handleToChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value) return;
      const to = fromInputValue(e.target.value);
      if (to >= value.from) {
        onChange({ from: value.from, to });
      }
    },
    [onChange, value.from]
  );

  const displayText = `${formatDate(value.from)} \u2013 ${formatDate(value.to)}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "justify-start gap-2 font-normal text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="size-4 shrink-0" />
          <span className="truncate">{displayText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Custom date inputs */}
        <div className="border-b border-border p-4">
          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Custom range
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-muted-foreground">
                From
              </label>
              <input
                type="date"
                value={toInputValue(value.from)}
                max={toInputValue(value.to)}
                onChange={handleFromChange}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>
            <span className="mt-4 text-xs text-muted-foreground">&ndash;</span>
            <div className="flex-1">
              <label className="mb-1 block text-[11px] text-muted-foreground">
                To
              </label>
              <input
                type="date"
                value={toInputValue(value.to)}
                min={toInputValue(value.from)}
                max={toInputValue(new Date())}
                onChange={handleToChange}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
              />
            </div>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-col gap-0.5 p-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset.days)}
              className="rounded-md px-3 py-1.5 text-start text-sm text-foreground transition-colors hover:bg-accent"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
