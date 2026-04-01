"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AFetchClientContractsPage } from "@/features/client-contracts/actions";
import { AFetchClientsPage } from "@/features/clients/actions";
import { dashboardQueryKeys } from "./dashboard-query-keys";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function aggregateCreatedAtByDay(
  rows: { createdAt: string }[],
): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const t of rows) {
    const d = new Date(t.createdAt);
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function aggregateCreatedAtByMonth(
  rows: { createdAt: string }[],
): { month: string; count: number }[] {
  const map = new Map<string, number>();
  for (const t of rows) {
    const d = new Date(t.createdAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function countCreatedInLastDays(
  rows: { createdAt: string }[],
  days: number,
): number {
  const cutoff = Date.now() - days * MS_PER_DAY;
  let n = 0;
  for (const r of rows) {
    if (new Date(r.createdAt).getTime() >= cutoff) n += 1;
  }
  return n;
}

export function useDashboardBusinessStats() {
  const countQueries = useQueries({
    queries: [
      {
        queryKey: dashboardQueryKeys.totalClients(),
        queryFn: () => AFetchClientsPage({ page: 1, limit: 1 }),
        select: (data: Awaited<ReturnType<typeof AFetchClientsPage>>) =>
          data.meta.total,
      },
      {
        queryKey: dashboardQueryKeys.contractCount("ACTIVE"),
        queryFn: () =>
          AFetchClientContractsPage({
            page: 1,
            limit: 1,
            status: "ACTIVE",
          }),
        select: (data: Awaited<ReturnType<typeof AFetchClientContractsPage>>) =>
          data.meta.total,
      },
      {
        queryKey: dashboardQueryKeys.contractCount("EXPIRED"),
        queryFn: () =>
          AFetchClientContractsPage({
            page: 1,
            limit: 1,
            status: "EXPIRED",
          }),
        select: (data: Awaited<ReturnType<typeof AFetchClientContractsPage>>) =>
          data.meta.total,
      },
      {
        queryKey: dashboardQueryKeys.contractCount("CANCELLED"),
        queryFn: () =>
          AFetchClientContractsPage({
            page: 1,
            limit: 1,
            status: "CANCELLED",
          }),
        select: (data: Awaited<ReturnType<typeof AFetchClientContractsPage>>) =>
          data.meta.total,
      },
    ],
  });

  const clientsSampleQuery = useQuery({
    queryKey: dashboardQueryKeys.clientsTimelineSample(),
    queryFn: () =>
      AFetchClientsPage({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    select: (data) => {
      const rows = data.data;
      return {
        timeline: aggregateCreatedAtByDay(rows),
        inLast30d: countCreatedInLastDays(rows, 30),
        sampleSize: rows.length,
      };
    },
  });

  const contractsSampleQuery = useQuery({
    queryKey: dashboardQueryKeys.contractsTimelineSample(),
    queryFn: () =>
      AFetchClientContractsPage({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    select: (data) => {
      const rows = data.data;
      return {
        monthly: aggregateCreatedAtByMonth(rows),
        inLast30d: countCreatedInLastDays(rows, 30),
        sampleSize: rows.length,
      };
    },
  });

  const [totalClientsQ, activeQ, expiredQ, cancelledQ] = countQueries;

  const isLoading =
    countQueries.some((q) => q.isPending) ||
    clientsSampleQuery.isPending ||
    contractsSampleQuery.isPending;

  const isError =
    countQueries.some((q) => q.isError) ||
    clientsSampleQuery.isError ||
    contractsSampleQuery.isError;

  const stats = useMemo(() => {
    const cs = clientsSampleQuery.data;
    const ct = contractsSampleQuery.data;
    return {
      totalClients: totalClientsQ.data ?? 0,
      activeContracts: activeQ.data ?? 0,
      expiredContracts: expiredQ.data ?? 0,
      cancelledContracts: cancelledQ.data ?? 0,
      clientsTimeline: cs?.timeline ?? [],
      contractsMonthly: ct?.monthly ?? [],
      clientsInLast30d: cs?.inLast30d ?? 0,
      clientsSampleSize: cs?.sampleSize ?? 0,
      contractsInLast30d: ct?.inLast30d ?? 0,
      contractsSampleSize: ct?.sampleSize ?? 0,
    };
  }, [
    totalClientsQ.data,
    activeQ.data,
    expiredQ.data,
    cancelledQ.data,
    clientsSampleQuery.data,
    contractsSampleQuery.data,
  ]);

  return {
    ...stats,
    isLoading,
    isError,
  };
}
