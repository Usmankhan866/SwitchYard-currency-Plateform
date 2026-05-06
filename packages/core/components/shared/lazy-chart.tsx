"use client";

import React, { useRef, useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

interface LazyChartProps {
  children: React.ReactNode;
  height?: number;
  className?: string;
}

/**
 * Renders children only when the container scrolls into the viewport.
 * Uses IntersectionObserver with a 200px rootMargin so charts start
 * loading slightly before they become visible.
 */
export function LazyChart({ children, height = 320, className }: LazyChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {inView ? children : <Skeleton className="w-full rounded-lg" style={{ height }} />}
    </div>
  );
}
