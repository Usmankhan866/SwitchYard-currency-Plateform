"use client";

import React from "react";
import { Shield, Zap, BarChart3 } from "lucide-react";

interface AuthSplitLayoutProps {
  title: string;
  subtitle?: string;
  basePath: string;
  children: React.ReactNode;
}

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and two-factor authentication keep your data safe.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Optimized performance with real-time updates and instant data access.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description: "Deep insights and customizable dashboards to drive better decisions.",
  },
];

export function AuthSplitLayout({ title, subtitle, children }: AuthSplitLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left branded panel */}
      <div className="relative flex h-[60px] w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 lg:h-auto lg:w-[40%] lg:items-start lg:justify-start lg:py-16 lg:px-12">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-[-10%] top-[-10%] h-[300px] w-[300px] rounded-full bg-white/5" />
          <span className="absolute right-[-5%] bottom-[-5%] h-[250px] w-[250px] rounded-full bg-white/5" />
        </div>

        {/* Logo always visible */}
        <div className="relative z-10 flex lg:block">
          <img
            src="/images/logo-dark.svg"
            alt="SwitchYard Capital"
            className="h-[35px] brightness-0 invert"
          />
        </div>

        {/* Tagline and features — hidden on mobile */}
        <div className="relative z-10 mt-12 hidden lg:block">
          <h2 className="text-3xl font-bold text-white">
            Your all-in-one admin dashboard
          </h2>
          <p className="mt-3 text-base text-white/70">
            Manage your business with clarity, speed, and confidence.
          </p>

          <ul className="mt-10 space-y-6">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{title}</p>
                  <p className="mt-0.5 text-sm text-white/70">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-background px-4 py-12 lg:px-12">
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute right-[10%] top-[10%] h-[200px] w-[200px] animate-pulse rounded-full bg-primary/5" />
          <span className="absolute bottom-[15%] left-[5%] h-[150px] w-[150px] animate-pulse rounded-full bg-primary/5 [animation-delay:1s]" />
        </div>

        <div className="relative z-10 w-full max-w-[440px]">
          <div className="rounded-lg border border-border bg-card p-8 shadow-lg">
            <h4 className="mb-1 text-center text-xl font-medium text-foreground">{title}</h4>
            {subtitle && (
              <p className="mb-6 text-center text-sm text-muted-foreground">{subtitle}</p>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
