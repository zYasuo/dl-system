"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/features/auth/components/auth-provider";
import { makeQueryClient } from "@/lib/query/query-client";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          {children}
          <Toaster richColors theme="dark" position="top-center" />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
