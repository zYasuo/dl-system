"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import { contractStatusLabel } from "@/features/client-contracts/lib/status-label";
import type { ClientContractPublic } from "@/features/client-contracts/actions";
import { DashboardInputCard } from "@/features/dashboard/components/dashboard-input-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/shared/components/ui/chart";

function statusRow(status: ClientContractPublic["status"], total: number) {
  return {
    key: status,
    label: contractStatusLabel(status),
    total,
    fill: `var(--color-${status})`,
  };
}

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
  total: {
    label: "Quantidade",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

type Props = {
  active: number;
  expired: number;
  cancelled: number;
};

export function DashboardContractsHorizontalBarChart({
  active,
  expired,
  cancelled,
}: Props) {
  const barData = [
    statusRow("ACTIVE", active),
    statusRow("EXPIRED", expired),
    statusRow("CANCELLED", cancelled),
  ];

  const max = Math.max(1, ...barData.map((d) => d.total));

  return (
    <DashboardInputCard
      title="Quantidades por estado"
      description="Comparar totais de relance."
      contentClassName="min-h-[240px]"
    >
      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <BarChart
          accessibilityLayer
          layout="vertical"
          data={barData}
          margin={{ left: 4, right: 16, top: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis
            type="number"
            domain={[0, max]}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={88}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="total" radius={[0, 6, 6, 0]} barSize={22}>
            {barData.map((row) => (
              <Cell key={row.key} fill={row.fill} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </DashboardInputCard>
  );
}
