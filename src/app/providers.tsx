import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </ErrorBoundary>
  );
}
