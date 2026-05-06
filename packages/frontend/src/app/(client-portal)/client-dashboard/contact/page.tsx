"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Phone,
  MessageSquare,
  Mail,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Video,
} from "lucide-react";
import { toast } from "sonner";

const ADVISOR = {
  name: "Hannah Mitchell",
  initials: "HM",
  title: "Senior FX Advisor",
  phone: "+61 2 9000 1234",
  email: "hannah.mitchell@switchyardcapital.com.au",
  availability: "Mon–Fri, 8:00 AM – 6:00 PM AEST",
};

const RECENT = [
  { type: "Call",    summary: "Discussed TARF roll strategy for AUD/USD TRD-0041", date: "02 May 2026" },
  { type: "Email",   summary: "Sent updated pricing for Knock-In Collar AUD/EUR",   date: "29 Apr 2026" },
  { type: "Message", summary: "Answered query on fixing schedule time zones",        date: "24 Apr 2026" },
  { type: "Call",    summary: "Portfolio review and hedging strategy onboarding",    date: "15 Apr 2026" },
];

const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

const QUICK = [
  { icon: Phone,   label: "Call Now",         sub: "Direct line" },
  { icon: Video,   label: "Start Video Call", sub: "Google Meet" },
  { icon: Mail,    label: "Send Email",        sub: "Opens mail client" },
];

export default function ContactPage() {
  const [message, setMessage]   = useState("");
  const [slot, setSlot]         = useState<string | null>(null);
  const [sending, setSending]   = useState(false);

  function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setMessage("");
      toast.success("Message sent to Hannah Mitchell");
    }, 800);
  }

  function handleBook() {
    if (!slot) return;
    toast.success(`Call booked for ${slot} — Hannah will confirm by email`);
    setSlot(null);
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        title="Contact Advisor"
        items={[{ label: "Client Portal" }, { label: "Contact Advisor" }]}
      />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">Contact Your Advisor</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reach out to your dedicated SwitchYard Capital account manager
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ---- Left column ---- */}
        <div className="space-y-5">
          {/* Profile card */}
          <Card>
            <CardContent className="p-5 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                {ADVISOR.initials}
              </div>
              <p className="text-lg font-bold text-foreground">{ADVISOR.name}</p>
              <p className="text-sm text-muted-foreground">{ADVISOR.title}</p>
              <Badge className="mt-3 bg-success/10 text-success hover:bg-success/10 gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                Available Now
              </Badge>
              <div className="mt-4 space-y-2 text-left">
                {([
                  { icon: Phone, label: "Phone",  value: ADVISOR.phone },
                  { icon: Mail,  label: "Email",  value: ADVISOR.email },
                  { icon: Clock, label: "Hours",  value: ADVISOR.availability },
                ] as const).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5 rounded-lg bg-muted/40 px-3 py-2">
                    <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
                      <p className="truncate text-xs font-medium text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {QUICK.map(({ icon: Icon, label, sub }) => (
                <button
                  key={label}
                  onClick={() => toast.info(`Opening ${label}…`)}
                  className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="truncate text-xs text-muted-foreground">{sub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ---- Right column ---- */}
        <div className="space-y-5 lg:col-span-2">
          {/* Message form */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Send a Message</CardTitle>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Hannah typically responds within 2 business hours
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Request a trade recommendation",
                  "Ask about my fixing schedule",
                  "Discuss hedging strategy",
                  "Query about portfolio MTM",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setMessage(q)}
                    className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Type your message here…"
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{message.length} / 1000</p>
                <Button onClick={handleSend} disabled={sending || !message.trim()}>
                  <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                  {sending ? "Sending…" : "Send Message"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Book a call */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <CardTitle className="text-base font-semibold">Book a Call</CardTitle>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Available slots for tomorrow, 08 May 2026 (AEST)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {TIME_SLOTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s === slot ? null : s)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      slot === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-muted/30 text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Button className="w-full" disabled={!slot} onClick={handleBook}>
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                {slot ? `Book Call at ${slot} AEST` : "Select a time slot above"}
              </Button>
            </CardContent>
          </Card>

          {/* Recent interactions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Interactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {RECENT.map((r, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                      r.type === "Call" ? "bg-primary/10 text-primary"
                      : r.type === "Email" ? "bg-chart-2/10 text-chart-2"
                      : "bg-chart-3/10 text-chart-3"
                    }`}
                  >
                    {r.type === "Call"    && <Phone className="h-3.5 w-3.5" />}
                    {r.type === "Email"   && <Mail className="h-3.5 w-3.5" />}
                    {r.type === "Message" && <MessageSquare className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-foreground">{r.summary}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.date}</p>
                  </div>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
