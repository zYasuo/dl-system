import { HttpStatus } from '@nestjs/common';
import type { ApplicationErrorHttpMeta } from 'src/common/errors/application';
import { LOCATION_API_ERROR_CODES } from './location-api-error-codes';

export const locationApiErrorHttpMap: Record<
  (typeof LOCATION_API_ERROR_CODES)[keyof typeof LOCATION_API_ERROR_CODES],
  ApplicationErrorHttpMeta
> = {
  [LOCATION_API_ERROR_CODES.COUNTRY_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [LOCATION_API_ERROR_CODES.COUNTRY_REFERENCED]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [LOCATION_API_ERROR_CODES.PARENT_COUNTRY_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [LOCATION_API_ERROR_CODES.STATE_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [LOCATION_API_ERROR_CODES.STATE_REFERENCED]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [LOCATION_API_ERROR_CODES.PARENT_STATE_INVALID]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [LOCATION_API_ERROR_CODES.CITY_NOT_FOUND]: {
    statusCode: HttpStatus.NOT_FOUND,
    error: 'Not Found',
  },
  [LOCATION_API_ERROR_CODES.CITY_REFERENCED]: {
    statusCode: HttpStatus.CONFLICT,
    error: 'Conflict',
  },
  [LOCATION_API_ERROR_CODES.GEO_CITY_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [LOCATION_API_ERROR_CODES.GEO_CITY_STATE_MISMATCH]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
  [LOCATION_API_ERROR_CODES.GEO_STATE_CODE_REQUIRED]: {
    statusCode: HttpStatus.BAD_REQUEST,
    error: 'Bad Request',
  },
};
