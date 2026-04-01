"use client";

import { format, parseISO } from "date-fns";
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
    label: "Clientes",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Point = { date: string; count: number };

type Props = {
  data: Point[];
};

export function DashboardClientsLineChart({ data }: Props) {
  return (
    <DashboardInputCard
      title="Novos clientes ao longo do tempo"
      description="Por dia, com base nos registos mais recentes."
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                try {
                  return format(parseISO(String(value)), "d MMM", {
                    locale: pt,
                  });
                } catch {
                  return String(value);
                }
              }}
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
                    if (!row?.date) return "";
                    try {
                      return format(parseISO(row.date), "d MMMM yyyy", {
                        locale: pt,
                      });
                    } catch {
                      return row.date;
                    }
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
