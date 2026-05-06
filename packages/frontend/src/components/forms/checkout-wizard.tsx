"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, Lock } from "lucide-react";
import { motion } from "framer-motion";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@dashboardpack/core/components/ui/form";
import { Input } from "@dashboardpack/core/components/ui/input";
import { Button } from "@dashboardpack/core/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@dashboardpack/core/components/ui/select";
import { Card, CardContent } from "@dashboardpack/core/components/ui/card";
import { Stepper } from "@/components/forms/stepper";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

// ─── Schemas ─────────────────────────────────────────────────────────────────

const shippingSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
});

const paymentSchema = z.object({
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z
    .string()
    .transform((val) => val.replace(/\s/g, ""))
    .refine((val) => val.length === 16, "Card number must be 16 digits"),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Expiry must be in MM/YY format"),
  cvc: z
    .string()
    .min(3, "CVC must be 3-4 characters")
    .max(4, "CVC must be 3-4 characters"),
});

type ShippingValues = z.infer<typeof shippingSchema>;
type PaymentValues = z.infer<typeof paymentSchema>;

// ─── Cart data ───────────────────────────────────────────────────────────────

const cartItems = [
  { name: "Wireless Headphones", price: 79.99, quantity: 1 },
  { name: "USB-C Hub Adapter", price: 45.0, quantity: 2 },
  { name: "Mechanical Keyboard", price: 129.99, quantity: 1 },
];

const WIZARD_STEPS = [
  { label: "Cart Review" },
  { label: "Shipping" },
  { label: "Payment" },
  { label: "Confirmation" },
];

// ─── Shared input className (matches codebase style) ─────────────────────────
const inputClass =
  "w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

// ─── Step 0: Cart Review ─────────────────────────────────────────────────────

function CartReviewStep({ onNext }: { onNext: () => void }) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {cartItems.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between rounded border border-border bg-muted/30 px-4 py-3 text-sm"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-foreground">{item.name}</span>
              <span className="text-muted-foreground">Qty: {item.quantity}</span>
            </div>
            <span className="font-medium text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 rounded border border-border bg-muted/10 px-4 py-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-foreground">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>Proceed to Shipping</Button>
      </div>
    </div>
  );
}

// ─── Step 1: Shipping ─────────────────────────────────────────────────────────

function ShippingStep({
  defaultValues,
  onBack,
  onNext,
}: {
  defaultValues?: Partial<ShippingData>;
  onBack: () => void;
  onNext: (data: ShippingData) => void;
}) {
  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      address: defaultValues?.address ?? "",
      city: defaultValues?.city ?? "",
      state: defaultValues?.state ?? "",
      zipCode: defaultValues?.zipCode ?? "",
      country: defaultValues?.country ?? "",
    },
  });

  function onSubmit(values: ShippingValues) {
    onNext(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jane Smith" className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="123 Main St" className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="New York" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="NY" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="10001" className={inputClass} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className={inputClass}>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="de">Germany</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────

function PaymentStep({
  defaultValues,
  onBack,
  onNext,
}: {
  defaultValues?: Partial<PaymentData>;
  onBack: () => void;
  onNext: (data: PaymentData) => void;
}) {
  const form = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholderName: defaultValues?.cardholderName ?? "",
      cardNumber: defaultValues?.cardNumber ?? "",
      expiryDate: defaultValues?.expiryDate ?? "",
      cvc: defaultValues?.cvc ?? "",
    },
  });

  function onSubmit(values: PaymentValues) {
    // Store the raw (formatted) card number for display purposes
    onNext({
      cardholderName: values.cardholderName,
      cardNumber: values.cardNumber,
      expiryDate: values.expiryDate,
      cvc: values.cvc,
    });
  }

  function handleCardNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(" ") ?? raw;
    form.setValue("cardNumber", formatted, { shouldValidate: false });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cardholder Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jane Smith" className={inputClass} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={inputClass}
                  onChange={handleCardNumberChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={inputClass}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="123"
                    maxLength={4}
                    className={inputClass}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock size={14} />
          <span>Your payment info is secure</span>
        </div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}

// ─── Step 3: Confirmation ─────────────────────────────────────────────────────

function ConfirmationStep({
  wizardData,
  orderNumber,
  onReset,
}: {
  wizardData: { shipping?: ShippingData; payment?: PaymentData };
  orderNumber: string;
  onReset: () => void;
}) {
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const last4 = wizardData.payment?.cardNumber.replace(/\s/g, "").slice(-4) ?? "----";

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white"
      >
        <Check className="h-10 w-10" />
      </motion.div>

      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">Order Confirmed!</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Order #{orderNumber}
        </p>
      </div>

      <div className="w-full max-w-md rounded border border-border bg-muted/10 p-4 text-sm">
        {/* Items */}
        <p className="mb-2 font-medium text-foreground">Items</p>
        <ul className="flex flex-col gap-1 text-muted-foreground">
          {cartItems.map((item) => (
            <li key={item.name} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="my-3 border-t border-border" />

        {/* Shipping */}
        {wizardData.shipping && (
          <>
            <p className="mb-1 font-medium text-foreground">Shipping to</p>
            <p className="text-muted-foreground">
              {wizardData.shipping.fullName},{" "}
              {wizardData.shipping.address},{" "}
              {wizardData.shipping.city},{" "}
              {wizardData.shipping.state}{" "}
              {wizardData.shipping.zipCode}
            </p>
            <div className="my-3 border-t border-border" />
          </>
        )}

        {/* Payment */}
        <p className="mb-1 font-medium text-foreground">Payment</p>
        <p className="text-muted-foreground">Card ending in {last4}</p>

        <div className="my-3 border-t border-border" />

        {/* Total */}
        <div className="flex justify-between font-semibold text-foreground">
          <span>Total charged</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button onClick={onReset}>Continue Shopping</Button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckoutWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<{
    shipping?: ShippingData;
    payment?: PaymentData;
  }>({});
  const [orderNumber] = useState(
    "ADK-" + String(Math.floor(100000 + Math.random() * 900000))
  );

  function handleBack() {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }

  function handleShippingNext(data: ShippingData) {
    setWizardData((prev) => ({ ...prev, shipping: data }));
    setCurrentStep(2);
  }

  function handlePaymentNext(data: PaymentData) {
    setWizardData((prev) => ({ ...prev, payment: data }));
    setCurrentStep(3);
    toast.success("Order placed successfully!");
  }

  function handleReset() {
    setCurrentStep(0);
    setWizardData({});
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
          <Stepper
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            orientation="horizontal"
          />

          <div>
            {currentStep === 0 && (
              <CartReviewStep onNext={() => setCurrentStep(1)} />
            )}
            {currentStep === 1 && (
              <ShippingStep
                defaultValues={wizardData.shipping}
                onBack={handleBack}
                onNext={handleShippingNext}
              />
            )}
            {currentStep === 2 && (
              <PaymentStep
                defaultValues={wizardData.payment}
                onBack={handleBack}
                onNext={handlePaymentNext}
              />
            )}
            {currentStep === 3 && (
              <ConfirmationStep
                wizardData={wizardData}
                orderNumber={orderNumber}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
