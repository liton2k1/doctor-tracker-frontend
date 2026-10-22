"use client";

import { ErrorState } from "@/components/common/ErrorState";

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ErrorState message="An unexpected error occurred." onRetry={reset} />
    </div>
  );
}
