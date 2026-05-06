import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | SwitchYard Capital",
  description: "Reset your SwitchYard Capital dashboard password",
};

export default function ForgotPasswordV1Page() {
  return (
    <AuthCardLayout title="Forgot Password" subtitle="No worries, we'll help you reset it" basePath="/auth/v1">
      <ForgotPasswordForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
