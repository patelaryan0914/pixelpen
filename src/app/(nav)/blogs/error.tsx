"use client";

import ErrorState from "@/components/error-state";
import { AuthRequiredError } from "@/lib/exceptions";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isAuth = error instanceof AuthRequiredError;
  return (
    <ErrorState
      label={isAuth ? "Unauthorized" : "Not found"}
      title={
        isAuth
          ? "You need to sign in to view this."
          : "This story could not be found."
      }
      onRetry={reset}
      showSignIn={isAuth}
    />
  );
}
