import { Metadata } from "next";
import { AuthCardLayout } from "@/components/auth/auth-card-layout";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account | SwitchYard Capital",
  description: "Create your SwitchYard Capital dashboard account",
};

export default function RegisterV1Page() {
  return (
    <AuthCardLayout title="Create Account" subtitle="Start your journey with SwitchYard Capital" basePath="/auth/v1">
      <RegisterForm basePath="/auth/v1" />
    </AuthCardLayout>
  );
}
