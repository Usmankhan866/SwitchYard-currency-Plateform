"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import { Checkbox } from "@dashboardpack/core/components/ui/checkbox";
import { Switch } from "@dashboardpack/core/components/ui/switch";
import {
  RadioGroup,
  RadioGroupItem,
} from "@dashboardpack/core/components/ui/radio-group";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Label } from "@dashboardpack/core/components/ui/label";

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  bio: z
    .string()
    .max(500, "Bio must be 500 characters or fewer")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  newsletter: z.boolean().default(false),
  notifications: z.boolean().default(false),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  bio: "",
  gender: "male",
  newsletter: false,
  notifications: false,
  agreeTerms: false,
};

const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

export default function FormElementsPage() {
  const [fileName, setFileName] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  function onSubmit(data: FormValues) {
    setSubmitted(true);
    toast.success("Form submitted successfully", {
      description: `Name: ${data.fullName}, Email: ${data.email}, Country: ${data.country}, Gender: ${data.gender}`,
    });
    setTimeout(() => setSubmitted(false), 3000);
  }

  function onReset() {
    form.reset(defaultValues);
    setFileName("");
    setSubmitted(false);
    toast.info("Form has been reset");
  }

  const watchNewsletter = form.watch("newsletter");
  const watchNotifications = form.watch("notifications");
  const watchGender = form.watch("gender");

  return (
    <>
      <PageBreadcrumb
        title="Form Elements"
        items={[{ label: "Forms" }, { label: "Form Elements" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Card 1: Basic Form Controls */}
            <div className="col-span-12">
              <Card
                className={
                  submitted
                    ? "ring-2 ring-green-500/30 transition-all duration-300"
                    : "transition-all duration-300"
                }
              >
                <CardHeader>
                  <CardTitle>Basic Form Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Full Name */}
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bio / Textarea */}
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Bio (optional, max 500 chars)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your bio"
                              rows={4}
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-muted-foreground">
                            {(field.value ?? "").length}/500
                          </p>
                        </FormItem>
                      )}
                    />

                    {/* Country Select */}
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 2: Input Sizes (static visual demo) */}
            <div className="col-span-12 md:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className={labelClass}>Large input</label>
                      <input
                        type="text"
                        className="w-full rounded border border-border bg-background px-3 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Large input"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Default input</label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="Default input"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Small input</label>
                      <input
                        type="text"
                        className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        placeholder="Small input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 3: Checkboxes & Radios */}
            <div className="col-span-12 md:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Checkboxes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="newsletter"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Newsletter
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="grid gap-1">
                            <FormLabel className="font-normal">
                              Agree to Terms
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Static disabled demo */}
                    <div className="flex items-center gap-2 opacity-50">
                      <Checkbox disabled checked />
                      <Label className="font-normal text-muted-foreground">
                        Disabled
                      </Label>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Checked:{" "}
                      {[watchNewsletter && "Newsletter", form.watch("agreeTerms") && "Terms"]
                        .filter(Boolean)
                        .join(", ") || "None"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="col-span-12 md:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Radio Buttons</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="male" id="gender-male" />
                              <Label htmlFor="gender-male" className="font-normal">
                                Male
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="female"
                                id="gender-female"
                              />
                              <Label
                                htmlFor="gender-female"
                                className="font-normal"
                              >
                                Female
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value="other"
                                id="gender-other"
                              />
                              <Label
                                htmlFor="gender-other"
                                className="font-normal"
                              >
                                Other
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Selected: {watchGender ?? "None"}
                        </p>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Card 4: Input Groups */}
            <div className="col-span-12 md:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle>Input Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {/* @ prefix */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <div className="flex">
                            <span className="flex items-center rounded-l border border-r-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                              @
                            </span>
                            <FormControl>
                              <Input
                                className="rounded-l-none"
                                placeholder="username"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* .00 suffix */}
                    <div>
                      <label className={labelClass}>Amount</label>
                      <div className="flex">
                        <input
                          type="text"
                          className="min-w-0 flex-1 rounded-l border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="0"
                        />
                        <span className="flex items-center rounded-r border border-l-0 border-border bg-muted px-3 text-sm text-muted-foreground">
                          .00
                        </span>
                      </div>
                    </div>

                    {/* $ prefix and .00 suffix */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 5: Switches */}
            <div className="col-span-12 md:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle>Switches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-5">
                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between gap-4">
                          <FormLabel className="font-normal">
                            Email Notifications
                          </FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Static demos */}
                    <div className="flex items-center justify-between gap-4">
                      <Label className="font-normal text-muted-foreground">
                        Disabled Off
                      </Label>
                      <Switch disabled />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <Label className="font-normal text-muted-foreground">
                        Disabled On
                      </Label>
                      <Switch disabled checked />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Notifications:{" "}
                      {watchNotifications ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 6: File Upload */}
            <div className="col-span-12 md:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle>File Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <label className={labelClass}>Choose a file</label>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFileName(file ? file.name : "");
                      }}
                    />
                    {fileName && (
                      <p className="text-sm text-muted-foreground">
                        Selected: <span className="font-medium text-foreground">{fileName}</span>
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Card 7: Readonly & Disabled */}
            <div className="col-span-12 md:col-span-6">
              <Card>
                <CardHeader>
                  <CardTitle>Readonly &amp; Disabled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Readonly input</label>
                      <Input
                        type="text"
                        className="cursor-default bg-muted"
                        value="readonly value"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Disabled input</label>
                      <Input
                        type="text"
                        value="disabled value"
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Submit / Reset */}
            <div className="col-span-12">
              <Card>
                <CardContent className="flex flex-wrap items-center gap-3 pt-6">
                  <Button type="submit">Submit</Button>
                  <Button type="button" variant="outline" onClick={onReset}>
                    Reset
                  </Button>
                  {Object.keys(form.formState.errors).length > 0 && (
                    <p className="text-sm text-destructive">
                      Please fix {Object.keys(form.formState.errors).length}{" "}
                      error(s) above
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
