"use server";

import type { components } from "@/lib/api/v1";
import { ApiError } from "@/lib/api/api-error";
import { backendRequest } from "@/lib/api/backend-request";

export type ClientPublic = components["schemas"]["ClientPublicHttpOpenApiDto"];
export type ClientListInner = components["schemas"]["ClientListInnerOpenApiDto"];
export type ClientSearchListInner =
  components["schemas"]["ClientSearchListInnerOpenApiDto"];
export type CreateClientBody = components["schemas"]["CreateClientBodyDto"];

export type ClientListSortBy = "name" | "createdAt" | "updatedAt";
export type ClientListSortOrder = "asc" | "desc";

function clientsListQuery(params: {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: ClientListSortBy;
  sortOrder?: ClientListSortOrder;
  name?: string;
}): string {
  const search = new URLSearchParams();
  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  if (params.cursor != null) search.set("cursor", params.cursor);
  if (params.sortBy != null) search.set("sortBy", params.sortBy);
  if (params.sortOrder != null) search.set("sortOrder", params.sortOrder);
  if (params.name != null) search.set("name", params.name);
  const q = search.toString();
  return q ? `?${q}` : "";
}

function clientsSearchQuery(params: {
  q: string;
  page?: number;
  limit?: number;
}): string {
  const search = new URLSearchParams();
  search.set("q", params.q);
  if (params.page != null) search.set("page", String(params.page));
  if (params.limit != null) search.set("limit", String(params.limit));
  return `?${search.toString()}`;
}

export async function AFetchClientsPage(params: {
  page?: number;
  limit?: number;
  cursor?: string;
  sortBy?: ClientListSortBy;
  sortOrder?: ClientListSortOrder;
  name?: string;
}): Promise<ClientListInner> {
  const res = await backendRequest(
    `/api/v1/clients${clientsListQuery(params)}`,
    { method: "GET", withBearer: true },
  );
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientListInner };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}

export async function ASearchClientsPage(params: {
  q: string;
  page?: number;
  limit?: number;
}): Promise<ClientSearchListInner> {
  const res = await backendRequest(
    `/api/v1/clients/search${clientsSearchQuery(params)}`,
    { method: "GET", withBearer: true },
  );
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientSearchListInner };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}

export async function AFindClientById(id: string): Promise<ClientPublic | null> {
  const res = await backendRequest(
    `/api/v1/clients/${encodeURIComponent(id)}`,
    { method: "GET", withBearer: true },
  );
  const data: unknown = await res.json().catch(() => null);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientPublic };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}

export async function ACreateClient(body: CreateClientBody): Promise<ClientPublic> {
  const res = await backendRequest("/api/v1/clients", {
    method: "POST",
    body: JSON.stringify(body),
    withBearer: true,
  });
  const data: unknown = await res.json().catch(() => null);
  const ok = res.ok || res.status === 201;
  if (!ok) {
    throw ApiError.fromUnknown(data, res.status);
  }
  const envelope = data as { success?: boolean; data?: ClientPublic };
  if (envelope?.success !== true || !envelope.data) {
    throw ApiError.fromUnknown(data, res.status);
  }
  return envelope.data;
}
