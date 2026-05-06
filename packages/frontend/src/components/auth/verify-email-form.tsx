"use client";

import Link from "next/link";
import { toast } from "sonner";
import { OtpForm } from "@/components/auth/otp-form";

interface VerifyEmailFormProps {
  basePath: string;
}

export function VerifyEmailForm({ basePath }: VerifyEmailFormProps) {
  function handleOtpComplete(_code: string) {
    toast.success("Email verified successfully!");
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        We sent a verification code to{" "}
        <span className="font-medium text-foreground">user@example.com</span>
      </p>

      <OtpForm onComplete={handleOtpComplete} />

      <div className="mt-6 text-center">
        <Link
          href={`${basePath}/register`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Use a different email
        </Link>
      </div>
    </>
  );
}
