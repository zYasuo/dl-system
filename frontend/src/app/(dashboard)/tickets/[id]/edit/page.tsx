import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { TicketEditForm } from "@/features/tickets/components/ticket-edit-form";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button-variants";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditTicketPage({ params }: Props) {
  const { id } = await params;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 sm:px-4 md:px-5 xl:max-w-7xl">
      <header className="border-b border-border/80 pb-5">
        <Link
          href="/dashboard/tickets"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-3 h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeftIcon className="size-4 shrink-0" aria-hidden />
          Voltar aos chamados
        </Link>
        <div className="space-y-1.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Editar chamado
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Atualiza título, descrição e estado. As alterações passam a contar na lista e na
            visão geral depois de guardares.
          </p>
        </div>
      </header>

      <TicketEditForm ticketId={id} />
    </div>
  );
}
