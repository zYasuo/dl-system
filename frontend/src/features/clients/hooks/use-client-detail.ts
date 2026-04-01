"use client";

import { useQuery } from "@tanstack/react-query";
import { AFindClientById } from "@/features/clients/actions";
import { clientQueryKeys } from "@/features/clients/query-keys";

export function useClientDetail(id: string) {
  return useQuery({
    queryKey: clientQueryKeys.detail(id),
    queryFn: () => AFindClientById(id),
    enabled: id.length > 0,
  });
}
