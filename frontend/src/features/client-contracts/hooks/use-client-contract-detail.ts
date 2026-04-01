"use client";

import { useQuery } from "@tanstack/react-query";
import { AFindClientContractById } from "@/features/client-contracts/actions";
import { clientContractQueryKeys } from "@/features/client-contracts/query-keys";

export function useClientContractDetail(id: string) {
  return useQuery({
    queryKey: clientContractQueryKeys.detail(id),
    queryFn: () => AFindClientContractById(id),
    enabled: id.length > 0,
  });
}
