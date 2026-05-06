"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@dashboardpack/core/components/ui/button";

export function OfflineContent() {
  function handleTryAgain() {
    if (typeof navigator !== "undefined" && navigator.onLine) {
      toast.success("You're back online!");
    } else {
      toast.error("Still offline. Check your connection.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <WifiOff className="mb-6 h-20 w-20 text-muted-foreground" />

      <h1 className="mb-3 text-2xl font-semibold text-foreground">You're Offline</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        It looks like you've lost your internet connection. Check your network and try again.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleTryAgain}>Try Again</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/analytics">Back to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
