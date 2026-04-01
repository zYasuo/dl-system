"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { useClientsList } from "@/features/clients/hooks/use-clients-list";
import { clientDocumentLabel } from "@/features/clients/lib/display";
import { buildPaginationItems } from "@/features/tickets/lib/pagination-page-items";
import { cn } from "@/lib/utils";
import { ErrorAlert } from "@/shared/components/error-alert";
import { EmptyState } from "@/shared/components/empty-state";
import { PageHeader } from "@/shared/components/page-header";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

const DEFAULT_LIMIT = 10;

export function ClientsListView() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error } = useClientsList(
    page,
    DEFAULT_LIMIT,
    { sortBy: "updatedAt", sortOrder: "desc" },
  );

  const clients = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 0;

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-5">
      <PageHeader
        title="Clientes"
        description="Lista paginada de clientes (GET /api/v1/clients)."
      />

      {isError ? (
        <ErrorAlert title="Não foi possível carregar os clientes" error={error} />
      ) : null}

      <Card size="sm">
        <CardHeader>
          <CardTitle>Registos</CardTitle>
          <CardDescription>
            {meta != null
              ? `${meta.total.toLocaleString("pt-PT")} cliente(s) no total.`
              : "A carregar…"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-0">
          {isPending ? (
            <div className="px-4 py-6">
              <Skeleton className="h-48 w-full" />
            </div>
          ) : clients.length === 0 ? (
            <div className="px-4 py-6">
              <EmptyState
                title="Sem clientes"
                description="Ainda não existem clientes na conta."
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden sm:table-cell">Documento</TableHead>
                  <TableHead className="hidden md:table-cell">Atualizado</TableHead>
                  <TableHead className="w-[100px] text-end">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {clientDocumentLabel(c) ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {formatDistanceToNow(new Date(c.updatedAt), {
                        addSuffix: true,
                        locale: pt,
                      })}
                    </TableCell>
                    <TableCell className="text-end">
                      <Link
                        href={`/dashboard/clients/${encodeURIComponent(c.id)}`}
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Detalhe
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isPending && totalPages > 1 ? (
            <div className="flex justify-center border-t border-border px-2 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      aria-disabled={page <= 1}
                      className={cn(page <= 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  {buildPaginationItems(page, totalPages).map((item, i) =>
                    item === "ellipsis" ? (
                      <PaginationItem key={`e-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href="#"
                          isActive={item === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(item);
                          }}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      aria-disabled={page >= totalPages}
                      className={cn(
                        page >= totalPages && "pointer-events-none opacity-50",
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
