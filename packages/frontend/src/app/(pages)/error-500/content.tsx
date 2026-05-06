"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ServerCrash } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@dashboardpack/core/components/ui/button";

export function Error500Content() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="mb-8">
        <ServerCrash className="h-20 w-20 text-destructive" />
      </div>

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Internal Server Error</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        Something went wrong on our end. Our team has been notified and we&apos;re working on it.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => router.refresh()}>Try Again</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/analytics">Back to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
