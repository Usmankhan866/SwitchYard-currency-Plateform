"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "../../lib/utils";
import { Input } from "./input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  disabled?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280", "#000000",
];

function ColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  disabled,
  className,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = React.useState(value);

  // Sync external value changes
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setInputValue(hex);
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      onChange(hex);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          data-slot="color-picker"
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span
            className="size-5 rounded-sm border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-xs uppercase">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 space-y-3" align="start">
        <HexColorPicker color={value} onChange={onChange} />
        <Input
          value={inputValue}
          onChange={handleInputChange}
          className="h-8 font-mono text-xs"
          placeholder="#000000"
          maxLength={7}
        />
        {presets.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  "size-6 rounded-sm border border-border transition-transform hover:scale-110",
                  value === preset && "ring-2 ring-ring ring-offset-1 ring-offset-background"
                )}
                style={{ backgroundColor: preset }}
                onClick={() => onChange(preset)}
                aria-label={`Select color ${preset}`}
              />
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { ColorPicker };
