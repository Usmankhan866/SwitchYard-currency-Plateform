import { Metadata } from "next";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login V2 | SwitchYard Capital",
  description: "Login to your SwitchYard Capital dashboard account",
};

export default function LoginV2Page() {
  return (
    <AuthSplitLayout title="Login" subtitle="Welcome back! Please enter your credentials." basePath="/auth/v2">
      <LoginForm basePath="/auth/v2" />
    </AuthSplitLayout>
  );
}
