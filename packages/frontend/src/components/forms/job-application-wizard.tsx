"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, FileText, X, Plus } from "lucide-react";
import { motion } from "framer-motion";
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
import { Stepper } from "@/components/forms/stepper";

// ─── Schemas ────────────────────────────────────────────────────────────────

const personalSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
});

const experienceSchema = z.object({
  experiences: z
    .array(
      z.object({
        jobTitle: z.string().min(1, "Job title is required"),
        company: z.string().min(1, "Company is required"),
        yearsWorked: z.coerce.number().min(0, "Must be 0 or more"),
      })
    )
    .min(1),
});

const educationSchema = z.object({
  education: z
    .array(
      z.object({
        degree: z.string().min(1, "Degree is required"),
        institution: z.string().min(1, "Institution is required"),
        graduationYear: z.coerce
          .number()
          .min(1970, "Year must be 1970-2030")
          .max(2030, "Year must be 1970-2030"),
      })
    )
    .min(1),
});

const documentsSchema = z.object({});

// ─── Types ───────────────────────────────────────────────────────────────────

type PersonalValues = z.infer<typeof personalSchema>;
type ExperienceValues = z.infer<typeof experienceSchema>;
type EducationValues = z.infer<typeof educationSchema>;
type DocumentsValues = z.infer<typeof documentsSchema>;

interface WizardData {
  personal?: PersonalValues;
  experiences?: ExperienceValues["experiences"];
  education?: EducationValues["education"];
  hasResume?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Personal" },
  { label: "Experience" },
  { label: "Education" },
  { label: "Documents" },
  { label: "Review" },
];

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

// ─── Step 0: Personal ────────────────────────────────────────────────────────

function PersonalStep({
  onNext,
  defaultValues,
}: {
  onNext: (data: PersonalValues) => void;
  defaultValues?: PersonalValues;
}) {
  const form = useForm<PersonalValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: defaultValues ?? {
      fullName: "",
      email: "",
      phone: "",
      location: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Jane Doe" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="jane@example.com" className={inputClass} />
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
                <FormLabel className={labelClass}>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="+1 555 000 0000" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New York, NY" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit">Next</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

// ─── Step 1: Experience ───────────────────────────────────────────────────────

function ExperienceStep({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: ExperienceValues) => void;
  onBack: () => void;
  defaultValues?: ExperienceValues["experiences"];
}) {
  const form = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      experiences: defaultValues ?? [{ jobTitle: "", company: "", yearsWorked: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="flex flex-col gap-5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-border p-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Experience {index + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove experience"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`experiences.${index}.jobTitle`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Job Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Software Engineer" className={inputClass} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.company`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Company</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Acme Inc." className={inputClass} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experiences.${index}.yearsWorked`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Years Worked</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        placeholder="2"
                        className={inputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= 3}
              onClick={() => append({ jobTitle: "", company: "", yearsWorked: 0 })}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add Another
            </Button>
          </div>

          <div className="flex justify-between pt-2">
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

// ─── Step 2: Education ────────────────────────────────────────────────────────

function EducationStep({
  onNext,
  onBack,
  defaultValues,
}: {
  onNext: (data: EducationValues) => void;
  onBack: () => void;
  defaultValues?: EducationValues["education"];
}) {
  const form = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: defaultValues ?? [{ degree: "", institution: "", graduationYear: 2020 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="flex flex-col gap-5">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="rounded-lg border border-border p-4 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  Education {index + 1}
                </p>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove education"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`education.${index}.degree`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Degree</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="B.Sc. Computer Science" className={inputClass} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.institution`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Institution</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="MIT" className={inputClass} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.graduationYear`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Graduation Year</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1970}
                        max={2030}
                        placeholder="2020"
                        className={inputClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={fields.length >= 3}
              onClick={() => append({ degree: "", institution: "", graduationYear: 2020 })}
              className="gap-1.5"
            >
              <Plus size={14} />
              Add Another
            </Button>
          </div>

          <div className="flex justify-between pt-2">
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

// ─── Step 3: Documents ────────────────────────────────────────────────────────

function DocumentsStep({
  onNext,
  onBack,
  hasResume,
  setHasResume,
}: {
  onNext: () => void;
  onBack: () => void;
  hasResume: boolean;
  setHasResume: (v: boolean) => void;
}) {
  const form = useForm<DocumentsValues>({
    resolver: zodResolver(documentsSchema),
    defaultValues: {},
  });

  function handleDropzoneClick() {
    if (!hasResume) {
      setHasResume(true);
    }
    toast.info("File upload is for demo purposes only");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onNext)}>
        <div className="flex flex-col gap-5">
          {/* Dropzone */}
          <div
            role="button"
            tabIndex={0}
            className="border-2 border-dashed border-muted rounded-lg p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
            onClick={handleDropzoneClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleDropzoneClick();
            }}
            onDrop={(e) => {
              e.preventDefault();
              setHasResume(true);
              toast.info("File upload is for demo purposes only");
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Drag &amp; drop your resume here or{" "}
              <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10 MB</p>
          </div>

          {/* Mock file entry */}
          {hasResume && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
            >
              <FileText className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">resume.pdf</p>
                <p className="text-xs text-muted-foreground">2.4 MB</p>
              </div>
              <button
                type="button"
                onClick={() => setHasResume(false)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}

          <div className="flex justify-between pt-2">
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

// ─── Step 4: Review ───────────────────────────────────────────────────────────

function ReviewStep({
  wizardData,
  onBack,
  onSubmit,
}: {
  wizardData: WizardData;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { personal, experiences, education, hasResume } = wizardData;

  return (
    <div className="flex flex-col gap-6">
      {/* Personal */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Personal Information</h3>
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {personal ? (
            Object.entries(personal).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</dt>
                <dd className="text-sm text-foreground">{value}</dd>
              </div>
            ))
          ) : (
            <dd className="text-sm text-muted-foreground col-span-2">No data</dd>
          )}
        </dl>
      </section>

      {/* Experience */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Experience</h3>
        {experiences && experiences.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {experiences.map((exp, i) => (
              <li key={i} className="text-sm text-foreground">
                {exp.jobTitle} at {exp.company} ({exp.yearsWorked} {exp.yearsWorked === 1 ? "year" : "years"})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No experience added</p>
        )}
      </section>

      {/* Education */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Education</h3>
        {education && education.length > 0 ? (
          <ul className="flex flex-col gap-1">
            {education.map((edu, i) => (
              <li key={i} className="text-sm text-foreground">
                {edu.degree} from {edu.institution} ({edu.graduationYear})
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No education added</p>
        )}
      </section>

      {/* Documents */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-3">Documents</h3>
        <p className="text-sm text-foreground">
          {hasResume ? "resume.pdf" : "No documents uploaded"}
        </p>
      </section>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onSubmit}>
          Submit Application
        </Button>
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export function JobApplicationWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({});
  const [hasResume, setHasResume] = useState(true);

  function handlePersonalNext(data: PersonalValues) {
    setWizardData((prev) => ({ ...prev, personal: data }));
    setCurrentStep(1);
  }

  function handleExperienceNext(data: ExperienceValues) {
    setWizardData((prev) => ({ ...prev, experiences: data.experiences }));
    setCurrentStep(2);
  }

  function handleEducationNext(data: EducationValues) {
    setWizardData((prev) => ({ ...prev, education: data.education }));
    setCurrentStep(3);
  }

  function handleDocumentsNext() {
    setWizardData((prev) => ({ ...prev, hasResume }));
    setCurrentStep(4);
  }

  function handleSubmit() {
    toast.success("Application submitted successfully!");
    setTimeout(() => {
      setCurrentStep(0);
      setWizardData({});
      setHasResume(true);
    }, 2000);
  }

  function renderStep() {
    switch (currentStep) {
      case 0:
        return (
          <PersonalStep
            onNext={handlePersonalNext}
            defaultValues={wizardData.personal}
          />
        );
      case 1:
        return (
          <ExperienceStep
            onNext={handleExperienceNext}
            onBack={() => setCurrentStep(0)}
            defaultValues={wizardData.experiences}
          />
        );
      case 2:
        return (
          <EducationStep
            onNext={handleEducationNext}
            onBack={() => setCurrentStep(1)}
            defaultValues={wizardData.education}
          />
        );
      case 3:
        return (
          <DocumentsStep
            onNext={handleDocumentsNext}
            onBack={() => setCurrentStep(2)}
            hasResume={hasResume}
            setHasResume={setHasResume}
          />
        );
      case 4:
        return (
          <ReviewStep
            wizardData={{ ...wizardData, hasResume }}
            onBack={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[256px_1fr]">
      <Stepper steps={STEPS} currentStep={currentStep} orientation="vertical" />
      <Card>
        <CardContent className="pt-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
