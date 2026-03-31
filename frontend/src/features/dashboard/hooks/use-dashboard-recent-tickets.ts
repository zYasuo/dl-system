"use client";

import { useQuery } from "@tanstack/react-query";
import { AFetchTicketsPage } from "@/features/tickets/actions";
import { dashboardQueryKeys } from "./dashboard-query-keys";

const PREVIEW_LIMIT = 8;

/**
 * Lista curta dos tickets mais recentemente atualizados (para a visão geral).
 */
export function useDashboardRecentTickets() {
  return useQuery({
    queryKey: dashboardQueryKeys.recentTicketsPreview(),
    queryFn: () =>
      AFetchTicketsPage({
        page: 1,
        limit: PREVIEW_LIMIT,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
  });
}
