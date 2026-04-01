"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { useDashboardRecentContracts } from "@/features/dashboard/hooks/use-dashboard-recent-contracts";
import { DashboardInputCard } from "@/features/dashboard/components/dashboard-input-card";
import { contractStatusLabel } from "@/features/client-contracts/lib/status-label";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

function statusBadgeClass(
  status: "ACTIVE" | "EXPIRED" | "CANCELLED",
): string {
  switch (status) {
    case "ACTIVE":
      return "border-primary/30 bg-primary/10 text-primary";
    case "EXPIRED":
      return "border-border bg-muted/40 text-muted-foreground";
    case "CANCELLED":
      return "border-border bg-secondary text-secondary-foreground";
    default:
      return "";
  }
}

export function DashboardRecentContracts() {
  const { data, isPending, isError } = useDashboardRecentContracts();
  const contracts = data?.data ?? [];

  return (
    <DashboardInputCard
      title="Contratos recentes"
      description="Toca para ver o cliente."
      className="min-h-[280px]"
      contentClassName="gap-0 px-0 sm:px-0"
    >
      {isError ? (
        <p className="px-4 text-sm text-muted-foreground">
          Não foi possível carregar os contratos.
        </p>
      ) : isPending ? (
        <ul className="flex flex-col gap-0 px-4" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="py-3">
              <Skeleton className="h-4 w-full max-w-xs" />
              <Skeleton className="mt-2 h-3 w-24" />
            </li>
          ))}
        </ul>
      ) : contracts.length === 0 ? (
        <p className="px-4 text-sm text-muted-foreground">
          Ainda não há contratos registados.
        </p>
      ) : (
        <ul className="text-sm" aria-label="Lista de contratos recentes">
          {contracts.map((c, index) => (
            <li key={c.id}>
              {index > 0 ? <Separator className="my-0" /> : null}
              <Link
                href={`/dashboard/clients/${encodeURIComponent(c.clientId)}`}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 transition-colors",
                  "hover:bg-sidebar-accent/60 focus-visible:bg-sidebar-accent/60 focus-visible:outline-none",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {c.contractNumber}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-normal",
                        statusBadgeClass(c.status),
                      )}
                    >
                      {contractStatusLabel(c.status)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Atualizado{" "}
                    {formatDistanceToNow(new Date(c.updatedAt), {
                      addSuffix: true,
                      locale: pt,
                    })}
                  </p>
                </div>
                <ChevronRight
                  className="mt-1 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </DashboardInputCard>
  );
}
