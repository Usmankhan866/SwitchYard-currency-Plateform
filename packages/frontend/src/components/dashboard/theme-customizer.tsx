"use client";

import React, { useState } from "react";
import { useTheme } from "@dashboardpack/core/providers/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@dashboardpack/core/components/ui/sheet";
import { Separator } from "@dashboardpack/core/components/ui/separator";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Label } from "@dashboardpack/core/components/ui/label";
import { Sun, Moon, Monitor, PanelLeft, PanelTop, Maximize, Minimize, AlignLeft, AlignRight, Globe } from "lucide-react";
import { useSidebar } from "@dashboardpack/core/providers/sidebar-context";
import type { LayoutMode, ContainerMode, DirectionMode } from "@dashboardpack/core/providers/sidebar-context";
import { cn } from "@dashboardpack/core/lib/utils";
import { useLocale } from "@dashboardpack/core/lib/i18n/locale-context";
import { locales } from "@dashboardpack/core/lib/i18n/config";
import type { Locale } from "@dashboardpack/core/lib/i18n/config";
import { useSwitchyard } from "./switchyard-provider";

/* ------------------------------------------------------------------ */
/*  Color presets                                                       */
/* ------------------------------------------------------------------ */

type ColorPresetKey =
  | "switchyard-teal"
  | "ocean-blue"
  | "royal-purple"
  | "rose-pink"
  | "crimson-red"
  | "vibrant-orange"
  | "golden-yellow"
  | "forest-green"
  | "aqua-cyan"
  | "dark"
  | "navy";

interface ColorPreset {
  key: ColorPresetKey;
  label: string;
  hex: string;
}

const COLOR_PRESETS: ColorPreset[] = [
  { key: "switchyard-teal", label: "SwitchYard Teal", hex: "#00897b" },
  { key: "ocean-blue",      label: "Ocean Blue",      hex: "#4680ff" },
  { key: "royal-purple",    label: "Royal Purple",    hex: "#7c4dff" },
  { key: "rose-pink",       label: "Rose Pink",       hex: "#e91e63" },
  { key: "crimson-red",     label: "Crimson Red",     hex: "#dc2626" },
  { key: "vibrant-orange",  label: "Vibrant Orange",  hex: "#ff9800" },
  { key: "golden-yellow",   label: "Golden Yellow",   hex: "#ffd54f" },
  { key: "forest-green",    label: "Forest Green",    hex: "#4caf50" },
  { key: "aqua-cyan",       label: "Aqua Cyan",       hex: "#00bcd4" },
  { key: "dark",            label: "Dark",            hex: "#212529" },
  { key: "navy",            label: "Navy",            hex: "#34495e" },
];

const COLOR_STORAGE_KEY = "switchyard-color-preset";

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function applyColorPreset(preset: ColorPreset) {
  const root = document.documentElement.style;
  const { r, g, b } = hexToRgb(preset.hex);

  // Core primary
  root.setProperty("--primary", preset.hex);
  root.setProperty("--primary-foreground", "#ffffff");
  root.setProperty("--ring", preset.hex);

  // Sidebar active color
  root.setProperty("--sidebar-primary", preset.hex);
  root.setProperty("--sidebar-primary-foreground", "#ffffff");
  root.setProperty("--sidebar-ring", preset.hex);

  // Charts
  root.setProperty("--chart-1", preset.hex);

  // Accent tints derived from preset
  root.setProperty("--accent", `rgba(${r}, ${g}, ${b}, 0.04)`);
}

/* ------------------------------------------------------------------ */
/*  Theme Customizer                                                   */
/* ------------------------------------------------------------------ */

interface ThemeCustomizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Layout options removed � only sidebar layout exists

const CONTAINER_OPTIONS: { value: ContainerMode; label: string; icon: React.ElementType }[] = [
  { value: "fluid", label: "Fluid", icon: Maximize },
  { value: "boxed", label: "Boxed", icon: Minimize },
];

const DIRECTION_OPTIONS: { value: DirectionMode; label: string; icon: React.ElementType }[] = [
  { value: "ltr", label: "LTR", icon: AlignLeft },
  { value: "rtl", label: "RTL", icon: AlignRight },
];

export function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme();
  const { collapsed, setCollapsed, container, setContainer, direction, setDirection } = useSidebar();
  const { locale, setLocale } = useLocale();
  const { sidebarTheme, setSidebarTheme, sidebarCaptions, setSidebarCaptions } = useSwitchyard();

  /* --- Color preset state --- */
  const [colorPreset, setColorPreset] = useState<ColorPresetKey>(() => {
    if (typeof window === "undefined") return "switchyard-teal";
    return (localStorage.getItem(COLOR_STORAGE_KEY) as ColorPresetKey) || "switchyard-teal";
  });

  function handleColorPreset(preset: ColorPreset) {
    setColorPreset(preset.key);
    localStorage.setItem(COLOR_STORAGE_KEY, preset.key);
    applyColorPreset(preset);
  }

  /* --- Reset --- */
  function handleReset() {
    setTheme("system");
    const defaultColor = COLOR_PRESETS[0]; // ocean-blue
    setColorPreset(defaultColor.key);
    localStorage.setItem(COLOR_STORAGE_KEY, defaultColor.key);
    applyColorPreset(defaultColor);
    setCollapsed(false);
    setContainer("fluid");
    setDirection("ltr");
    setSidebarTheme("dark");
    setSidebarCaptions("show");
    setLocale("en");
  }

  /* --- Theme options --- */
  const themes = [
    { value: "light" as const,  label: "Light",  icon: Sun },
    { value: "dark" as const,   label: "Dark",   icon: Moon },
    { value: "system" as const, label: "System", icon: Monitor },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Customize</SheetTitle>
          <SheetDescription>
            Personalize your dashboard experience.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 px-4">
          {/* ---- Theme ---- */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-3 gap-2">
              {themes.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      theme === t.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", theme === t.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", theme === t.value ? "text-primary" : "text-muted-foreground")}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Color ---- */}
          <div className="space-y-3">
            <Label>Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  onClick={() => handleColorPreset(preset)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                    colorPreset === preset.key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 rounded-full",
                      colorPreset === preset.key && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                    style={{ backgroundColor: preset.hex }}
                  />
                  <span className={cn("text-xs font-medium", colorPreset === preset.key ? "text-primary" : "text-muted-foreground")}>
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* ---- Sidebar Mode ---- */}
          <div className="space-y-3">
            <Label>Sidebar</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: false, label: "Expanded", icon: PanelLeft },
                { value: true, label: "Collapsed", icon: Minimize },
              ].map((opt) => {
                const Icon = opt.icon;
                const active = collapsed === opt.value;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setCollapsed(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", active ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Container ---- */}
          <div className="space-y-3">
            <Label>Container</Label>
            <div className="grid grid-cols-2 gap-2">
              {CONTAINER_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setContainer(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      container === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", container === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", container === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Direction ---- */}
          <div className="space-y-3">
            <Label>Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              {DIRECTION_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setDirection(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      direction === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", direction === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", direction === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Sidebar Theme ---- */}
          <div className="space-y-3">
            <Label>Sidebar Theme</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "dark" as const,  label: "Dark",  icon: Moon },
                { value: "light" as const, label: "Light", icon: Sun },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSidebarTheme(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                      sidebarTheme === opt.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", sidebarTheme === opt.value ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium", sidebarTheme === opt.value ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* ---- Sidebar Captions ---- */}
          <div className="space-y-3">
            <Label>Sidebar Captions</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "show" as const, label: "Show" },
                { value: "hide" as const, label: "Hide" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSidebarCaptions(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                    sidebarCaptions === opt.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <span className={cn("text-xs font-medium", sidebarCaptions === opt.value ? "text-primary" : "text-muted-foreground")}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* ---- Language ---- */}
          <div className="space-y-3">
            <Label>Language</Label>
            <div className="grid grid-cols-3 gap-2">
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setLocale(loc.code as Locale)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                    locale === loc.code
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <Globe className={cn("h-5 w-5", locale === loc.code ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs font-medium", locale === loc.code ? "text-primary" : "text-muted-foreground")}>
                    {loc.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" className="w-full" onClick={handleReset}>
            Reset to Defaults
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
