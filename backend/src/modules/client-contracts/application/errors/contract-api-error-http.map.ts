import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from 'src/common/errors/application';
import { CONTRACT_API_ERROR_CODES } from './contract-api-error-codes';

export const contractApiErrorHttpMap: Record<
  (typeof CONTRACT_API_ERROR_CODES)[keyof typeof CONTRACT_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [CONTRACT_API_ERROR_CODES.NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [CONTRACT_API_ERROR_CODES.CLIENT_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [CONTRACT_API_ERROR_CODES.INVALID_DATA]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
};
