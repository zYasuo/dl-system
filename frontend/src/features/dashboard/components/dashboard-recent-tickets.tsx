"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { useDashboardRecentTickets } from "@/features/dashboard/hooks/use-dashboard-recent-tickets";
import { ticketCode } from "@/features/tickets/lib/ticket-code";
import { ticketStatusLabel } from "@/features/tickets/lib/status-label";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button-variants";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";

function statusBadgeClass(status: "OPEN" | "IN_PROGRESS" | "DONE"): string {
  switch (status) {
    case "OPEN":
      return "border-border bg-muted/40 text-muted-foreground";
    case "IN_PROGRESS":
      return "border-primary/30 bg-primary/10 text-primary";
    case "DONE":
      return "border-border bg-secondary text-secondary-foreground";
    default:
      return "";
  }
}

export function DashboardRecentTickets() {
  const { data, isPending, isError } = useDashboardRecentTickets();
  const tickets = data?.data ?? [];

  return (
    <Card size="sm" className="flex flex-col">
      <CardHeader>
        <CardTitle>Chamados recentes</CardTitle>
        <CardDescription>
          Os tickets que mudaram mais recentemente — toca numa linha para abrir.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {isError ? (
          <p className="px-4 text-sm text-muted-foreground">
            Não foi possível carregar a lista. Tenta a página{" "}
            <Link href="/dashboard/tickets" className="text-primary underline-offset-4 hover:underline">
              Tickets
            </Link>
            .
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
        ) : tickets.length === 0 ? (
          <p className="px-4 text-sm text-muted-foreground">
            Ainda não tens tickets.{" "}
            <Link href="/dashboard/tickets/new" className="text-primary underline-offset-4 hover:underline">
              Criar o primeiro
            </Link>
            .
          </p>
        ) : (
          <ul className="text-sm" aria-label="Lista de chamados recentes">
            {tickets.map((ticket, index) => (
              <li key={ticket.id}>
                {index > 0 ? <Separator className="my-0" /> : null}
                <Link
                  href={`/dashboard/tickets/${encodeURIComponent(ticket.id)}/edit`}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors",
                    "hover:bg-sidebar-accent/60 focus-visible:bg-sidebar-accent/60 focus-visible:outline-none",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {ticketCode(ticket.id)}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("font-normal", statusBadgeClass(ticket.status))}
                      >
                        {ticketStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 font-medium text-foreground">
                      {ticket.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Atualizado{" "}
                      {formatDistanceToNow(new Date(ticket.updatedAt), {
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
      </CardContent>
      {!isPending && !isError && tickets.length > 0 ? (
        <CardFooter className="border-t border-border/80 bg-muted/20 py-3">
          <Link
            href="/dashboard/tickets"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "w-full justify-between text-muted-foreground hover:text-foreground",
            )}
          >
            Ver todos os tickets
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  );
}
