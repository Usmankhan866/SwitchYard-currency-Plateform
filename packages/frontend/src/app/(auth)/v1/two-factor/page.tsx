import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { TwoFactorForm } from "@/components/auth/two-factor-form";

export const metadata: Metadata = {
  title: "Two-Factor Authentication | SwitchYard Capital",
  description: "Verify your identity with two-factor authentication",
};

export default function TwoFactorV1Page() {
  return (
    <AuthCardLayout title="Two-Factor Authentication" subtitle="Verify your identity" basePath="/auth/v1">
      <TwoFactorForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
