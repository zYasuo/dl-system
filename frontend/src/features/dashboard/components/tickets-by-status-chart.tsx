"use client";

import { LabelList, Pie, PieChart } from "recharts";
import { ticketStatusLabel } from "@/features/tickets/lib/status-label";
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
  OPEN: {
    label: ticketStatusLabel("OPEN"),
    color: "var(--chart-1)",
  },
  IN_PROGRESS: {
    label: ticketStatusLabel("IN_PROGRESS"),
    color: "var(--chart-2)",
  },
  DONE: {
    label: ticketStatusLabel("DONE"),
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type Props = {
  open: number;
  inProgress: number;
  done: number;
};

export function TicketsByStatusChart({ open, inProgress, done }: Props) {
  const raw = [
    { status: "OPEN" as const, count: open },
    { status: "IN_PROGRESS" as const, count: inProgress },
    { status: "DONE" as const, count: done },
  ];

  const pieData = raw
    .filter((d) => d.count > 0)
    .map((d) => ({
      status: d.status,
      count: d.count,
      fill: `var(--color-${d.status})`,
    }));

  const total = open + inProgress + done;

  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader>
        <CardTitle>Distribuição por estado</CardTitle>
        <CardDescription>
          Proporção de tickets Aberto / Em progresso / Concluído (totais da API).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pb-4">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sem tickets para mostrar neste gráfico.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[280px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pieData}
                dataKey="count"
                nameKey="status"
                innerRadius={52}
                outerRadius={86}
                strokeWidth={2}
                stroke="var(--background)"
              >
                <LabelList
                  dataKey="count"
                  className="fill-foreground"
                  stroke="none"
                  fontSize={12}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
