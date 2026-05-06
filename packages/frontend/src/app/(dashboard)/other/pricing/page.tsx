"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { cn } from "@dashboardpack/core/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingPeriod = "monthly" | "annual";

interface PlanFeature {
  label: string;
  included: boolean;
}

interface Plan {
  name: string;
  subtitle: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PlanFeature[];
  cta: string;
  highlighted?: boolean;
  onCta: () => void;
}

// ─── Plan data ────────────────────────────────────────────────────────────────

const plans: Plan[] = [
  {
    name: "Starter",
    subtitle: "For individuals",
    monthlyPrice: 9,
    annualPrice: 90,
    features: [
      { label: "5 Projects", included: true },
      { label: "10GB Storage", included: true },
      { label: "Basic Analytics", included: true },
      { label: "Email Support", included: true },
      { label: "Priority Support", included: false },
      { label: "Custom Domain", included: false },
      { label: "API Access", included: false },
      { label: "Team Members", included: false },
    ],
    cta: "Get Started",
    onCta: () => toast.info("Checkout coming soon"),
  },
  {
    name: "Professional",
    subtitle: "For growing teams",
    monthlyPrice: 29,
    annualPrice: 290,
    features: [
      { label: "Everything in Starter", included: true },
      { label: "Priority Support", included: true },
      { label: "Custom Domain", included: true },
      { label: "API Access", included: true },
      { label: "Up to 10 Team Members", included: true },
      { label: "Unlimited Team Members", included: false },
      { label: "Dedicated Account Manager", included: false },
    ],
    cta: "Get Started",
    highlighted: true,
    onCta: () => toast.info("Checkout coming soon"),
  },
  {
    name: "Enterprise",
    subtitle: "For large organizations",
    monthlyPrice: 99,
    annualPrice: 990,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited Team Members", included: true },
      { label: "Dedicated Account Manager", included: true },
      { label: "SLA", included: true },
      { label: "Custom Integrations", included: true },
    ],
    cta: "Contact Sales",
    onCta: () => toast.info("Sales team will contact you"),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <>
      <PageBreadcrumb
        title="Pricing"
        items={[{ label: "Other" }, { label: "Pricing" }]}
      />

      {/* Heading */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <p className="text-muted-foreground mt-2">
          Start free, upgrade when you&apos;re ready
        </p>

        {/* Monthly / Annual toggle */}
        <div className="inline-flex items-center gap-2 mt-4 bg-muted/30 border border-border rounded-lg p-1">
          <button
            onClick={() => setBilling("monthly")}
            className={cn(
              billing === "monthly"
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:bg-muted/50",
              "rounded px-4 py-1.5 text-sm font-medium transition-colors"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={cn(
              billing === "annual"
                ? "bg-primary text-white"
                : "border border-border text-muted-foreground hover:bg-muted/50",
              "rounded px-4 py-1.5 text-sm font-medium transition-colors"
            )}
          >
            Annual
          </button>
          {billing === "annual" && (
            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
              Save 17%
            </span>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              plan.highlighted && "border-primary border-2 shadow-lg relative"
            )}
          >
            {plan.highlighted && (
              <div className="absolute left-1/2 -translate-x-1/2 -top-0 transform -translate-y-1/2">
                <span className="bg-primary text-white text-xs rounded-full px-3 py-1 whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{plan.subtitle}</p>

              {/* Price */}
              <div className="flex items-end gap-1 mt-2">
                <span className="text-4xl font-bold">
                  ${billing === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                </span>
                <span className="text-muted-foreground mb-1">
                  {billing === "monthly" ? "/mo" : "/yr"}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* Feature list */}
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature.label} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground shrink-0" />
                    )}
                    <span
                      className={cn(
                        !feature.included && "text-muted-foreground line-through"
                      )}
                    >
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className="w-full mt-2"
                onClick={plan.onCta}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
