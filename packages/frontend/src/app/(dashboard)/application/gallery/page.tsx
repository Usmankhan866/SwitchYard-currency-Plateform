"use client";

import { useEffect, useCallback } from "react";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader } from "@dashboardpack/core/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@dashboardpack/core/components/ui/dialog";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  LayoutGrid,
  X,
} from "lucide-react";
import { useState } from "react";

const galleryItems = [
  {
    id: 1,
    title: "Dashboard Design",
    date: "Jan 15, 2026",
    size: "2.4 MB",
    from: "#4680ff",
    to: "#2563eb",
    category: "photos",
  },
  {
    id: 2,
    title: "Brand Assets",
    date: "Jan 18, 2026",
    size: "1.8 MB",
    from: "#1abc9c",
    to: "#16a085",
    category: "illustrations",
  },
  {
    id: 3,
    title: "Marketing Campaign",
    date: "Jan 20, 2026",
    size: "3.1 MB",
    from: "#e58a00",
    to: "#d97706",
    category: "photos",
  },
  {
    id: 4,
    title: "UI Components",
    date: "Jan 22, 2026",
    size: "0.9 MB",
    from: "#7c4dff",
    to: "#6d28d9",
    category: "illustrations",
  },
  {
    id: 5,
    title: "Product Photos",
    date: "Jan 24, 2026",
    size: "4.2 MB",
    from: "#dc2626",
    to: "#b91c1c",
    category: "photos",
  },
  {
    id: 6,
    title: "Team Photos",
    date: "Jan 25, 2026",
    size: "2.7 MB",
    from: "#3ebfea",
    to: "#0891b2",
    category: "photos",
  },
  {
    id: 7,
    title: "Event Coverage",
    date: "Jan 27, 2026",
    size: "5.6 MB",
    from: "#1abc9c",
    to: "#16a085",
    category: "videos",
  },
  {
    id: 8,
    title: "Office Space",
    date: "Jan 28, 2026",
    size: "1.3 MB",
    from: "#4680ff",
    to: "#2563eb",
    category: "photos",
  },
  {
    id: 9,
    title: "Social Media",
    date: "Jan 30, 2026",
    size: "0.7 MB",
    from: "#e58a00",
    to: "#d97706",
    category: "illustrations",
  },
];

type FilterType = "all" | "photos" | "videos" | "illustrations";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [gridSize, setGridSize] = useState<"small" | "large">("small");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Photos", value: "photos" },
    { label: "Videos", value: "videos" },
    { label: "Illustrations", value: "illustrations" },
  ];

  const filtered =
    activeFilter === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const currentItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
    );
  }, [filtered.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null
    );
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setLightboxIndex(null);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, goToPrev, goToNext]);

  return (
    <div>
      <PageBreadcrumb
        title="Gallery"
        items={[{ label: "Application" }, { label: "Gallery" }]}
      />

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <h5 className="text-base font-semibold text-foreground">Gallery</h5>
          <div className="flex items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center rounded-lg border bg-muted/30 p-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Grid size toggle */}
            <div className="flex items-center rounded-lg border bg-muted/30 p-1">
              <button
                onClick={() => setGridSize("small")}
                className={`rounded-md p-1.5 transition-colors ${
                  gridSize === "small"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setGridSize("large")}
                className={`rounded-md p-1.5 transition-colors ${
                  gridSize === "large"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className={`grid gap-4 ${
              gridSize === "small" ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {filtered.map((item, index) => (
              <div
                key={item.id}
                className="group relative cursor-pointer overflow-hidden rounded-lg aspect-video"
                style={{
                  background: `linear-gradient(to bottom right, ${item.from}, ${item.to})`,
                }}
                onClick={() => setLightboxIndex(index)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-white/30" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <h6 className="text-sm font-medium text-white">{item.title}</h6>
                  <p className="text-xs text-white/70">
                    {item.date} · {item.size}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1–{filtered.length} of 156 items
            </p>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded border text-muted-foreground hover:bg-muted/50 transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  className={`flex h-8 w-8 items-center justify-center rounded border text-sm transition-colors ${
                    page === 1
                      ? "bg-primary text-white border-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="flex h-8 w-8 items-center justify-center rounded border text-muted-foreground hover:bg-muted/50 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setLightboxIndex(null);
        }}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black border-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">
            {currentItem?.title ?? "Image Preview"}
          </DialogTitle>
          {currentItem && (
            <div className="relative">
              {/* Image area */}
              <div
                className="aspect-video w-full"
                style={{
                  background: `linear-gradient(to bottom right, ${currentItem.from}, ${currentItem.to})`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-24 w-24 text-white/20" />
                </div>
              </div>

              {/* Caption */}
              <div className="bg-black/80 px-6 py-4">
                <h6 className="text-sm font-medium text-white">{currentItem.title}</h6>
                <p className="text-xs text-white/60">
                  {currentItem.date} · {currentItem.size}
                </p>
              </div>

              {/* Prev / Next buttons */}
              <button
                onClick={goToPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Close button */}
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
                aria-label="Close lightbox"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Counter */}
              <div className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">
                {lightboxIndex !== null ? lightboxIndex + 1 : 0} / {filtered.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
