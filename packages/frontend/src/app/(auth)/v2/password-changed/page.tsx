import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { PasswordChangedContent } from "@/components/auth/password-changed-content";

export const metadata: Metadata = {
  title: "Password Changed V2 | SwitchYard Capital",
  description: "Your SwitchYard Capital account password has been changed",
};

export default function PasswordChangedV2Page() {
  return (
    <AuthSplitLayout title="Password Changed" basePath="/auth/v2">
      <PasswordChangedContent basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
