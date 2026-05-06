"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@dashboardpack/core/components/ui/button";

export function SessionExpiredContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="mb-8">
        <Clock className="h-20 w-20 text-orange-500" />
      </div>

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Session Expired</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Your session has expired due to inactivity. Please log in again to continue.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/auth/v1/login">Log In Again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/analytics">Back to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
