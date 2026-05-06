"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Shield, LayoutDashboard, Moon, Globe2, Palette, Table,
  PieChart, FormInput, FileText, Check, X, ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Button } from "@dashboardpack/core/components/ui/button";
import { cn } from "@dashboardpack/core/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type BillingPeriod = "monthly" | "annual";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Auth pages with 2FA, OTP, and lock screens",
  },
  {
    icon: LayoutDashboard,
    title: "9 Dashboard Variants",
    description: "Analytics, CRM, eCommerce, Finance, and more",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description: "Light, dark, and system-preferred themes",
  },
  {
    icon: Globe2,
    title: "RTL Support",
    description: "Full right-to-left layout with bidirectional text",
  },
  {
    icon: Palette,
    title: "10 Color Presets",
    description: "Ocean Blue, Royal Purple, Rose Pink, and more",
  },
  {
    icon: Table,
    title: "Advanced Data Tables",
    description: "Sort, filter, paginate, export with TanStack",
  },
  {
    icon: PieChart,
    title: "ApexCharts",
    description: "10 chart types with interactive legends",
  },
  {
    icon: FormInput,
    title: "Form Wizards",
    description: "Multi-step forms with validation and progress",
  },
  {
    icon: FileText,
    title: "Rich Text Editor",
    description: "Tiptap-based editor with full toolbar",
  },
];

const stats = [
  { value: 9, suffix: "+", label: "Dashboards" },
  { value: 60, suffix: "+", label: "Pages" },
  { value: 35, suffix: "+", label: "Components" },
  { value: 10, suffix: "", label: "Color Presets" },
];

const dashboardVariants = [
  { label: "Analytics", image: "/images/dashboard-analytics.png" },
  { label: "CRM", image: "/images/dashboard-crm.png" },
  { label: "eCommerce", image: "/images/dashboard-ecommerce.png" },
  { label: "Finance", image: "/images/dashboard-finance.png" },
  { label: "Crypto", image: "/images/dashboard-crypto.png" },
  { label: "Project", image: "/images/dashboard-project.png" },
  { label: "SaaS", image: "/images/dashboard-saas.png" },
  { label: "HR", image: "/images/dashboard-hr.png" },
  { label: "Marketing", image: "/images/dashboard-marketing.png" },
];

const techStack = [
  { name: "Next.js", logo: "/images/tech/nextjs.svg", invertDark: true, url: "https://nextjs.org" },
  { name: "React", logo: "/images/tech/react.svg", invertDark: false, url: "https://react.dev" },
  { name: "TypeScript", logo: "/images/tech/typescript.svg", invertDark: false, url: "https://www.typescriptlang.org" },
  { name: "Tailwind CSS", logo: "/images/tech/tailwindcss.svg", invertDark: false, url: "https://tailwindcss.com" },
  { name: "Radix UI", logo: "/images/tech/radixui.svg", invertDark: true, url: "https://www.radix-ui.com" },
  { name: "TanStack Table", logo: "/images/tech/tanstack.svg", invertDark: false, url: "https://tanstack.com/table" },
];

const testimonials = [
  {
    initials: "JD",
    color: "#4680ff",
    name: "John Doe",
    role: "Senior Developer",
    quote: "SwitchYard Capital saved us weeks of development time. The component library is incredibly well-thought-out and the documentation is thorough.",
  },
  {
    initials: "SK",
    color: "#2ca87f",
    name: "Sarah Kim",
    role: "Product Manager",
    quote: "The best admin template I've worked with. Clean design, great performance, and the dark mode works flawlessly out of the box.",
  },
  {
    initials: "MR",
    color: "#7c4dff",
    name: "Mike Ross",
    role: "CTO",
    quote: "We evaluated 20+ templates before choosing SwitchYard Capital. The RTL support and multi-theme system alone made it worth every penny.",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    subtitle: "For individuals",
    monthlyPrice: 9,
    annualPrice: 90,
    highlighted: false,
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
  },
  {
    name: "Professional",
    subtitle: "For growing teams",
    monthlyPrice: 29,
    annualPrice: 290,
    highlighted: true,
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
  },
  {
    name: "Enterprise",
    subtitle: "For large organizations",
    monthlyPrice: 99,
    annualPrice: 990,
    highlighted: false,
    features: [
      { label: "Everything in Pro", included: true },
      { label: "Unlimited Team Members", included: true },
      { label: "Dedicated Account Manager", included: true },
      { label: "SLA", included: true },
      { label: "Custom Integrations", included: true },
    ],
    cta: "Contact Sales",
  },
];

const faqs = [
  {
    question: "What frameworks are supported?",
    answer: "SwitchYard Capital ships with both a Next.js 15 (App Router) package and a plain HTML/Bootstrap implementation. A Vue version is on the roadmap.",
  },
  {
    question: "Is there a free version?",
    answer: "The Starter plan gives you access to a limited feature set at a very low price. There is no free tier, but you can explore the live preview before purchasing.",
  },
  {
    question: "How do I get updates?",
    answer: "All plans include free updates for one year from the purchase date. After that, a renewal extends your update window for another year.",
  },
  {
    question: "Can I use it for client projects?",
    answer: "Yes — the Professional and Enterprise plans include a multi-project license. You can build and deliver projects for clients without additional fees.",
  },
  {
    question: "Is TypeScript supported?",
    answer: "Absolutely. The Next.js package is 100% TypeScript with strict mode enabled. All components, hooks, and utilities are fully typed.",
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee. If you are not satisfied for any reason, contact support within 30 days of purchase for a full refund.",
  },
];

// ─── Stats Counter ─────────────────────────────────────────────────────────────

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 40;
          const increment = value / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold text-primary">
        {count}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

// ─── Dashboard Preview ───────────────────────────────────────────────────────

function DashboardPreview() {
  const [activeIndex, setActiveIndex] = useState(2); // default to eCommerce

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-lg border border-border">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={dashboardVariants[activeIndex].image}
                  alt={`SwitchYard Capital ${dashboardVariants[activeIndex].label} Dashboard`}
                  className="w-full h-auto rounded-lg"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2">
        {dashboardVariants.map((variant, i) => (
          <motion.button
            key={variant.label}
            onClick={() => setActiveIndex(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors relative",
              i === activeIndex
                ? "bg-primary text-white shadow-md"
                : "border border-border bg-background text-foreground hover:bg-muted/50"
            )}
          >
            {variant.label}
          </motion.button>
        ))}
      </div>
    </>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollToFeatures = () => {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Section 1: Hero ── */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <span className="absolute left-[10%] top-[15%] h-[350px] w-[350px] animate-pulse rounded-full bg-primary/5" />
          <span className="absolute right-[15%] top-[20%] h-[200px] w-[200px] animate-pulse rounded-full bg-primary/10 [animation-delay:1s]" />
          <span className="absolute bottom-[20%] left-[20%] h-[250px] w-[250px] animate-pulse rounded-full bg-primary/8 [animation-delay:2s]" />
          <span className="absolute bottom-[10%] right-[10%] h-[300px] w-[300px] animate-pulse rounded-full bg-primary/5 [animation-delay:0.5s]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              v3.4 — Next.js 15 + React 19
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              The Ultimate Admin
              <br />
              <span className="text-primary">Dashboard Template</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Built with Next.js 15 &amp; React 19. Ships with 9 dashboards, 60+ pages,
              dark mode, RTL support, and 10 color presets — ready to use on day one.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="min-w-[180px]">
                <Link href="/dashboard/analytics">View Dashboards</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="min-w-[180px]"
                onClick={scrollToFeatures}
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Section 2: Stats Counter ── */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <StatCounter {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Features Grid ── */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete toolkit for building professional admin panels, dashboards,
              and web applications — no extras required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex gap-4">
                    <div className="shrink-0 rounded-lg bg-primary/10 p-3 h-fit">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Dashboard Preview ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-3">Powerful Dashboards</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Nine purpose-built dashboard layouts covering every industry vertical,
              each with a unique data story and widget set.
            </p>
          </motion.div>

          {/* Interactive dashboard preview */}
          <DashboardPreview />
        </div>
      </section>

      {/* ── Section 5: Tech Stack ── */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-3">Built With Modern Tech</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10">
              Every dependency is carefully chosen for long-term stability,
              developer experience, and production performance.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, i) => (
              <motion.a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-5 py-3 shadow-sm hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
              >
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className={cn("h-6 w-6", tech.invertDark && "dark:invert")}
                />
                <span className="text-sm font-medium text-foreground">{tech.name}</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 6: Testimonials ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Loved by Developers</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Thousands of developers and teams ship with SwitchYard Capital every month.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground italic flex-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ backgroundColor: t.color }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: Pricing ── */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Start free, upgrade when you&apos;re ready. No hidden fees.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-2 bg-muted/30 border border-border rounded-lg p-1">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
              <Card
                className={cn(
                  "relative h-full",
                  plan.highlighted && "border-primary border-2 shadow-lg"
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
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature.label} className="flex items-center gap-2 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}
                        <span className={cn(!feature.included && "text-muted-foreground line-through")}>
                          {feature.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full mt-2"
                    onClick={() => toast.info("Checkout coming soon")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 8: FAQ ── */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-lg border border-border bg-background overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-sm hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.question}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      openFaq === i && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 text-sm text-muted-foreground border-t border-border pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 9: CTA Footer ── */}
      <section className="bg-primary py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
          <h2 className="text-3xl font-bold text-white mb-3">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of developers building with SwitchYard Capital
          </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90 min-w-[160px]"
              onClick={() => toast.info("Checkout coming soon")}
            >
              Get Started
            </Button>
            <button
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white bg-transparent px-6 text-sm font-medium text-white transition-all hover:bg-white/10 min-w-40"
              onClick={() => toast.info("Documentation coming soon")}
            >
              View Documentation
            </button>
          </div>

          <p className="text-white/60 text-sm">
            &copy; 2026 SwitchYard Capital. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}
