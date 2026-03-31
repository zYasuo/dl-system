"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { AFetchTicketsPage } from "@/features/tickets/actions";
import { dashboardQueryKeys } from "./dashboard-query-keys";

function aggregateCreatedAtByDay(
  tickets: { createdAt: string }[],
): { date: string; count: number }[] {
  const map = new Map<string, number>();
  for (const t of tickets) {
    const d = new Date(t.createdAt);
    const key = d.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Métricas do dashboard: totais por status (API real) e série temporal a partir
 * da última página de tickets (máx. 100 itens — limite do backend).
 *
 * TODO: quando existir GET /api/v1/tickets/metrics (ou similar), substituir a
 * query de timeline por dados agregados no servidor.
 */
export function useDashboardStats() {
  const countQueries = useQueries({
    queries: [
      {
        queryKey: dashboardQueryKeys.totalTickets(),
        queryFn: () => AFetchTicketsPage({ page: 1, limit: 1 }),
        select: (data: Awaited<ReturnType<typeof AFetchTicketsPage>>) =>
          data.meta.total,
      },
      {
        queryKey: dashboardQueryKeys.countByStatus("OPEN"),
        queryFn: () =>
          AFetchTicketsPage({ page: 1, limit: 1, status: "OPEN" }),
        select: (data: Awaited<ReturnType<typeof AFetchTicketsPage>>) =>
          data.meta.total,
      },
      {
        queryKey: dashboardQueryKeys.countByStatus("IN_PROGRESS"),
        queryFn: () =>
          AFetchTicketsPage({ page: 1, limit: 1, status: "IN_PROGRESS" }),
        select: (data: Awaited<ReturnType<typeof AFetchTicketsPage>>) =>
          data.meta.total,
      },
      {
        queryKey: dashboardQueryKeys.countByStatus("DONE"),
        queryFn: () =>
          AFetchTicketsPage({ page: 1, limit: 1, status: "DONE" }),
        select: (data: Awaited<ReturnType<typeof AFetchTicketsPage>>) =>
          data.meta.total,
      },
    ],
  });

  const timelineQuery = useQuery({
    queryKey: dashboardQueryKeys.timelineSample(),
    queryFn: () =>
      AFetchTicketsPage({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
    select: (data) => aggregateCreatedAtByDay(data.data),
  });

  const [totalQ, openQ, inProgressQ, doneQ] = countQueries;

  const isLoading =
    countQueries.some((q) => q.isPending) || timelineQuery.isPending;

  const isError =
    countQueries.some((q) => q.isError) || timelineQuery.isError;

  const stats = useMemo(
    () => ({
      total: totalQ.data ?? 0,
      open: openQ.data ?? 0,
      inProgress: inProgressQ.data ?? 0,
      done: doneQ.data ?? 0,
      timeline: timelineQuery.data ?? [],
    }),
    [
      totalQ.data,
      openQ.data,
      inProgressQ.data,
      doneQ.data,
      timelineQuery.data,
    ],
  );

  return {
    ...stats,
    isLoading,
    isError,
  };
}
