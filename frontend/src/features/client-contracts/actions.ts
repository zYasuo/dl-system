"use server";

import type { components } from "@/lib/api/v1";
import { ApiError } from "@/lib/api/api-error";
import { backendRequest } from "@/lib/api/backend-request";

export type ClientContractPublic =
  components["schemas"]["ClientContractPublicHttpOpenApiDto"];
export type ClientContractListInner =
  components["schemas"]["ClientContractListInnerOpenApiDto"];
export type CreateClientContractBody =
  components["schemas"]["CreateClientContractBodyDto"];
export type UpdateClientContractBody =
  components["schemas"]["UpdateClientContractBodyDto"];

export type ClientContractStatus = ClientContractPublic["status"];
export type ClientContractSortBy =
  | "contractNumber"
  | "startDate"
  | "createdAt"
  | "updatedAt";
export type ClientContractSortOrder = "asc" | "desc";

function clientContractsListQuery(params: {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: ClientContractSortBy;
  sortOrder?: ClientContractSortOrder;
  clientId?: string;
  status?: ClientContractStatus;
}): string {
  const search = new URLSearchParams();
  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.cursor != null) search.set("cursor", params.cursor);
  if (params.sortBy != null) search.set("sortBy", params.sortBy);
  if (params.sortOrder != null) search.set("sortOrder", params.sortOrder);
  if (params.clientId != null) search.set("clientId", params.clientId);
  if (params.status != null) search.set("status", params.status);
  const q = search.toString();
  return q ? `?${q}` : "";
}

export async function AFetchClientContractsPage(params: {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: ClientContractSortBy;
  sortOrder?: ClientContractSortOrder;
  clientId?: string;
  status?: ClientContractStatus;
}): Promise<ClientContractListInner> {
  const res = await backendRequest(
    `/api/v1/client-contracts${clientContractsListQuery(params)}`,
    { method: "GET", withBearer: true },
  );
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientContractListInner };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}

export async function AFindClientContractById(
  id: string,
): Promise<ClientContractPublic | null> {
  const res = await backendRequest(
    `/api/v1/client-contracts/${encodeURIComponent(id)}`,
    { method: "GET", withBearer: true },
  );
  const data: unknown = await res.json().catch(() => null);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientContractPublic };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}

export async function ACreateClientContract(
  body: CreateClientContractBody,
): Promise<ClientContractPublic> {
  const res = await backendRequest("/api/v1/client-contracts", {
    method: "POST",
    body: JSON.stringify(body),
    withBearer: true,
  });
  const data: unknown = await res.json().catch(() => null);
  const ok = res.ok || res.status === 201;
  if (!ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientContractPublic };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}

export async function AUpdateClientContract(
  id: string,
  body: UpdateClientContractBody,
): Promise<ClientContractPublic> {
  const res = await backendRequest(
    `/api/v1/client-contracts/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
      withBearer: true,
    },
  );
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientContractPublic };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}
