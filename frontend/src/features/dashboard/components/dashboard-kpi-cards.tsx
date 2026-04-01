"use client";

import { DashboardInputCard } from "@/features/dashboard/components/dashboard-input-card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export type DashboardKpiItem = {
  title: string;
  value: number;
};

type Props = {
  items: DashboardKpiItem[];
  isLoading: boolean;
};

export function DashboardKpiCards({ items, isLoading }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <DashboardInputCard
          key={item.title}
          title={item.title}
          className="min-h-0"
          contentClassName="justify-center py-4"
        >
          {isLoading ? (
            <Skeleton className="h-9 w-24" aria-hidden />
          ) : (
            <p className="text-3xl font-semibold tabular-nums tracking-tight">
              {item.value.toLocaleString("pt-PT")}
            </p>
          )}
        </DashboardInputCard>
      ))}
    </div>
  );
}
