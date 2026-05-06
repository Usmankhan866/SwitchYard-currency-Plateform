"use client";

import { useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@dashboardpack/core/components/ui/button";
import { Input } from "@dashboardpack/core/components/ui/input";

const emailSchema = z.string().email();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate(): TimeLeft {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds };
    }

    setTimeLeft(calculate());
    const id = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

export function ComingSoonContent() {
  const [target] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  });
  const timeLeft = useCountdown(target);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  function handleNotify() {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setEmail("");
    toast.success("You'll be the first to know!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      <div className="mb-8">
        <Rocket className="h-20 w-20 text-primary" />
      </div>

      <h1 className="mb-3 text-2xl font-semibold text-foreground">Coming Soon</h1>
      <p className="mb-10 max-w-md text-muted-foreground">
        We&apos;re working on something exciting. Stay tuned!
      </p>

      {/* Countdown */}
      <div className="mb-10 grid w-full max-w-sm grid-cols-4 gap-4">
        {UNITS.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center rounded-lg border border-border p-4">
            <span className="text-3xl font-bold text-foreground">
              {String(timeLeft[key]).padStart(2, "0")}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Notify Me */}
      <div className="w-full max-w-sm">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleNotify()}
            className="flex-1"
          />
          <Button onClick={handleNotify}>Notify Me</Button>
        </div>
        {emailError && (
          <p className="mt-1.5 text-left text-xs text-destructive">{emailError}</p>
        )}
      </div>
    </motion.div>
  );
}
