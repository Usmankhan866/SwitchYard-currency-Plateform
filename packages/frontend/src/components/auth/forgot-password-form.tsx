"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { AuthFooter } from "@/components/auth/auth-footer";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

interface ForgotPasswordFormProps {
  basePath: string;
}

export function ForgotPasswordForm({ basePath }: ForgotPasswordFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(_values: FormValues) {
    toast.success("Password reset link sent to your email");
  }

  return (
    <Form {...form}>
      <p className="mb-5 text-sm text-muted-foreground">
        Enter your email address and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-5">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Email</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    id="email"
                    type="email"
                    className={inputClass}
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Send Reset Link
          </button>
        </div>
      </form>

      <AuthFooter variant="back-to-login" basePath={basePath} />
    </Form>
  );
}
