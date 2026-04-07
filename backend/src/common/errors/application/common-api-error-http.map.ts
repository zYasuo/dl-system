import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from './application-error-http.types';
import { COMMON_API_ERROR_CODES } from './common-api-error-codes';

export const commonApiErrorHttpMap: Record<
  (typeof COMMON_API_ERROR_CODES)[keyof typeof COMMON_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [COMMON_API_ERROR_CODES.CONFLICT]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [COMMON_API_ERROR_CODES.DOMAIN_VALIDATION_FAILED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [COMMON_API_ERROR_CODES.UNAUTHORIZED]: {
    statusCode: HttpStatus.UNAUTHORIZED,
    error: 'Unauthorized',
  },
  [COMMON_API_ERROR_CODES.RATE_LIMITED]: {
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    error: 'Too Many Requests',
  },
  [COMMON_API_ERROR_CODES.VALIDATION_FAILED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
};
