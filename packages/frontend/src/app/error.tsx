"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-destructive">500</h1>
        <p className="mt-4 text-lg text-muted-foreground">Something went wrong</p>
        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-primary px-6 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
