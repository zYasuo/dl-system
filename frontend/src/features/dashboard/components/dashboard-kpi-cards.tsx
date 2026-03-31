"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type Props = {
  total: number;
  open: number;
  inProgress: number;
  done: number;
  isLoading: boolean;
};

export function DashboardKpiCards({
  total,
  open,
  inProgress,
  done,
  isLoading,
}: Props) {
  const items = [
    { title: "Total de tickets", value: total },
    { title: "Abertos", value: open },
    { title: "Em progresso", value: inProgress },
    { title: "Concluídos", value: done },
  ] as const;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title} size="sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-9 w-20" aria-hidden />
            ) : (
              <p className="text-3xl font-semibold tabular-nums tracking-tight">
                {item.value.toLocaleString("pt-PT")}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
