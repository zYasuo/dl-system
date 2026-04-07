/**
 * Erros de aplicação (código estável) e mapeamento para resposta HTTP.
 * Os módulos definem erros em `application/errors/` (`*-api-error-codes.ts` + `*-api-error-http.map.ts`);
 * o registo agrega todos os mapas.
 */
export { ApplicationException } from './application.exception';
export type { ApplicationErrorHttpMeta } from './application-error-http.types';
export { resolveApplicationErrorHttp } from './application-error-http.registry';
export { COMMON_API_ERROR_CODES } from './common-api-error-codes';
export type { CommonApiErrorCode } from './common-api-error-codes';
export { commonApiErrorHttpMap } from './common-api-error-http.map';
