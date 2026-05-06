"use client";

import { useState } from "react";
import Link from "next/link";
import { HardHat } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";

const emailSchema = z.string().email();

const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PERCENT = 65;
const OFFSET = CIRCUMFERENCE - (PERCENT / 100) * CIRCUMFERENCE;

export function UnderConstructionContent() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleNotify() {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setEmail("");
    toast.success("You'll be the first to know!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="mb-8">
        <HardHat className="h-20 w-20 text-orange-500" />
      </div>

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Under Construction</h1>
      <p className="mb-10 max-w-md text-muted-foreground">
        We&apos;re building something new. Check back soon for updates.
      </p>

      {/* Circular progress */}
      <div className="relative mb-10 flex items-center justify-center">
        <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-primary/15"
          />
          {/* Animated progress arc */}
          <motion.circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            className="text-orange-500"
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: OFFSET }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{PERCENT}%</span>
          <span className="text-xs text-muted-foreground">Complete</span>
        </div>
      </div>

      {/* Notify Me */}
      <div className="mb-6 w-full max-w-sm">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleNotify()}
            className="flex-1"
          />
          <Button onClick={handleNotify}>Notify Me</Button>
        </div>
        {emailError && (
          <p className="mt-1.5 text-left text-xs text-destructive">{emailError}</p>
        )}
      </div>

      <Button variant="outline" asChild>
        <Link href="/dashboard/analytics">Back to Home</Link>
      </Button>
    </motion.div>
  );
}
