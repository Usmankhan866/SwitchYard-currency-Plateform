"use client";

import React from "react";
import Link from "next/link";

interface AuthFooterProps {
  basePath: string;
  variant: "login" | "register" | "back-to-login";
}

export function AuthFooter({ basePath, variant }: AuthFooterProps) {
  if (variant === "back-to-login") {
    return (
      <div className="mt-6 text-center">
        <Link
          href={`${basePath}/login`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  if (variant === "register") {
    return (
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Already have an account?</p>
        <Link
          href={`${basePath}/login`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Login
        </Link>
      </div>
    );
  }

  // login variant
  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm font-medium text-foreground">Don&apos;t have an account?</p>
      <Link
        href={`${basePath}/register`}
        className="text-sm font-medium text-primary hover:underline"
      >
        Create Account
      </Link>
    </div>
  );
}
