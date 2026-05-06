"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PasswordChangedContentProps {
  basePath: string;
}

export function PasswordChangedContent({ basePath }: PasswordChangedContentProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle2 className="h-16 w-16 text-green-500" />
      </motion.div>

      {/* Heading & description */}
      <div>
        <h4 className="text-xl font-medium text-foreground">
          Password Changed Successfully
        </h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Your password has been updated. You can now log in with your new password.
        </p>
      </div>

      {/* Back to login button */}
      <Link
        href={`${basePath}/login`}
        className="w-full rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 text-center block"
      >
        Back to Login
      </Link>

      {/* Countdown text */}
      <p className="text-sm text-muted-foreground">
        Redirecting to login in{" "}
        <span className="font-medium text-foreground">{countdown}</span> seconds...
      </p>
    </div>
  );
}
