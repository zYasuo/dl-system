import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { TICKET_REPOSITORY } from '../../di.tokens';
import type { TicketRepositoryPort } from '../../domain/ports/repository/ticket.repository.port';
import { TicketEntity } from '../../domain/entities/ticket.entity';
import { TICKET_API_ERROR_CODES } from '../errors';

@Injectable()
export class FindTicketByIdUseCase {
  constructor(@Inject(TICKET_REPOSITORY) private readonly ticketRepository: TicketRepositoryPort) {}

  async execute(ticketId: string, userUuid: string): Promise<TicketEntity> {
    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new ApplicationException(TICKET_API_ERROR_CODES.NOT_FOUND, 'Ticket not found');
    }
    if (ticket.userId !== userUuid) {
      throw new ApplicationException(TICKET_API_ERROR_CODES.ACCESS_DENIED, 'Forbidden');
    }
    return ticket;
  }
}
