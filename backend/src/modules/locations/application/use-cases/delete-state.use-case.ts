import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { STATE_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { StateRepositoryPort } from 'src/modules/locations/domain/ports/repository/state.repository.port';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class DeleteStateUseCase {
  constructor(@Inject(STATE_REPOSITORY) private readonly states: StateRepositoryPort) {}

  async execute(uuid: string): Promise<void> {
    const existing = await this.states.findByUuid(uuid);
    if (!existing) {
      throw new ApplicationException(LOCATION_API_ERROR_CODES.STATE_NOT_FOUND, 'State not found');
    }
    try {
      await this.states.deleteByUuid(uuid);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2003') {
        throw new ApplicationException(
          LOCATION_API_ERROR_CODES.STATE_REFERENCED,
          'State is referenced by cities or clients',
        );
      }
      throw e;
    }
  }
}
