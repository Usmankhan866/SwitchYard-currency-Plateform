"use client";

import React, { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@dashboardpack/core/components/ui/input-otp";

interface OtpFormProps {
  onComplete: (code: string) => void;
}

export function OtpForm({ onComplete }: OtpFormProps) {
  const [value, setValue] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  function handleChange(val: string) {
    setValue(val);
    if (val.length === 6) {
      onComplete(val);
    }
  }

  function handleResend() {
    if (cooldown > 0) return;
    setValue("");
    setCooldown(60);
    // Resend logic would go here
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={value}
          onChange={handleChange}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="text-center">
        {cooldown > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend code in{" "}
            <span className="font-medium text-foreground">{cooldown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-primary hover:underline"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
