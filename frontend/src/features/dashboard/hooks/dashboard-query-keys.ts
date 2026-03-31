export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  totalTickets: () => [...dashboardQueryKeys.all, "total"] as const,
  countByStatus: (status: "OPEN" | "IN_PROGRESS" | "DONE") =>
    [...dashboardQueryKeys.all, "count", status] as const,
  /** Últimos tickets por data de criação (amostra para gráfico temporal). */
  timelineSample: () => [...dashboardQueryKeys.all, "timeline-sample"] as const,
  /** Pré-visualização na visão geral (ordenado por atualização). */
  recentTicketsPreview: () =>
    [...dashboardQueryKeys.all, "recent-tickets-preview"] as const,
};
