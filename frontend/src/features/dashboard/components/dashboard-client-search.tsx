"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { useClientsSearch } from "@/features/clients/hooks/use-clients-search";
import {
  clientDocumentLabel,
  clientSearchMatchLabel,
} from "@/features/clients/lib/display";
import { useDebouncedValue } from "@/shared/hooks/use-debounced-value";
import { ErrorAlert } from "@/shared/components/error-alert";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 300;

export function DashboardClientSearch() {
  const router = useRouter();
  const [rawQuery, setRawQuery] = useState("");
  const debouncedQuery = useDebouncedValue(rawQuery, DEBOUNCE_MS);
  const { data, isPending, isFetching, isError, error } =
    useClientsSearch(debouncedQuery);

  const rows = data?.data ?? [];
  const debouncedNonEmpty = debouncedQuery.trim().length > 0;
  const showEmpty =
    debouncedNonEmpty &&
    !isPending &&
    !isFetching &&
    !isError &&
    rows.length === 0;

  const showPanel =
    debouncedNonEmpty &&
    (isError || isPending || isFetching || showEmpty || rows.length > 0);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="dashboard-client-search"
          type="search"
          autoComplete="off"
          placeholder="Pesquisar clientes…"
          value={rawQuery}
          onChange={(e) => setRawQuery(e.target.value)}
          aria-label="Pesquisar clientes"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls="dashboard-client-search-results"
          className="h-11 w-full pl-11 text-base"
        />
      </div>

      {showPanel ? (
        <div
          id="dashboard-client-search-results"
          className="absolute left-0 right-0 top-full z-20 mt-1 rounded-md border border-border bg-card shadow-md ring-1 ring-foreground/10"
          role="region"
          aria-label="Resultados da pesquisa"
        >
          {isError ? (
            <div className="p-3">
              <ErrorAlert title="Erro na pesquisa" error={error} />
            </div>
          ) : null}

          {isPending && debouncedNonEmpty ? (
            <ul
              className="flex flex-col gap-2 p-3"
              aria-busy="true"
              aria-label="A carregar resultados"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-12 w-full rounded-md" />
                </li>
              ))}
            </ul>
          ) : null}

          {!isPending && showEmpty ? (
            <p className="p-3 text-sm text-muted-foreground">
              Nenhum cliente encontrado.
            </p>
          ) : null}

          {!isPending && rows.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto py-1 text-sm">
              {rows.map((row) => {
                const { client, match } = row;
                const doc = clientDocumentLabel(client);
                return (
                  <li key={client.id}>
                    <button
                      type="button"
                      className={cn(
                        "flex w-full flex-col gap-0.5 px-3 py-2.5 text-left",
                        "transition-colors hover:bg-sidebar-accent/60 focus-visible:bg-sidebar-accent/60 focus-visible:outline-none",
                      )}
                      onClick={() => {
                        router.push(
                          `/dashboard/clients/${encodeURIComponent(client.id)}`,
                        );
                      }}
                    >
                      <span className="font-medium text-foreground">
                        {client.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doc ?? "Sem documento"} ·{" "}
                        {clientSearchMatchLabel(match.kind, match.confidence)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
