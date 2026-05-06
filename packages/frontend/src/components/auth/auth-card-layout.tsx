"use client";

import React from "react";

interface AuthCardLayoutProps {
  title: string;
  subtitle?: string;
  basePath: string;
  children: React.ReactNode;
}

export function AuthCardLayout({ title, subtitle, children }: AuthCardLayoutProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[10%] top-[15%] h-[300px] w-[300px] animate-pulse rounded-full bg-primary/5" />
        <span className="absolute right-[15%] top-[30%] h-[150px] w-[150px] animate-pulse rounded-full bg-primary/10 [animation-delay:1s]" />
        <span className="absolute bottom-[20%] left-[20%] h-[200px] w-[200px] animate-pulse rounded-full bg-primary/8 [animation-delay:2s]" />
        <span className="absolute bottom-[10%] right-[10%] h-[250px] w-[250px] animate-pulse rounded-full bg-primary/5 [animation-delay:0.5s]" />
      </div>
      <div className="relative z-10 w-full max-w-[440px] px-4">
        <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
          <div className="mb-6 flex justify-center">
            <img src="/images/logo-dark.svg" alt="SwitchYard Capital" className="h-[35px]" />
          </div>
          <h4 className="mb-1 text-center text-xl font-medium text-foreground">{title}</h4>
          {subtitle && <p className="mb-6 text-center text-sm text-muted-foreground">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
