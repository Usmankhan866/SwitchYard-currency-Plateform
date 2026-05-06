"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@dashboardpack/core/components/ui/button";

export function Error404Content() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      {/* Large 404 text with icon overlay */}
      <div className="relative mb-8 flex items-center justify-center">
        <span className="select-none text-8xl font-bold text-primary/20">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <FileQuestion className="h-24 w-24 text-primary/40" />
        </div>
      </div>

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Page Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/analytics">Back to Home</Link>
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </motion.div>
  );
}
