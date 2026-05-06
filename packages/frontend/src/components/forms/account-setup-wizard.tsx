"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@dashboardpack/core/components/ui/radio-group";
import { Stepper } from "@/components/forms/stepper";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().optional(),
});

const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companySize: z.string().min(1, "Company size is required"),
  industry: z.string().min(1, "Industry is required"),
  website: z.string().url().or(z.literal("")).optional(),
});

type PersonalValues = z.infer<typeof personalSchema>;
type CompanyValues = z.infer<typeof companySchema>;

// ─── Wizard data type ─────────────────────────────────────────────────────────

type WizardData = {
  personal?: PersonalValues;
  company?: CompanyValues;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    theme: string;
    timezone: string;
  };
};

// ─── Steps definition ─────────────────────────────────────────────────────────

const STEPS = [
  { label: "Personal Info" },
  { label: "Company Details" },
  { label: "Preferences" },
  { label: "Complete" },
];

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

// ─── Step 0: Personal Info ────────────────────────────────────────────────────

function PersonalInfoStep({
  defaultValues,
  onNext,
}: {
  defaultValues?: PersonalValues;
  onNext: (data: PersonalValues) => void;
}) {
  const form = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 555 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" disabled>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

// ─── Step 1: Company Details ──────────────────────────────────────────────────

function CompanyDetailsStep({
  defaultValues,
  onBack,
  onNext,
}: {
  defaultValues?: CompanyValues;
  onBack: () => void;
  onNext: (data: CompanyValues) => void;
}) {
  const form = useForm<CompanyValues>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultValues ?? {
      companyName: "",
      companySize: "",
      industry: "",
      website: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Company Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["1-10", "11-50", "51-200", "201-500", "500+"].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        "Technology",
                        "Finance",
                        "Healthcare",
                        "Education",
                        "Retail",
                        "Other",
                      ].map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Website (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

// ─── Step 2: Preferences ─────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
];

function PreferencesStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: (prefs: WizardData["preferences"]) => void;
}) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [theme, setTheme] = useState("System");
  const [timezone, setTimezone] = useState("UTC");

  function handleNext() {
    onNext({ emailNotifications, smsNotifications, marketingEmails, theme, timezone });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Notifications */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Notifications</p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground" htmlFor="pref-email-notif">
              Email Notifications
            </label>
            <Switch
              id="pref-email-notif"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground" htmlFor="pref-sms-notif">
              SMS Notifications
            </label>
            <Switch
              id="pref-sms-notif"
              checked={smsNotifications}
              onCheckedChange={setSmsNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground" htmlFor="pref-marketing">
              Marketing Emails
            </label>
            <Switch
              id="pref-marketing"
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>
        </div>
      </div>

      {/* Theme */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Theme</p>
        <RadioGroup
          value={theme}
          onValueChange={setTheme}
          className="flex flex-row gap-6"
        >
          {["Light", "Dark", "System"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <RadioGroupItem value={t} id={`theme-${t}`} />
              <label
                htmlFor={`theme-${t}`}
                className="cursor-pointer text-sm text-foreground"
              >
                {t}
              </label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Timezone */}
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Timezone</p>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz} value={tz}>
                {tz}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Complete ─────────────────────────────────────────────────────────

function CompleteStep({ data }: { data: WizardData }) {
  const firstName = data.personal?.firstName ?? "";
  const company = data.company?.companyName ?? "";
  const email = data.personal?.email ?? "";

  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        <Check className="h-10 w-10" />
      </motion.div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Welcome, {firstName}!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account has been set up successfully.
        </p>
      </div>

      <div className="w-full max-w-sm rounded-lg border border-border bg-muted/30 p-4 text-left">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Company</span>
            <span className="font-medium text-foreground">{company || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{email}</span>
          </div>
        </div>
      </div>

      <Button asChild>
        <Link href="/dashboard/analytics">Go to Dashboard</Link>
      </Button>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function AccountSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});

  function handlePersonalNext(data: PersonalValues) {
    setWizardData((prev) => ({ ...prev, personal: data }));
    setCurrentStep(1);
  }

  function handleCompanyNext(data: CompanyValues) {
    setWizardData((prev) => ({ ...prev, company: data }));
    setCurrentStep(2);
  }

  function handlePreferencesNext(prefs: WizardData["preferences"]) {
    setWizardData((prev) => ({ ...prev, preferences: prefs }));
    setCurrentStep(3);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
          {/* Stepper */}
          <Stepper steps={STEPS} currentStep={currentStep} orientation="horizontal" />

          {/* Step content */}
          <div>
            {currentStep === 0 && (
              <PersonalInfoStep
                defaultValues={wizardData.personal}
                onNext={handlePersonalNext}
              />
            )}
            {currentStep === 1 && (
              <CompanyDetailsStep
                defaultValues={wizardData.company}
                onBack={() => setCurrentStep(0)}
                onNext={handleCompanyNext}
              />
            )}
            {currentStep === 2 && (
              <PreferencesStep
                onBack={() => setCurrentStep(1)}
                onNext={handlePreferencesNext}
              />
            )}
            {currentStep === 3 && <CompleteStep data={wizardData} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
