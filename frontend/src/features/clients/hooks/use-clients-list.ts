"use client";

import { useQuery } from "@tanstack/react-query";
import { AFetchClientsPage } from "@/features/clients/actions";
import {
  clientQueryKeys,
  type ClientsListOptions,
} from "@/features/clients/query-keys";

export function useClientsList(
  page: number,
  limit: number,
  options?: ClientsListOptions,
) {
  const { sortBy, sortOrder, name } = options ?? {};

  return useQuery({
    queryKey: clientQueryKeys.list(page, limit, options),
    queryFn: () =>
      AFetchClientsPage({
        page,
        limit,
        ...(sortBy ? { sortBy } : {}),
        ...(sortOrder ? { sortOrder } : {}),
        ...(name ? { name } : {}),
      }),
  });
}
