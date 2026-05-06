import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { TwoFactorForm } from "@/components/auth/two-factor-form";

export const metadata: Metadata = {
  title: "Two Factor V2 | SwitchYard Capital",
  description: "Verify your identity with two-factor authentication",
};

export default function TwoFactorV2Page() {
  return (
    <AuthSplitLayout title="Two-Factor Authentication" subtitle="Verify your identity" basePath="/auth/v2">
      <TwoFactorForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
