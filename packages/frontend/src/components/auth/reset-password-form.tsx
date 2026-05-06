"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { PasswordStrengthMeter } from "@/components/dashboard/password-strength";
import { AuthFooter } from "@/components/auth/auth-footer";

const schema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

function PasswordField({
  id,
  placeholder,
  field,
}: {
  id: string;
  placeholder: string;
  field: React.InputHTMLAttributes<HTMLInputElement> & { value?: string };
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...field}
        id={id}
        type={show ? "text" : "password"}
        className={inputClass + " pr-10"}
        placeholder={placeholder}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

interface ResetPasswordFormProps {
  basePath: string;
}

export function ResetPasswordForm({ basePath }: ResetPasswordFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPasswordValue = form.watch("newPassword");

  function onSubmit(_values: FormValues) {
    form.reset();
    toast.success("Password has been reset");
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Choose a strong password for your account
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5">
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>New Password</FormLabel>
                  <FormControl>
                    <PasswordField
                      id="new-password"
                      placeholder="Enter new password"
                      field={field}
                    />
                  </FormControl>
                  <PasswordStrengthMeter password={newPasswordValue} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordField
                      id="confirm-password"
                      placeholder="Confirm new password"
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2 text-center">
              <button
                type="submit"
                className="rounded bg-primary px-8 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                Reset Password
              </button>
            </div>
          </div>
        </form>
      </Form>

      <AuthFooter variant="back-to-login" basePath={basePath} />
    </>
  );
}
