"use client";

import { DashboardInputCard } from "@/features/dashboard/components/dashboard-input-card";
import { ChartContainer, type ChartConfig } from "@/shared/components/ui/chart";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

const chartConfig = {
  clients: { label: "Clientes", color: "var(--chart-1)" },
  contracts: { label: "Contratos", color: "var(--chart-2)" },
} satisfies ChartConfig;

type Props = {
  clientsInLast30d: number;
  clientsSampleSize: number;
  contractsInLast30d: number;
  contractsSampleSize: number;
};

function semiGaugeData(percent: number, fill: string) {
  const v = Math.min(100, Math.max(0, percent));
  return [{ name: "p", value: v, fill }];
}

function SemiGauge({
  dataKey,
  percent,
  centerValue,
  kindLabel,
}: {
  dataKey: "clients" | "contracts";
  percent: number;
  centerValue: number;
  kindLabel: string;
}) {
  const fillVar =
    dataKey === "clients" ? "var(--color-clients)" : "var(--color-contracts)";

  return (
    <div className="flex flex-1 flex-col items-center">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[130px] w-full max-w-[180px]"
      >
        <RadialBarChart
          data={semiGaugeData(percent, fillVar)}
          innerRadius="55%"
          outerRadius="100%"
          startAngle={180}
          endAngle={0}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-transparent"
          />
          <RadialBar dataKey="value" cornerRadius={6} background />
        </RadialBarChart>
      </ChartContainer>
      <p className="-mt-2 text-xl font-semibold tabular-nums leading-none">
        {centerValue.toLocaleString("pt-PT")}
      </p>
      <p className="mt-2 text-center text-sm font-medium text-foreground">
        {kindLabel}
      </p>
      <p className="mt-0.5 text-center text-xs text-muted-foreground">
        Últimos 30 dias
      </p>
    </div>
  );
}

export function DashboardActivityRadials({
  clientsInLast30d,
  clientsSampleSize,
  contractsInLast30d,
  contractsSampleSize,
}: Props) {
  const clientsPct =
    clientsSampleSize > 0
      ? Math.round((100 * clientsInLast30d) / clientsSampleSize)
      : 0;
  const contractsPct =
    contractsSampleSize > 0
      ? Math.round((100 * contractsInLast30d) / contractsSampleSize)
      : 0;

  return (
    <DashboardInputCard
      title="Actividade recente"
      description="Novos clientes e contratos criados nos últimos 30 dias."
      contentClassName="min-h-[240px] justify-center"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
        <SemiGauge
          dataKey="clients"
          percent={clientsPct}
          centerValue={clientsInLast30d}
          kindLabel="Novos clientes"
        />
        <SemiGauge
          dataKey="contracts"
          percent={contractsPct}
          centerValue={contractsInLast30d}
          kindLabel="Novos contratos"
        />
      </div>
    </DashboardInputCard>
  );
}
