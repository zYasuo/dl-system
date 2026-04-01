import { TicketsList } from "@/features/tickets/components/tickets-list";

export default function TicketsPage() {
  return (
    <div className="flex w-full flex-col gap-5 px-3 py-4 sm:gap-6 sm:px-4 md:px-5">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
        Chamados
      </h1>
      <TicketsList />
    </div>
  );
}
