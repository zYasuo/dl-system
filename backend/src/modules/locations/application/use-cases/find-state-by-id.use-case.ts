import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { STATE_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { StateRepositoryPort } from 'src/modules/locations/domain/ports/repository/state.repository.port';
import { StateEntity } from 'src/modules/locations/domain/entities/state.entity';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class FindStateByIdUseCase {
  constructor(@Inject(STATE_REPOSITORY) private readonly states: StateRepositoryPort) {}

  async execute(uuid: string): Promise<StateEntity> {
    const row = await this.states.findByUuid(uuid);
    if (!row) {
      throw new ApplicationException(LOCATION_API_ERROR_CODES.STATE_NOT_FOUND, 'State not found');
    }
    return row;
  }
}
