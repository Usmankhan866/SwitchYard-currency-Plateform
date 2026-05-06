"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { Badge } from "@dashboardpack/core/components/ui/badge";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Textarea } from "@dashboardpack/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@dashboardpack/core/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { useSettingsStorage } from "@/hooks/use-settings-storage";

const personalSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof personalSchema>;

const defaultValues: FormValues = {
  firstName: "SwitchYard",
  lastName: "Capital",
  email: "admin@switchyardfx.com.au",
  phone: "+61 2 0000 0000",
  location: "Sydney, Australia",
  bio: "",
  experience: "5+ Years",
  skills: "",
  portfolioUrl: "https://switchyardfx.com.au",
};

const defaultSocial = { facebook: false, twitter: false, linkedin: false };

const socialLabels: Record<keyof typeof defaultSocial, string> = {
  facebook: "Facebook",
  twitter: "Twitter",
  linkedin: "LinkedIn",
};

export default function PersonalPage() {
  const [storedValues, setStoredValues] = useSettingsStorage<FormValues>(
    "switchyard-settings-personal",
    defaultValues
  );
  const [social, setSocial] = useSettingsStorage(
    "switchyard-settings-social",
    defaultSocial
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues,
  });

  const { formState } = form;
  const isDirty = formState.isDirty;

  // Hydrate from localStorage after mount
  useEffect(() => {
    form.reset(storedValues);
  }, [storedValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // beforeunload warning when there are unsaved changes
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function onSubmit(values: FormValues) {
    setStoredValues(values);
    toast.success("Personal info updated");
    form.reset(values); // clears dirty state
  }

  function toggleSocial(platform: keyof typeof defaultSocial) {
    const next = !social[platform];
    setSocial({ ...social, [platform]: next });
    if (next) {
      toast.success(`${socialLabels[platform]} connected`);
    } else {
      toast.info(`${socialLabels[platform]} disconnected`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {isDirty && (
                <Badge variant="warning">Unsaved changes</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="resize-none"
                          placeholder="Write a short bio..."
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Experience */}
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select experience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1-2 Years">1-2 Years</SelectItem>
                          <SelectItem value="3-5 Years">3-5 Years</SelectItem>
                          <SelectItem value="5+ Years">5+ Years</SelectItem>
                          <SelectItem value="10+ Years">10+ Years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Skills */}
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="e.g. UI Design, Figma, CSS"
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <Button type="submit">Update Profile</Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Information */}
          <Card>
            <CardHeader>
              <CardTitle>Social Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {/* Facebook */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="facebook">
                      Facebook
                    </label>
                    <Input
                      id="facebook"
                      type="text"
                      placeholder="facebook.com/username"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSocial("facebook")}
                    className={[
                      "mt-6 shrink-0 rounded px-4 py-2 text-sm font-medium text-white",
                      social.facebook
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-blue-600 hover:bg-blue-700",
                    ].join(" ")}
                  >
                    {social.facebook ? "Connected" : "Connect"}
                  </button>
                </div>

                {/* Twitter */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="twitter">
                      Twitter / X
                    </label>
                    <Input
                      id="twitter"
                      type="text"
                      placeholder="twitter.com/username"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSocial("twitter")}
                    className={[
                      "mt-6 shrink-0 rounded px-4 py-2 text-sm font-medium text-white",
                      social.twitter
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-gray-900 hover:bg-gray-800",
                    ].join(" ")}
                  >
                    {social.twitter ? "Connected" : "Connect"}
                  </button>
                </div>

                {/* LinkedIn */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="mb-1.5 block text-sm font-medium text-foreground" htmlFor="linkedin">
                      LinkedIn
                    </label>
                    <Input
                      id="linkedin"
                      type="text"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSocial("linkedin")}
                    className={[
                      "mt-6 shrink-0 rounded px-4 py-2 text-sm font-medium text-white",
                      social.linkedin
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-blue-700 hover:bg-blue-800",
                    ].join(" ")}
                  >
                    {social.linkedin ? "Connected" : "Connect"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          value={field.value ?? ""}
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Portfolio URL */}
                <div className="sm:col-span-2">
                  <FormField
                    control={form.control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
}
