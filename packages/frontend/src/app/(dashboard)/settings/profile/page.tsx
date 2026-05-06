"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────

type PersonalData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  portfolioUrl?: string;
};

// ─── Static data ─────────────────────────────────────────────────────────────

const defaultSkills = [
  { label: "UI Design", pct: 85, color: "bg-primary" },
  { label: "UX Research", pct: 72, color: "bg-[#2ca87f]" },
  { label: "Frontend Dev", pct: 90, color: "bg-[#e58a00]" },
  { label: "Prototyping", pct: 68, color: "bg-[#7c4dff]" },
  { label: "Design Systems", pct: 95, color: "bg-[#3ebfea]" },
  { label: "User Testing", pct: 78, color: "bg-[#1abc9c]" },
];

const education = [
  {
    degree: "Master in Computer Science",
    institution: "University of Latvia",
    period: "2014–2016",
  },
  {
    degree: "Bachelor in Design",
    institution: "Riga Technical University",
    period: "2010–2014",
  },
];

const experience = [
  { role: "Lead Designer", company: "Colorlib", period: "2018–Present" },
  { role: "UI Designer", company: "TechCorp", period: "2016–2018" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [personal, setPersonal] = useState<PersonalData>({});
  const [mounted, setMounted] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem("switchyard-settings-personal");
      if (stored) {
        setPersonal(JSON.parse(stored) as PersonalData);
      }
    } catch {}
    setMounted(true);
  }, []);

  const fullName = personal.firstName && personal.lastName
    ? `${personal.firstName} ${personal.lastName}`
    : "SwitchYard Capital";

  const aboutText = personal.bio?.trim() ||
    "SwitchYard Capital is a leading Australian FX platform helping businesses manage cross-border payments with competitive rates and transparent pricing.";

  const personalDetails = [
    { label: "Full Name", value: fullName },
    { label: "Location", value: personal.location || "Sydney, Australia" },
    { label: "Email", value: personal.email || "admin@switchyardfx.com.au" },
    { label: "Phone", value: personal.phone || "+371 2000 0000" },
    { label: "Website", value: personal.portfolioUrl || "switchyardfx.com.au" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* About Me */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>About Me</CardTitle>
          <button
            onClick={() => router.push("/settings/personal")}
            className="rounded border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            Edit Profile
          </button>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">{aboutText}</p>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border">
            {personalDetails.map(({ label, value }) => (
              <div key={label} className="flex items-center gap-4 py-2.5">
                <dt className="w-28 shrink-0 text-sm font-medium text-foreground">{label}</dt>
                <dd className="text-sm text-muted-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {defaultSkills.map(({ label, pct, color }) => (
              <div key={label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-muted-foreground">{pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: mounted ? `${pct}%` : 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {education.map(({ degree, institution, period }) => (
              <li key={degree} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="mt-1 flex-1 border-l-2 border-border" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-foreground">{degree}</p>
                  <p className="text-sm text-muted-foreground">{institution}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{period}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {experience.map(({ role, company, period }) => (
              <li key={role} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="mt-1 flex-1 border-l-2 border-border" />
                </div>
                <div className="pb-4">
                  <p className="text-sm font-medium text-foreground">{role}</p>
                  <p className="text-sm text-muted-foreground">{company}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/70">{period}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
