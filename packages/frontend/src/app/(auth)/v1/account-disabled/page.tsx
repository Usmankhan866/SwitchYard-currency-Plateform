import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { AccountDisabledContent } from "@/components/auth/account-disabled-content";

export const metadata: Metadata = {
  title: "Account Disabled | SwitchYard Capital",
  description: "Your SwitchYard Capital account has been disabled",
};

export default function AccountDisabledV1Page() {
  return (
    <AuthCardLayout title="Account Disabled" basePath="/auth/v1">
      <AccountDisabledContent basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
