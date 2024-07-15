"use client";
import { Button } from "@/components/ui/button";
import { AuthRequiredError } from "@/lib/exceptions";
import Link from "next/link";
import React from "react";
const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  let errorMessage = "";
  if (error instanceof AuthRequiredError) {
    errorMessage = "Unauthorized - Signin with valid credentials";
  }
  return (
    <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold">404</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {errorMessage || "You Need to login to your Account."}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Please try again later and contact support if problem persist.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={reset} aria-label="reset">
            Try Again
          </Button>
          <Link href="/signin" className="text-sm font-semibold text-gray-900">
            Go to Signin Page <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default error;
