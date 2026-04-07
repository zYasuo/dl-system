import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from 'src/common/errors/application';
import { CLIENT_API_ERROR_CODES } from './client-api-error-codes';

export const clientApiErrorHttpMap: Record<
  (typeof CLIENT_API_ERROR_CODES)[keyof typeof CLIENT_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [CLIENT_API_ERROR_CODES.NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [CLIENT_API_ERROR_CODES.CPF_ALREADY_REGISTERED]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [CLIENT_API_ERROR_CODES.CNPJ_ALREADY_REGISTERED]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [CLIENT_API_ERROR_CODES.DUPLICATE_DOCUMENT]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [CLIENT_API_ERROR_CODES.INVALID_DATA]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
};
