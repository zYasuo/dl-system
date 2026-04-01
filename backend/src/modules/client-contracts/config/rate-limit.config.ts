import {
  rateLimitEntryFromEnv,
  type RateLimitEntry,
} from '../../../common/rate-limit/rate-limit-env';

export type ClientContractsRateLimitKey =
  | 'client-contracts-create'
  | 'client-contracts-list'
  | 'client-contracts-get-by-id'
  | 'client-contracts-update';

const defaults: Record<ClientContractsRateLimitKey, RateLimitEntry> = {
  'client-contracts-create': { max: 30, windowSeconds: 60 },
  'client-contracts-list': { max: 120, windowSeconds: 60 },
  'client-contracts-get-by-id': { max: 120, windowSeconds: 60 },
  'client-contracts-update': { max: 60, windowSeconds: 60 },
};

export function buildClientContractsRateLimitConfig(): Record<
  ClientContractsRateLimitKey,
  RateLimitEntry
> {
  return {
    'client-contracts-create': rateLimitEntryFromEnv(
      'RATE_LIMIT_CLIENT_CONTRACTS_CREATE',
      defaults['client-contracts-create'],
    ),
    'client-contracts-list': rateLimitEntryFromEnv(
      'RATE_LIMIT_CLIENT_CONTRACTS_LIST',
      defaults['client-contracts-list'],
    ),
    'client-contracts-get-by-id': rateLimitEntryFromEnv(
      'RATE_LIMIT_CLIENT_CONTRACTS_GET_BY_ID',
      defaults['client-contracts-get-by-id'],
    ),
    'client-contracts-update': rateLimitEntryFromEnv(
      'RATE_LIMIT_CLIENT_CONTRACTS_UPDATE',
      defaults['client-contracts-update'],
    ),
  };
}
