"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const ALERT_ITEMS = [
  { variant: "Primary", color: "#4680ff", borderClass: "border-primary", bgClass: "bg-primary/10", textClass: "text-primary" },
  { variant: "Success", color: "#2ca87f", borderClass: "border-[#2ca87f]", bgClass: "bg-[#2ca87f]/10", textClass: "text-[#2ca87f]" },
  { variant: "Danger", color: "#dc2626", borderClass: "border-[#dc2626]", bgClass: "bg-[#dc2626]/10", textClass: "text-[#dc2626]" },
  { variant: "Warning", color: "#e58a00", borderClass: "border-[#e58a00]", bgClass: "bg-[#e58a00]/10", textClass: "text-[#e58a00]" },
  { variant: "Info", color: "#3ebfea", borderClass: "border-[#3ebfea]", bgClass: "bg-[#3ebfea]/10", textClass: "text-[#3ebfea]" },
  { variant: "Secondary", color: "#5b6b79", borderClass: "border-[#5b6b79]", bgClass: "bg-[#5b6b79]/10", textClass: "text-[#5b6b79]" },
];

const TAB_CONTENT = [
  { label: "Tab 1", content: "Tab 1 content. Raw denim you probably haven\u2019t heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica." },
  { label: "Tab 2", content: "Tab 2 content. Food truck fixie locavore, accusamus mcsweeney\u2019s marfa nulla single-origin coffee squid. Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko." },
  { label: "Tab 3", content: "Tab 3 content. Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney\u2019s organic lomo retro fanny pack lo-fi farm-to-table readymade." },
];

const FAQ_ITEMS = [
  {
    question: "What is SwitchYard Capital?",
    answer: "SwitchYard Capital is a premium admin dashboard template built with Next.js, React, and Tailwind CSS.",
  },
  {
    question: "How do I customize the theme?",
    answer: "Use the Theme Customizer panel on the right side of the dashboard to change colors, layout, and more.",
  },
  {
    question: "Is dark mode supported?",
    answer: "Yes, SwitchYard Capital supports light, dark, and system-preferred color schemes out of the box.",
  },
  {
    question: "Can I use this with other frameworks?",
    answer: "The core design system is framework-agnostic. We provide Next.js and HTML implementations.",
  },
  {
    question: "How do I get support?",
    answer: "Visit our documentation or contact support through the DashboardPack website.",
  },
];

export default function ComponentsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());

  function dismissAlert(index: number) {
    setDismissedAlerts((prev) => new Set(prev).add(index));
    toast.info("Alert dismissed");
  }

  function handleButtonClick(variant: string) {
    toast(`${variant} button clicked`);
  }

  function toggleSingle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  function toggleMulti(index: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <>
      <PageBreadcrumb
        title="Components"
        items={[{ label: "Elements" }, { label: "Components" }]}
      />

      <div className="grid grid-cols-12 gap-6">

        {/* Card 1: Alerts */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <AnimatePresence>
                  {ALERT_ITEMS.map((alert, index) =>
                    !dismissedAlerts.has(index) ? (
                      <motion.div
                        key={alert.variant}
                        initial={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center justify-between border-l-[3px] ${alert.borderClass} ${alert.bgClass} px-4 py-3 text-sm ${alert.textClass}`}
                      >
                        <span>
                          <strong>{alert.variant}!</strong> This is a {alert.variant.toLowerCase()} alert — check it out.
                        </span>
                        <button
                          onClick={() => dismissAlert(index)}
                          className="ml-4 shrink-0 rounded p-0.5 hover:bg-black/10 transition-colors"
                          aria-label={`Dismiss ${alert.variant} alert`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ) : null
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 2: Badges */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Default</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary text-white border-transparent hover:bg-primary/80">Primary</Badge>
                    <Badge className="bg-[#2ca87f] text-white border-transparent hover:bg-[#2ca87f]/80">Success</Badge>
                    <Badge className="bg-[#dc2626] text-white border-transparent hover:bg-[#dc2626]/80">Danger</Badge>
                    <Badge className="bg-[#e58a00] text-white border-transparent hover:bg-[#e58a00]/80">Warning</Badge>
                    <Badge className="bg-[#3ebfea] text-white border-transparent hover:bg-[#3ebfea]/80">Info</Badge>
                    <Badge className="bg-[#1d2630] text-white border-transparent hover:bg-[#1d2630]/80">Dark</Badge>
                    <Badge className="bg-[#5b6b79] text-white border-transparent hover:bg-[#5b6b79]/80">Secondary</Badge>
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Pill</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full bg-primary text-white border-transparent hover:bg-primary/80">Primary</Badge>
                    <Badge className="rounded-full bg-[#2ca87f] text-white border-transparent hover:bg-[#2ca87f]/80">Success</Badge>
                    <Badge className="rounded-full bg-[#dc2626] text-white border-transparent hover:bg-[#dc2626]/80">Danger</Badge>
                    <Badge className="rounded-full bg-[#e58a00] text-white border-transparent hover:bg-[#e58a00]/80">Warning</Badge>
                    <Badge className="rounded-full bg-[#3ebfea] text-white border-transparent hover:bg-[#3ebfea]/80">Info</Badge>
                    <Badge className="rounded-full bg-[#1d2630] text-white border-transparent hover:bg-[#1d2630]/80">Dark</Badge>
                    <Badge className="rounded-full bg-[#5b6b79] text-white border-transparent hover:bg-[#5b6b79]/80">Secondary</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 3: Buttons */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Filled</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleButtonClick("Primary")} className="rounded px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors">Primary</button>
                    <button onClick={() => handleButtonClick("Success")} className="rounded px-4 py-2 text-sm font-medium bg-[#2ca87f] text-white hover:bg-[#2ca87f]/90 transition-colors">Success</button>
                    <button onClick={() => handleButtonClick("Danger")} className="rounded px-4 py-2 text-sm font-medium bg-[#dc2626] text-white hover:bg-[#dc2626]/90 transition-colors">Danger</button>
                    <button onClick={() => handleButtonClick("Warning")} className="rounded px-4 py-2 text-sm font-medium bg-[#e58a00] text-white hover:bg-[#e58a00]/90 transition-colors">Warning</button>
                    <button onClick={() => handleButtonClick("Info")} className="rounded px-4 py-2 text-sm font-medium bg-[#3ebfea] text-white hover:bg-[#3ebfea]/90 transition-colors">Info</button>
                    <button onClick={() => handleButtonClick("Dark")} className="rounded px-4 py-2 text-sm font-medium bg-[#1d2630] text-white hover:bg-[#1d2630]/90 transition-colors">Dark</button>
                    <button onClick={() => handleButtonClick("Secondary")} className="rounded px-4 py-2 text-sm font-medium bg-[#5b6b79] text-white hover:bg-[#5b6b79]/90 transition-colors">Secondary</button>
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Outline</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleButtonClick("Primary Outline")} className="rounded border px-4 py-2 text-sm font-medium border-primary text-primary bg-white hover:bg-primary/5 transition-colors">Primary</button>
                    <button onClick={() => handleButtonClick("Success Outline")} className="rounded border px-4 py-2 text-sm font-medium border-[#2ca87f] text-[#2ca87f] bg-white hover:bg-[#2ca87f]/5 transition-colors">Success</button>
                    <button onClick={() => handleButtonClick("Danger Outline")} className="rounded border px-4 py-2 text-sm font-medium border-[#dc2626] text-[#dc2626] bg-white hover:bg-[#dc2626]/5 transition-colors">Danger</button>
                    <button onClick={() => handleButtonClick("Warning Outline")} className="rounded border px-4 py-2 text-sm font-medium border-[#e58a00] text-[#e58a00] bg-white hover:bg-[#e58a00]/5 transition-colors">Warning</button>
                    <button onClick={() => handleButtonClick("Info Outline")} className="rounded border px-4 py-2 text-sm font-medium border-[#3ebfea] text-[#3ebfea] bg-white hover:bg-[#3ebfea]/5 transition-colors">Info</button>
                    <button onClick={() => handleButtonClick("Dark Outline")} className="rounded border px-4 py-2 text-sm font-medium border-[#1d2630] text-[#1d2630] bg-white hover:bg-[#1d2630]/5 transition-colors">Dark</button>
                    <button onClick={() => handleButtonClick("Secondary Outline")} className="rounded border px-4 py-2 text-sm font-medium border-[#5b6b79] text-[#5b6b79] bg-white hover:bg-[#5b6b79]/5 transition-colors">Secondary</button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 4: Cards */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Basic card */}
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                  <p className="mb-1 text-sm font-semibold text-foreground">Basic Card</p>
                  <p className="text-sm text-muted-foreground">
                    Some quick example text to build on the card title and make up the bulk of the card content.
                  </p>
                  <button className="mt-3 rounded px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors">
                    Go somewhere
                  </button>
                </div>
                {/* Card with header/footer */}
                <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                  <div className="border-b bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Featured
                  </div>
                  <div className="p-4">
                    <p className="mb-1 text-sm font-semibold text-foreground">Special title treatment</p>
                    <p className="text-sm text-muted-foreground">
                      With supporting text below as a natural lead-in to additional content.
                    </p>
                    <button className="mt-3 rounded px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors">
                      Go somewhere
                    </button>
                  </div>
                  <div className="border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                    2 days ago
                  </div>
                </div>
                {/* Colored card */}
                <div className="rounded-lg bg-primary p-4 shadow-sm text-white">
                  <p className="mb-1 text-sm font-semibold">Primary Card</p>
                  <p className="text-sm opacity-80">
                    Some quick example text on a colored card background with white text.
                  </p>
                  <button className="mt-3 rounded border border-white px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-colors">
                    Action
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 5: Progress Bars */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Progress Bars</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Primary</span>
                    <span>25%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: "25%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Success</span>
                    <span>50%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[#2ca87f]" style={{ width: "50%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Warning</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[#e58a00]" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Danger</span>
                    <span>100%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[#dc2626]" style={{ width: "100%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Striped (Info)</span>
                    <span>60%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#3ebfea]"
                      style={{
                        width: "60%",
                        backgroundImage:
                          "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 6: Tabs */}
        <div className="col-span-12">
          <Card>
            <CardHeader>
              <CardTitle>Tabs</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                {/* Tab nav */}
                <div className="flex border-b">
                  {TAB_CONTENT.map((tab, index) => (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(index)}
                      className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === index
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                      aria-selected={activeTab === index}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* Tab content */}
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{TAB_CONTENT[activeTab].label} content.</strong>{" "}
                    {TAB_CONTENT[activeTab].content.replace(`${TAB_CONTENT[activeTab].label} content. `, "")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 7: Basic Accordion (single open) */}
        <div className="col-span-12 md:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border rounded-md border">
                {FAQ_ITEMS.map((item, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div key={index}>
                      <button
                        onClick={() => toggleSingle(index)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card 8: Multi-open Accordion */}
        <div className="col-span-12 md:col-span-6">
          <Card>
            <CardHeader>
              <CardTitle>Accordion</CardTitle>
              <p className="text-sm text-muted-foreground">Multiple items can be open</p>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border rounded-md border">
                {FAQ_ITEMS.map((item, index) => {
                  const isOpen = openIndices.has(index);
                  return (
                    <div key={index}>
                      <button
                        onClick={() => toggleMulti(index)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                          >
                            <p className="px-4 pb-3 pt-1 text-sm text-muted-foreground">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </>
  );
}
