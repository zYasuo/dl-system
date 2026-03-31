"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ticketStatusLabel } from "@/features/tickets/lib/status-label";
import type { TicketPublic } from "@/lib/api/tickets-api";
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

function statusRow(status: TicketPublic["status"], total: number) {
  return {
    key: status,
    label: ticketStatusLabel(status),
    total,
    fill: `var(--color-${status})`,
  };
}

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
  total: {
    label: "Quantidade",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type Props = {
  open: number;
  inProgress: number;
  done: number;
};

export function TicketsBarChart({ open, inProgress, done }: Props) {
  const barData = [
    statusRow("OPEN", open),
    statusRow("IN_PROGRESS", inProgress),
    statusRow("DONE", done),
  ];

  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader>
        <CardTitle>Tickets por estado</CardTitle>
        <CardDescription>
          Contagens absolutas (mesmos totais dos cartões KPI, via{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            GET /tickets?status=
          </code>
          ).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
            accessibilityLayer
            data={barData}
            margin={{ left: 8, right: 8, top: 8, bottom: 4 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={32}
              allowDecimals={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {barData.map((row) => (
                <Cell key={row.key} fill={row.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
