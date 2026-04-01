import { Inject, Injectable, Logger } from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { PaginatedResult } from 'src/common/pagination/pagination.types';
import { CLIENT_REPOSITORY } from '../../di.tokens';
import type { ClientRepositoryPort } from '../../domain/ports/repository/client.repository.port';
import { ClientEntity } from '../../domain/entities/client.entity';
import { Cpf } from '../../domain/vo/cpf.vo';
import type { SearchClientsQuery } from '../dto/search-clients.dto';

const PG_INT_MAX = 2_147_483_647;

export type ClientSearchMatchKind = 'cpf' | 'id' | 'address';

export type ClientSearchConfidence = 'exact' | 'partial';

export type ClientSearchItem = {
  client: ClientEntity;
  match: { kind: ClientSearchMatchKind; confidence: ClientSearchConfidence };
};

export type ClientSearchResult = PaginatedResult<ClientSearchItem>;

function stripNonDigits(raw: string): string {
  return raw.replace(/\D/gu, '');
}

function parseSafeInternalId(trimmed: string): number | null {
  if (!/^\d+$/u.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < 1 || n > PG_INT_MAX) return null;
  return n;
}

function hashQueryForAudit(trimmed: string): string {
  return createHash('sha256').update(trimmed, 'utf8').digest('hex').slice(0, 16);
}

@Injectable()
export class SearchClientsUseCase {
  private readonly logger = new Logger(SearchClientsUseCase.name);

  constructor(@Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepositoryPort) {}

  async execute(input: SearchClientsQuery, userUuid: string): Promise<ClientSearchResult> {
    const trimmed = input.q.trim();
    const qHash = hashQueryForAudit(trimmed);
    const digitOnly = stripNonDigits(trimmed);

    if (digitOnly.length === 11 && Cpf.isValidDigitChecksum(digitOnly)) {
      const byCpf = await this.clientRepository.findByCpf(digitOnly);
      if (byCpf) {
        this.logAudit(userUuid, 'cpf', 1, qHash);
        return this.wrapExact(byCpf, 'cpf', input.page, input.limit);
      }

      const maybeIdAfterCpfMiss = parseSafeInternalId(digitOnly);
      if (maybeIdAfterCpfMiss !== null) {
        const byId = await this.clientRepository.findByInternalId(maybeIdAfterCpfMiss);
        if (byId) {
          this.logAudit(userUuid, 'id', 1, qHash);
          return this.wrapExact(byId, 'id', input.page, input.limit);
        }
      }

      const addressPage = await this.clientRepository.searchByAddress({
        term: trimmed,
        page: input.page,
        limit: input.limit,
      });

      this.logAudit(userUuid, 'address', addressPage.meta.total, qHash);
      return this.wrapAddressPage(addressPage);
    }

    const maybeId = parseSafeInternalId(trimmed);
    if (maybeId !== null) {
      const byId = await this.clientRepository.findByInternalId(maybeId);
      if (byId) {
        this.logAudit(userUuid, 'id', 1, qHash);
        return this.wrapExact(byId, 'id', input.page, input.limit);
      }
    }

    const addressPage = await this.clientRepository.searchByAddress({
      term: trimmed,
      page: input.page,
      limit: input.limit,
    });
    this.logAudit(userUuid, 'address', addressPage.meta.total, qHash);
    return this.wrapAddressPage(addressPage);
  }

  private wrapExact(
    client: ClientEntity,
    kind: 'cpf' | 'id',
    page: number,
    limit: number,
  ): ClientSearchResult {
    const total = 1;
    const totalPages = 1;
    if (page > 1) {
      return {
        data: [],
        meta: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: false,
          hasPreviousPage: page > 1,
          nextCursor: null,
        },
      };
    }

    return {
      data: [{ client, match: { kind, confidence: 'exact' } }],
      meta: {
        total,
        page: 1,
        limit,
        totalPages,
        hasNextPage: false,
        hasPreviousPage: false,
        nextCursor: null,
      },
    };
  }

  private wrapAddressPage(page: PaginatedResult<ClientEntity>): ClientSearchResult {
    return {
      data: page.data.map((client) => ({
        client,
        match: { kind: 'address' as const, confidence: 'partial' as const },
      })),
      meta: page.meta,
    };
  }

  private logAudit(
    userUuid: string,
    matchKind: ClientSearchMatchKind,
    resultCount: number,
    qHash: string,
  ): void {
    this.logger.log(
      JSON.stringify({
        action: 'client_search',
        userUuid,
        matchKind,
        resultCount,
        qHash,
      }),
    );
  }
}
