"use client";

import { ShieldX } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AccountDisabledContentProps {
  basePath: string;
}

export function AccountDisabledContent({ basePath }: AccountDisabledContentProps) {
  function handleContactSupport() {
    toast.info("Support ticket created");
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      {/* Icon */}
      <ShieldX className="h-16 w-16 text-destructive" />

      {/* Heading */}
      <div>
        <h4 className="text-xl font-medium text-foreground">Account Disabled</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account has been disabled. Please contact support for assistance.
        </p>
      </div>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3">
        <button
          type="button"
          onClick={handleContactSupport}
          className="w-full rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Contact Support
        </button>
        <Link
          href={`${basePath}/login`}
          className="text-sm text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
