"use client";

import { useQuery } from "@tanstack/react-query";
import { AFetchClientContractsPage } from "@/features/client-contracts/actions";
import { clientContractQueryKeys } from "@/features/client-contracts/query-keys";

export function useClientContractsByClient(
  clientId: string,
  page = 1,
  limit = 20,
) {
  return useQuery({
    queryKey: clientContractQueryKeys.byClient(clientId, page, limit),
    queryFn: () =>
      AFetchClientContractsPage({
        page,
        limit,
        clientId,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
    enabled: clientId.length > 0,
  });
}
