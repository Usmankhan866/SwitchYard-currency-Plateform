import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email | SwitchYard Capital",
  description: "Verify your SwitchYard Capital account email address",
};

export default function VerifyEmailV1Page() {
  return (
    <AuthCardLayout title="Verify Email" subtitle="Check your inbox for a verification code" basePath="/auth/v1">
      <VerifyEmailForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
