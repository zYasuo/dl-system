"use client";

import { format, parse } from "date-fns";
import { pt } from "date-fns/locale";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardInputCard } from "@/features/dashboard/components/dashboard-input-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

const chartConfig = {
  count: {
    label: "Contratos",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

type Point = { month: string; count: number };

type Props = {
  data: Point[];
};

function monthLabel(month: string): string {
  try {
    const d = parse(`${month}-01`, "yyyy-MM-dd", new Date());
    return format(d, "MMM yy", { locale: pt });
  } catch {
    return month;
  }
}

export function DashboardContractsMonthlyLineChart({ data }: Props) {
  return (
    <DashboardInputCard
      title="Contratos ao longo do tempo"
      description="Tendência mensal, com base nos registos mais recentes."
      contentClassName="min-h-[260px]"
    >
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Ainda não há dados suficientes para o gráfico.
        </p>
      ) : (
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 8, right: 8, top: 12, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => monthLabel(String(value))}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const row = payload?.[0]?.payload as Point | undefined;
                    return row?.month ? monthLabel(row.month) : "";
                  }}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--color-count)" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </DashboardInputCard>
  );
}
