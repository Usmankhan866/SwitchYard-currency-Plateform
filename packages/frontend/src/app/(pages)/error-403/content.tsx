"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@dashboardpack/core/components/ui/button";

export function Error403Content() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="mb-8">
        <ShieldAlert className="h-20 w-20 text-orange-500" />
      </div>

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Access Denied</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        You don&apos;t have permission to access this page. Contact your administrator if you
        believe this is a mistake.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => toast.info("Access request sent")}>Request Access</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/analytics">Back to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
