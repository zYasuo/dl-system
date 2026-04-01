"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";
import { useClientContractsByClient } from "@/features/client-contracts/hooks/use-client-contracts-by-client";
import { contractStatusLabel } from "@/features/client-contracts/lib/status-label";
import { useClientDetail } from "@/features/clients/hooks/use-client-detail";
import { clientDocumentLabel } from "@/features/clients/lib/display";
import { formatClientAddress } from "@/features/clients/lib/format-address";
import { cn } from "@/lib/utils";
import { ErrorAlert } from "@/shared/components/error-alert";
import { PageHeader } from "@/shared/components/page-header";
import { Badge } from "@/shared/components/ui/badge";
import { buttonVariants } from "@/shared/components/ui/button-variants";
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

function contractEndDateLabel(endDate: unknown): string {
  if (typeof endDate === "string" && endDate.length > 0) return endDate;
  return "—";
}

export function ClientDetailView() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const clientQuery = useClientDetail(id);
  const contractsQuery = useClientContractsByClient(id);

  const client = clientQuery.data;
  const contracts = contractsQuery.data?.data ?? [];

  if (clientQuery.isPending) {
    return (
      <div className="flex w-full flex-col gap-5 px-3 py-4 sm:px-4 md:px-5">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full max-w-2xl" />
      </div>
    );
  }

  if (clientQuery.isError) {
    return (
      <div className="px-3 py-4 sm:px-4 md:px-5">
        <ErrorAlert title="Erro ao carregar cliente" error={clientQuery.error} />
      </div>
    );
  }

  if (client == null) {
    return (
      <div className="px-3 py-4 sm:px-4 md:px-5">
        <PageHeader title="Cliente não encontrado" />
        <Link
          href="/dashboard/clients"
          className={cn(buttonVariants({ variant: "link" }), "mt-2 px-0")}
        >
          Voltar à lista
        </Link>
      </div>
    );
  }

  const doc = clientDocumentLabel(client);

  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-5">
      <div>
        <Link
          href="/dashboard/clients"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-3 -ml-2 text-muted-foreground",
          )}
        >
          <ArrowLeft className="mr-1 size-4" aria-hidden />
          Clientes
        </Link>
        <PageHeader
          title={client.name}
          description={doc ?? "Cliente sem CPF/CNPJ na resposta."}
        />
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Dados</CardTitle>
          <CardDescription>Informação devolvida por GET /clients/:id</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Morada</p>
            <p>{formatClientAddress(client.address)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Criado</p>
            <p>
              {format(new Date(client.createdAt), "d MMMM yyyy, HH:mm", {
                locale: pt,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Atualizado</p>
            <p>
              {format(new Date(client.updatedAt), "d MMMM yyyy, HH:mm", {
                locale: pt,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Contratos</CardTitle>
          <CardDescription>
            Filtrados por clientId (GET /api/v1/client-contracts?clientId=…)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 sm:px-0">
          {contractsQuery.isPending ? (
            <div className="px-4 py-4">
              <Skeleton className="h-32 w-full" />
            </div>
          ) : contractsQuery.isError ? (
            <div className="px-4 py-4">
              <ErrorAlert title="Erro ao carregar contratos" error={contractsQuery.error} />
            </div>
          ) : contracts.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              Este cliente ainda não tem contratos associados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="hidden sm:table-cell">Início</TableHead>
                  <TableHead className="hidden sm:table-cell">Fim</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">
                      {c.contractNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {contractStatusLabel(c.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {c.startDate}
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground sm:table-cell">
                      {contractEndDateLabel(c.endDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
