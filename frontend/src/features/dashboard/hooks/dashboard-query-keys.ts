export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  totalClients: () => [...dashboardQueryKeys.all, "total-clients"] as const,
  contractCount: (status: "ACTIVE" | "EXPIRED" | "CANCELLED") =>
    [...dashboardQueryKeys.all, "contracts", status] as const,
  clientsTimelineSample: () =>
    [...dashboardQueryKeys.all, "clients-timeline-sample"] as const,
  contractsTimelineSample: () =>
    [...dashboardQueryKeys.all, "contracts-timeline-sample"] as const,
  recentClientsPreview: () =>
    [...dashboardQueryKeys.all, "recent-clients-preview"] as const,
  recentContractsPreview: () =>
    [...dashboardQueryKeys.all, "recent-contracts-preview"] as const,
};
