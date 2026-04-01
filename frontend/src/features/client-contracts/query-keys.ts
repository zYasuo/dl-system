import type {
  ClientContractSortBy,
  ClientContractSortOrder,
  ClientContractStatus,
} from "./actions";

export type ClientContractsListOptions = {
  sortBy?: ClientContractSortBy;
  sortOrder?: ClientContractSortOrder;
  clientId?: string;
  status?: ClientContractStatus;
};

export const clientContractQueryKeys = {
  all: ["client-contracts"] as const,
  list: (page: number, limit: number, options?: ClientContractsListOptions) =>
    [
      ...clientContractQueryKeys.all,
      "list",
      {
        page,
        limit,
        sortBy: options?.sortBy,
        sortOrder: options?.sortOrder,
        clientId: options?.clientId,
        status: options?.status,
      },
    ] as const,
  detail: (id: string) =>
    [...clientContractQueryKeys.all, "detail", id] as const,
  byClient: (clientId: string, page: number, limit: number) =>
    [
      ...clientContractQueryKeys.all,
      "by-client",
      clientId,
      page,
      limit,
    ] as const,
};
