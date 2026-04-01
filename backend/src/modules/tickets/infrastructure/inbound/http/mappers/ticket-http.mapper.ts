import { TicketEntity, TicketStatus } from 'src/modules/tickets/domain/entities/ticket.entity';

export type TicketPublicHttp = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
};

export function toTicketPublicHttp(ticket: TicketEntity): TicketPublicHttp {
  const { id, title, description, status, createdAt, updatedAt } = ticket;

  return {
    id: id,
    title: title,
    description: description.value,
    status: status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}
