"use client";

import { useQuery } from "@tanstack/react-query";
import { ASearchClientsPage } from "@/features/clients/actions";
import { clientQueryKeys } from "@/features/clients/query-keys";

const DEFAULT_LIMIT = 10;

export function useClientsSearch(
  q: string,
  page = 1,
  limit = DEFAULT_LIMIT,
) {
  const trimmed = q.trim();

  return useQuery({
    queryKey: clientQueryKeys.search(trimmed, page, limit),
    queryFn: () => ASearchClientsPage({ q: trimmed, page, limit }),
    enabled: trimmed.length > 0,
  });
}
