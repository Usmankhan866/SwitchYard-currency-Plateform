"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hourglass } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@dashboardpack/core/components/ui/button";

export function RateLimitedContent() {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function handleTryAgain() {
    if (seconds === 0) {
      toast.success("You can proceed now");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <Hourglass className="mb-6 h-20 w-20 text-destructive" />

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Too Many Requests</h1>
      <p className="mb-4 max-w-md text-muted-foreground">
        You&apos;ve made too many requests. Please wait before trying again.
      </p>

      {seconds > 0 && (
        <p className="mb-8 text-sm font-medium text-muted-foreground">
          Retry in {seconds}s
        </p>
      )}

      {seconds === 0 && <div className="mb-8" />}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleTryAgain} disabled={seconds > 0}>
          Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/analytics">Back to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
