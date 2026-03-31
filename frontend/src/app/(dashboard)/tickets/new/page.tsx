import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { TicketCreateForm } from "@/features/tickets/components/ticket-create-form";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/shared/components/ui/button-variants";

export default function NewTicketPage() {
  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-5">
      <div className="min-w-0 space-y-3">
        <Link
          href="/dashboard/tickets"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-8 gap-1.5 px-2 text-muted-foreground hover:text-foreground",
          )}
        >
          <ArrowLeftIcon className="size-4 shrink-0" aria-hidden />
          Voltar aos chamados
        </Link>
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
            Novo chamado
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Preenche título e descrição; podes ajustar o estado mais tarde na edição.
          </p>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <TicketCreateForm />
      </div>
    </div>
  );
}
