"use client";

import { useQuery } from "@tanstack/react-query";
import { AFetchClientContractsPage } from "@/features/client-contracts/actions";
import { dashboardQueryKeys } from "./dashboard-query-keys";

const PREVIEW_LIMIT = 8;

export function useDashboardRecentContracts() {
  return useQuery({
    queryKey: dashboardQueryKeys.recentContractsPreview(),
    queryFn: () =>
      AFetchClientContractsPage({
        page: 1,
        limit: PREVIEW_LIMIT,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
  });
}
