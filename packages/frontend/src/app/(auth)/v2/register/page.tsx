import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register V2 | SwitchYard Capital",
  description: "Create your SwitchYard Capital dashboard account",
};

export default function RegisterV2Page() {
  return (
    <AuthSplitLayout title="Create Account" subtitle="Start your journey with SwitchYard Capital" basePath="/auth/v2">
      <RegisterForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
