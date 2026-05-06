import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password V2 | SwitchYard Capital",
  description: "Choose a new password for your SwitchYard Capital account",
};

export default function ResetPasswordV2Page() {
  return (
    <AuthSplitLayout title="Reset Password" subtitle="Choose a strong password for your account" basePath="/auth/v2">
      <ResetPasswordForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
