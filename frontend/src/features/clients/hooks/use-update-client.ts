"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientQueryKeys } from "@/features/clients/query-keys";

type UpdateArgs = { id: string; body: unknown };

/**
 * Placeholder até existir PATCH em `/api/v1/clients/{id}`.
 * Não chamar em produção até `mutationFn` ser implementada.
 */
export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_args: UpdateArgs): Promise<never> => {
      void _args;
      throw new Error("Indisponível — API em evolução");
    },
    retry: 0,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: clientQueryKeys.all });
    },
  });
}
