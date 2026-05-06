"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OtpForm } from "@/components/auth/otp-form";

interface TwoFactorFormProps {
  basePath: string;
}

export function TwoFactorForm({ basePath: _basePath }: TwoFactorFormProps) {
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState("");

  function handleOtpComplete(_code: string) {
    toast.success("Authentication successful!");
  }

  function handleBackupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!backupCode.trim()) return;
    toast.success("Authentication successful!");
  }

  function handleTryAnotherMethod() {
    toast.info("Alternative methods coming soon");
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Enter the 6-digit code from your authenticator app
      </p>

      {useBackupCode ? (
        <form onSubmit={handleBackupSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="backup-code"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Backup Code
            </label>
            <input
              id="backup-code"
              type="text"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value)}
              placeholder="Enter backup code"
              className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="pt-2 text-center">
            <button
              type="submit"
              className="rounded bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Verify
            </button>
          </div>
        </form>
      ) : (
        <OtpForm onComplete={handleOtpComplete} />
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setUseBackupCode((v) => !v);
            setBackupCode("");
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          {useBackupCode ? "Use authenticator" : "Use backup code"}
        </button>
        <button
          type="button"
          onClick={handleTryAnotherMethod}
          className="text-sm text-muted-foreground hover:text-foreground hover:underline"
        >
          Try another method
        </button>
      </div>
    </>
  );
}
