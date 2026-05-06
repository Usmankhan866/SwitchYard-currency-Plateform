import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { LockScreenForm } from "@/components/auth/lock-screen-form";

export const metadata: Metadata = {
  title: "Lock Screen V2 | SwitchYard Capital",
  description: "Your SwitchYard Capital session is locked",
};

export default function LockScreenV2Page() {
  return (
    <AuthSplitLayout title="Lock Screen" basePath="/auth/v2">
      <LockScreenForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
