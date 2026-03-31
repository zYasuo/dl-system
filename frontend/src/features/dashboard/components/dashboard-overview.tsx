"use client";

import { AlertCircle } from "lucide-react";
import { useDashboardStats } from "@/features/dashboard/hooks/use-dashboard-stats";
import { DashboardKpiCards } from "@/features/dashboard/components/dashboard-kpi-cards";
import { DashboardRecentTickets } from "@/features/dashboard/components/dashboard-recent-tickets";
import { TicketsBarChart } from "@/features/dashboard/components/tickets-bar-chart";
import { TicketsByStatusChart } from "@/features/dashboard/components/tickets-by-status-chart";
import { TicketsTimelineChart } from "@/features/dashboard/components/tickets-timeline-chart";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { PageHeader } from "@/shared/components/page-header";

export function DashboardOverview() {
  const {
    total,
    open,
    inProgress,
    done,
    timeline,
    isLoading,
    isError,
  } = useDashboardStats();

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-5">
      <PageHeader
        title="Visão geral"
        description="Resumo dos seus tickets e tendências (dados da API com agregação no cliente onde aplicável)."
      />

      {isError ? (
        <Alert variant="destructive">
          <AlertCircle className="size-4" aria-hidden />
          <AlertTitle>Erro ao carregar métricas</AlertTitle>
          <AlertDescription>
            Não foi possível obter os dados do painel. Verifique a sessão e se o
            backend está a correr.
          </AlertDescription>
        </Alert>
      ) : null}

      <DashboardKpiCards
        total={total}
        open={open}
        inProgress={inProgress}
        done={done}
        isLoading={isLoading}
      />

      <DashboardRecentTickets />

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <TicketsByStatusChart
          open={open}
          inProgress={inProgress}
          done={done}
        />
        <TicketsBarChart open={open} inProgress={inProgress} done={done} />
      </div>

      <TicketsTimelineChart data={timeline} />
    </div>
  );
}
