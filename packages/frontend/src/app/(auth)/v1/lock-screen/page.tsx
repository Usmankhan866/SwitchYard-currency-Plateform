import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { LockScreenForm } from "@/components/auth/lock-screen-form";

export const metadata: Metadata = {
  title: "Lock Screen | SwitchYard Capital",
  description: "Your SwitchYard Capital session is locked",
};

export default function LockScreenV1Page() {
  return (
    <AuthCardLayout title="Lock Screen" basePath="/auth/v1">
      <LockScreenForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
