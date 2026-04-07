import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from 'src/common/errors/application';
import { AUTH_API_ERROR_CODES } from './auth-api-error-codes';

export const authApiErrorHttpMap: Record<
  (typeof AUTH_API_ERROR_CODES)[keyof typeof AUTH_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [AUTH_API_ERROR_CODES.INVALID_CREDENTIALS]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    error: 'Unauthorized',
  },
  [AUTH_API_ERROR_CODES.EMAIL_NOT_VERIFIED]: {
    statusCode: HttpStatus.FORBIDDEN,
    error: 'Forbidden',
  },
  [AUTH_API_ERROR_CODES.ACCOUNT_LOCKED]: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    error: 'Too Many Requests',
  },
  [AUTH_API_ERROR_CODES.INVALID_REFRESH_TOKEN]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    error: 'Unauthorized',
  },
  [AUTH_API_ERROR_CODES.VERIFICATION_FAILED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [AUTH_API_ERROR_CODES.INVALID_RESET_TOKEN]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
};
