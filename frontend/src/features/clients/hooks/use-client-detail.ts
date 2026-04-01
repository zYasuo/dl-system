"use client";

import { useQuery } from "@tanstack/react-query";
import { AFindClientById } from "@/features/clients/actions";
import { clientQueryKeys } from "@/features/clients/query-keys";

export function useClientDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: clientQueryKeys.detail(id),
    queryFn: () => AFindClientById(id),
    enabled: enabled && id.length > 0,
  });
}
