import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from 'src/common/errors/application';
import { TICKET_API_ERROR_CODES } from './ticket-api-error-codes';

export const ticketApiErrorHttpMap: Record<
  (typeof TICKET_API_ERROR_CODES)[keyof typeof TICKET_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [TICKET_API_ERROR_CODES.NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [TICKET_API_ERROR_CODES.ACCESS_DENIED]: {
    statusCode: HttpStatus.FORBIDDEN,
    error: 'Forbidden',
  },
  [TICKET_API_ERROR_CODES.INVALID_VERSION]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [TICKET_API_ERROR_CODES.USER_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
};
