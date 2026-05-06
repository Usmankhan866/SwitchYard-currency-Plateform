import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password V2 | SwitchYard Capital",
  description: "Reset your SwitchYard Capital dashboard password",
};

export default function ForgotPasswordV2Page() {
  return (
    <AuthSplitLayout title="Forgot Password" subtitle="No worries, we'll help you reset it" basePath="/auth/v2">
      <ForgotPasswordForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
