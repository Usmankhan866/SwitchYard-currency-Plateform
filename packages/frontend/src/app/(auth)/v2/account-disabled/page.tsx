import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { AccountDisabledContent } from "@/components/auth/account-disabled-content";

export const metadata: Metadata = {
  title: "Account Disabled V2 | SwitchYard Capital",
  description: "Your SwitchYard Capital account has been disabled",
};

export default function AccountDisabledV2Page() {
  return (
    <AuthSplitLayout title="Account Disabled" basePath="/auth/v2">
      <AccountDisabledContent basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
