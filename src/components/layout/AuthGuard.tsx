"use client";

import { useEffect, type ReactNode } from "react";
import { HeartPulse } from "lucide-react";
import { useGetMeQuery, useLogoutMutation } from "@/services/authApi";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useGetMeQuery();
  const [logout] = useLogoutMutation();
  const isForbidden = Boolean(user && user.role !== "ADMIN");

  useEffect(() => {
    if (!isForbidden) return;
    logout()
      .unwrap()
      .finally(() => window.location.assign("/login"));
  }, [isForbidden, logout]);

  if (isLoading || isError || isForbidden) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-slate-50"
        role="status"
        aria-label="Checking session"
      >
        <span className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-brand-600 text-white">
          <HeartPulse className="h-6 w-6" />
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
