"use client";

import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@dashboardpack/core/components/ui/tabs";
import { CheckoutWizard } from "@/components/forms/checkout-wizard";
import { AccountSetupWizard } from "@/components/forms/account-setup-wizard";
import { JobApplicationWizard } from "@/components/forms/job-application-wizard";

export default function WizardPage() {
  return (
    <>
      <PageBreadcrumb
        title="Form Wizard"
        items={[{ label: "Forms" }, { label: "Form Wizard" }]}
      />

      <Tabs defaultValue="checkout" className="space-y-6">
        <TabsList>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="account">Account Setup</TabsTrigger>
          <TabsTrigger value="job">Job Application</TabsTrigger>
        </TabsList>

        <TabsContent value="checkout">
          <CheckoutWizard />
        </TabsContent>
        <TabsContent value="account">
          <AccountSetupWizard />
        </TabsContent>
        <TabsContent value="job">
          <JobApplicationWizard />
        </TabsContent>
      </Tabs>
    </>
  );
}
