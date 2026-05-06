import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { PasswordChangedContent } from "@/components/auth/password-changed-content";

export const metadata: Metadata = {
  title: "Password Changed | SwitchYard Capital",
  description: "Your SwitchYard Capital account password has been changed",
};

export default function PasswordChangedV1Page() {
  return (
    <AuthCardLayout title="Password Changed" basePath="/auth/v1">
      <PasswordChangedContent basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
