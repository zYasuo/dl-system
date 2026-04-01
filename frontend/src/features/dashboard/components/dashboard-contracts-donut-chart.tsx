"use client";

import { LabelList, Pie, PieChart } from "recharts";
import { contractStatusLabel } from "@/features/client-contracts/lib/status-label";
import { DashboardInputCard } from "@/features/dashboard/components/dashboard-input-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

const chartConfig = {
  ACTIVE: {
    label: contractStatusLabel("ACTIVE"),
    color: "var(--chart-1)",
  },
  EXPIRED: {
    label: contractStatusLabel("EXPIRED"),
    color: "var(--chart-2)",
  },
  CANCELLED: {
    label: contractStatusLabel("CANCELLED"),
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type Props = {
  active: number;
  expired: number;
  cancelled: number;
};

export function DashboardContractsDonutChart({
  active,
  expired,
  cancelled,
}: Props) {
  const raw = [
    { status: "ACTIVE" as const, count: active },
    { status: "EXPIRED" as const, count: expired },
    { status: "CANCELLED" as const, count: cancelled },
  ];

  const pieData = raw
    .filter((d) => d.count > 0)
    .map((d) => ({
      status: d.status,
      count: d.count,
      fill: `var(--color-${d.status})`,
    }));

  const total = active + expired + cancelled;

  return (
    <DashboardInputCard
      title="Contratos por estado"
      badge={total > 0 ? `(${total.toLocaleString("pt-PT")})` : undefined}
      description="Ativos, expirados e cancelados."
      contentClassName="min-h-[240px]"
    >
      {total === 0 ? (
        <p className="text-sm text-muted-foreground">
          Ainda não há contratos para mostrar.
        </p>
      ) : (
        <div className="grid flex-1 grid-cols-1 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,auto)]">
          <div className="relative mx-auto aspect-square w-full max-w-[220px]">
            <ChartContainer
              config={chartConfig}
              className="aspect-square h-full w-full"
            >
              <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius="62%"
                  outerRadius="92%"
                  strokeWidth={2}
                  stroke="var(--background)"
                  paddingAngle={2}
                >
                  <LabelList
                    dataKey="count"
                    className="fill-foreground"
                    stroke="none"
                    fontSize={11}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-semibold tabular-nums leading-none">
                  {total.toLocaleString("pt-PT")}
                </p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Total
                </p>
              </div>
            </div>
          </div>
          <ul className="flex flex-col gap-2 text-xs" aria-label="Legenda">
            {raw.map((row) => (
              <li
                key={row.status}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-2 py-1.5"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="size-2.5 shrink-0 rounded-sm"
                    style={{
                      background: `var(--color-${row.status})`,
                    }}
                    aria-hidden
                  />
                  <span className="truncate">
                    {chartConfig[row.status].label}
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {row.count.toLocaleString("pt-PT")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardInputCard>
  );
}
