"use client";

import { cn } from "@dashboardpack/core/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

function getStrength(password: string) {
  const checks = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.met).length;
  const levels = ["", "Weak", "Fair", "Strong", "Very Strong"] as const;
  const colors = ["", "bg-red-500", "bg-orange-500", "bg-green-500", "bg-emerald-500"];
  return { checks, score, level: levels[score], color: colors[score] };
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { checks, score, level, color } = getStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= score ? color : "bg-muted"
            )}
          />
        ))}
      </div>
      <p className={cn("text-xs font-medium", score <= 1 ? "text-red-500" : score === 2 ? "text-orange-500" : "text-green-500")}>
        {level}
      </p>
      <div className="space-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-2 text-xs">
            {check.met ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-red-500" />
            )}
            <span className={check.met ? "text-muted-foreground" : "text-red-500"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
