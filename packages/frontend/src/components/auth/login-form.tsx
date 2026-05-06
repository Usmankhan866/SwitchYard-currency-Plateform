"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { SocialButtons } from "@/components/auth/social-buttons";
import { AuthFooter } from "@/components/auth/auth-footer";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
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

interface LoginFormProps {
  basePath: string;
}

export function LoginForm({ basePath }: LoginFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  function onSubmit(_values: FormValues) {
    toast.success("Welcome back!");
  }

  return (
    <Form {...form}>
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

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className={labelClass}>Password</FormLabel>
                  <Link
                    href={`${basePath}/forgot-password`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <FormControl>
                  <PasswordField
                    id="password"
                    placeholder="Enter your password"
                    field={field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                  </FormControl>
                  <label htmlFor="rememberMe" className="text-sm text-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>
      </form>

      <SocialButtons />
      <AuthFooter variant="login" basePath={basePath} />
    </Form>
  );
}
