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

interface LockScreenFormProps {
  basePath: string;
}

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export function LockScreenForm({ basePath }: LockScreenFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(_values: FormValues) {
    form.reset();
    toast.success("Session unlocked!");
  }

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Avatar */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-semibold text-white"
        style={{ backgroundColor: "#4680ff" }}
      >
        SY
      </div>

      {/* User info */}
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">SwitchYard FX</p>
        <p className="text-xs text-muted-foreground">admin@switchyardfx.com.au</p>
      </div>

      {/* Info text */}
      <p className="text-center text-sm text-muted-foreground">
        Your session has been locked. Enter your password to continue.
      </p>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <input
                        {...field}
                        id="lock-password"
                        type={showPassword ? "text" : "password"}
                        className={inputClass + " pr-10"}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full rounded bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Unlock Session
            </button>
          </div>
        </form>
      </Form>

      {/* Not you link */}
      <Link
        href={`${basePath}/login`}
        className="text-sm text-primary hover:underline"
      >
        Not you?
      </Link>
    </div>
  );
}
