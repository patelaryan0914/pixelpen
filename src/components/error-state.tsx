"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorState({
  label = "Error",
  title,
  description = "Please try again, and contact support if the problem persists.",
  onRetry,
  showSignIn = false,
}: {
  label?: string;
  title: string;
  description?: string;
  onRetry?: () => void;
  showSignIn?: boolean;
}) {
  return (
    <main className="grid min-h-[60vh] place-items-center bg-background px-6 py-24">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold text-primary">{label}</p>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          {onRetry && (
            <Button onClick={onRetry} aria-label="reset">
              Try again
            </Button>
          )}
          {showSignIn ? (
            <Link href="/signin" className="text-sm font-semibold text-foreground">
              Sign in →
            </Link>
          ) : (
            <Link href="/" className="text-sm font-semibold text-foreground">
              Home →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
