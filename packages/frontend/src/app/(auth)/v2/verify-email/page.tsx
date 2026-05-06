import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email V2 | SwitchYard Capital",
  description: "Verify your SwitchYard Capital account email address",
};

export default function VerifyEmailV2Page() {
  return (
    <AuthSplitLayout title="Verify Email" subtitle="Check your inbox for a verification code" basePath="/auth/v2">
      <VerifyEmailForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
