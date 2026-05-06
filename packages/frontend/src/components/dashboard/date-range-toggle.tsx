"use client";

import { cn } from "@dashboardpack/core/lib/utils";

type Range = "7d" | "30d" | "90d";

interface DateRangeToggleProps {
  value: Range;
  onChange: (range: Range) => void;
  className?: string;
}

const ranges: Range[] = ["7d", "30d", "90d"];

export function DateRangeToggle({ value, onChange, className }: DateRangeToggleProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {ranges.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium transition-colors",
            value === range
              ? "bg-primary text-white"
              : "border border-border text-muted-foreground hover:bg-muted/50"
          )}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
