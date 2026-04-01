"use client";

import { useDashboardBusinessStats } from "@/features/dashboard/hooks/use-dashboard-business-stats";
import { DashboardActivityRadials } from "@/features/dashboard/components/dashboard-activity-radials";
import { DashboardClientSearch } from "@/features/dashboard/components/dashboard-client-search";
import { DashboardClientsLineChart } from "@/features/dashboard/components/dashboard-clients-line-chart";
import { DashboardContractsDonutChart } from "@/features/dashboard/components/dashboard-contracts-donut-chart";
import { DashboardContractsHorizontalBarChart } from "@/features/dashboard/components/dashboard-contracts-horizontal-bar-chart";
import { DashboardContractsMonthlyLineChart } from "@/features/dashboard/components/dashboard-contracts-monthly-line-chart";
import { DashboardKpiCards } from "@/features/dashboard/components/dashboard-kpi-cards";
import { DashboardRecentClients } from "@/features/dashboard/components/dashboard-recent-clients";
import { DashboardRecentContracts } from "@/features/dashboard/components/dashboard-recent-contracts";

export function DashboardOverview() {
  const {
    totalClients,
    activeContracts,
    expiredContracts,
    cancelledContracts,
    clientsTimeline,
    contractsMonthly,
    clientsInLast30d,
    clientsSampleSize,
    contractsInLast30d,
    contractsSampleSize,
    isLoading,
  } = useDashboardBusinessStats();

  const kpiItems = [
    { title: "Total de clientes", value: totalClients },
    { title: "Contratos ativos", value: activeContracts },
    { title: "Contratos expirados", value: expiredContracts },
    { title: "Contratos cancelados", value: cancelledContracts },
  ] as const;

  return (
    <div className="flex w-full flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-4 md:px-5">
      <DashboardClientSearch />

      <DashboardKpiCards items={[...kpiItems]} isLoading={isLoading} />

      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardContractsDonutChart
          active={activeContracts}
          expired={expiredContracts}
          cancelled={cancelledContracts}
        />
        <DashboardContractsHorizontalBarChart
          active={activeContracts}
          expired={expiredContracts}
          cancelled={cancelledContracts}
        />
        <DashboardActivityRadials
          clientsInLast30d={clientsInLast30d}
          clientsSampleSize={clientsSampleSize}
          contractsInLast30d={contractsInLast30d}
          contractsSampleSize={contractsSampleSize}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DashboardClientsLineChart data={clientsTimeline} />
        <DashboardContractsMonthlyLineChart data={contractsMonthly} />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <DashboardRecentClients />
        <DashboardRecentContracts />
      </div>
    </div>
  );
}
