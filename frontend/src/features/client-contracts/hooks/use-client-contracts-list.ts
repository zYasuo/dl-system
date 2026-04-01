"use client";

import { useQuery } from "@tanstack/react-query";
import { AFetchClientContractsPage } from "@/features/client-contracts/actions";
import {
  clientContractQueryKeys,
  type ClientContractsListOptions,
} from "@/features/client-contracts/query-keys";

export function useClientContractsList(
  page: number,
  limit: number,
  options?: ClientContractsListOptions,
) {
  const { sortBy, sortOrder, clientId, status } = options ?? {};

  return useQuery({
    queryKey: clientContractQueryKeys.list(page, limit, options),
    queryFn: () =>
      AFetchClientContractsPage({
        page,
        limit,
        ...(sortBy ? { sortBy } : {}),
        ...(sortOrder ? { sortOrder } : {}),
        ...(clientId ? { clientId } : {}),
        ...(status ? { status } : {}),
      }),
  });
}
