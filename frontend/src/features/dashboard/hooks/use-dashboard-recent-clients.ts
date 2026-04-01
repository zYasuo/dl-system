"use client";

import { useQuery } from "@tanstack/react-query";
import { AFetchClientsPage } from "@/features/clients/actions";
import { dashboardQueryKeys } from "./dashboard-query-keys";

const PREVIEW_LIMIT = 8;

export function useDashboardRecentClients() {
  return useQuery({
    queryKey: dashboardQueryKeys.recentClientsPreview(),
    queryFn: () =>
      AFetchClientsPage({
        page: 1,
        limit: PREVIEW_LIMIT,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
  });
}
