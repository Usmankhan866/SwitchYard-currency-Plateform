import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | SwitchYard Capital",
  description: "Choose a new password for your SwitchYard Capital account",
};

export default function ResetPasswordV1Page() {
  return (
    <AuthCardLayout title="Reset Password" subtitle="Choose a strong password for your account" basePath="/auth/v1">
      <ResetPasswordForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
