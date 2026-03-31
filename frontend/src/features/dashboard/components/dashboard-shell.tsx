"use client";

import type { ReactNode } from "react";
import { RequireAuth } from "@/features/auth/components/require-auth";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
