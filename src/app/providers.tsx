"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { makeStore, type AppStore } from "@/store";

export function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      {children}
      <Toaster richColors closeButton position="top-right" />
    </Provider>
  );
}
