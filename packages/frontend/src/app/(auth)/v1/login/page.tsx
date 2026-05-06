import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | SwitchYard Capital",
  description: "Login to your SwitchYard Capital dashboard account",
};

export default function LoginV1Page() {
  return (
    <AuthCardLayout title="Login" subtitle="Welcome back! Please enter your credentials." basePath="/auth/v1">
      <LoginForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
