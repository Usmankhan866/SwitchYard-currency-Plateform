"use client";

import { Check } from "lucide-react";

interface StepperProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
}

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <nav aria-label="Progress">
        <ol role="list" className="flex flex-col">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <li key={index} role="listitem" aria-current={isCurrent ? "step" : undefined}>
                <div className="flex items-start">
                  {/* Circle */}
                  <div className="flex flex-col items-center">
                    <div
                      className={[
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                        isCompleted
                          ? "bg-primary text-white"
                          : isCurrent
                          ? "bg-primary text-white ring-4 ring-primary/20"
                          : "border-2 border-muted text-muted-foreground",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    {/* Vertical connector */}
                    {!isLast && (
                      <div
                        className={[
                          "w-0.5 h-8 ml-0",
                          isCompleted ? "bg-primary" : "bg-muted",
                        ].join(" ")}
                      />
                    )}
                  </div>
                  {/* Label + description */}
                  <div className="ml-3 pt-1.5 pb-2">
                    <p
                      className={
                        isCurrent
                          ? "text-sm font-medium"
                          : "text-sm text-muted-foreground"
                      }
                    >
                      {step.label}
                    </p>
                    {step.description && (
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  // Horizontal layout (default)
  const items: React.ReactNode[] = [];

  steps.forEach((step, index) => {
    const isCompleted = index < currentStep;
    const isCurrent = index === currentStep;
    const isLast = index === steps.length - 1;

    items.push(
      <li
        key={`step-${index}`}
        role="listitem"
        aria-current={isCurrent ? "step" : undefined}
        className="flex flex-col items-center"
      >
        {/* Circle */}
        <div
          className={[
            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
            isCompleted
              ? "bg-primary text-white"
              : isCurrent
              ? "bg-primary text-white ring-4 ring-primary/20"
              : "border-2 border-muted text-muted-foreground",
          ].join(" ")}
        >
          {isCompleted ? (
            <Check className="h-5 w-5" />
          ) : (
            <span className="text-sm font-medium">{index + 1}</span>
          )}
        </div>
        {/* Label + description (hidden on xs) */}
        <div className="hidden sm:block mt-2 text-center">
          <p
            className={
              isCurrent
                ? "text-sm font-medium text-foreground"
                : "text-sm text-muted-foreground"
            }
          >
            {step.label}
          </p>
          {step.description && (
            <p className="text-xs text-muted-foreground">{step.description}</p>
          )}
        </div>
      </li>
    );

    if (!isLast) {
      items.push(
        <li
          key={`connector-${index}`}
          role="presentation"
          className={[
            "flex-1 h-0.5 mt-5",
            isCompleted ? "bg-primary" : "bg-muted",
          ].join(" ")}
        />
      );
    }
  });

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-start">
        {items}
      </ol>
    </nav>
  );
}
