import type { ClientListSortBy, ClientListSortOrder } from "./actions";

export type ClientsListOptions = {
  sortBy?: ClientListSortBy;
  sortOrder?: ClientListSortOrder;
  name?: string;
};

export const clientQueryKeys = {
  all: ["clients"] as const,
  list: (page: number, limit: number, options?: ClientsListOptions) =>
    [
      ...clientQueryKeys.all,
      "list",
      { page, limit, sortBy: options?.sortBy, sortOrder: options?.sortOrder, name: options?.name },
    ] as const,
  detail: (id: string) => [...clientQueryKeys.all, "detail", id] as const,
  search: (q: string, page: number, limit: number) =>
    [...clientQueryKeys.all, "search", { q, page, limit }] as const,
};
