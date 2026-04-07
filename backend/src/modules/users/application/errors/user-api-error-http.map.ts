import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from 'src/common/errors/application';
import { USER_API_ERROR_CODES } from './user-api-error-codes';

export const userApiErrorHttpMap: Record<
  (typeof USER_API_ERROR_CODES)[keyof typeof USER_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [USER_API_ERROR_CODES.EMAIL_ALREADY_EXISTS]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [USER_API_ERROR_CODES.NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
};
