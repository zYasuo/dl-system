"use client";

import { format, parseISO } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

const chartConfig = {
  count: {
    label: "Tickets criados",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Point = { date: string; count: number };

type Props = {
  data: Point[];
};

export function TicketsTimelineChart({ data }: Props) {
  const chartData = data;

  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader>
        <CardTitle>Criações ao longo do tempo</CardTitle>
        <CardDescription>
          Agregação por dia (UTC) sobre os últimos tickets devolvidos pela API
          (até 100 registos).{" "}
          <span className="text-xs text-muted-foreground">
            TODO: substituir por endpoint de métricas quando existir.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem dados temporais nesta amostra.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 8, right: 8, top: 8, bottom: 4 }}
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
              <Area
                dataKey="count"
                type="monotone"
                fill="var(--color-count)"
                fillOpacity={0.35}
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
