import {
  rateLimitEntryFromEnv,
  type RateLimitEntry,
} from '../../../common/rate-limit/rate-limit-env';

export type AuthRateLimitKey =
  | 'auth-login'
  | 'auth-refresh'
  | 'auth-logout'
  | 'auth-password-reset-request'
  | 'auth-password-reset-confirm';

const defaults: Record<AuthRateLimitKey, RateLimitEntry> = {
  'auth-login': { max: 5, windowSeconds: 900 },
  'auth-refresh': { max: 30, windowSeconds: 60 },
  'auth-logout': { max: 60, windowSeconds: 60 },
  'auth-password-reset-request': { max: 3, windowSeconds: 3600 },
  'auth-password-reset-confirm': { max: 5, windowSeconds: 3600 },
};

export function buildAuthRateLimitConfig(): Record<AuthRateLimitKey, RateLimitEntry> {
  return {
    'auth-login': rateLimitEntryFromEnv('RATE_LIMIT_AUTH_LOGIN', defaults['auth-login']),
    'auth-refresh': rateLimitEntryFromEnv('RATE_LIMIT_AUTH_REFRESH', defaults['auth-refresh']),
    'auth-logout': rateLimitEntryFromEnv('RATE_LIMIT_AUTH_LOGOUT', defaults['auth-logout']),
    'auth-password-reset-request': rateLimitEntryFromEnv(
      'RATE_LIMIT_AUTH_PASSWORD_RESET_REQUEST',
      defaults['auth-password-reset-request'],
    ),
    'auth-password-reset-confirm': rateLimitEntryFromEnv(
      'RATE_LIMIT_AUTH_PASSWORD_RESET_CONFIRM',
      defaults['auth-password-reset-confirm'],
    ),
  };
}
