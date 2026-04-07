import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { CITY_REPOSITORY, STATE_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { CityRepositoryPort } from 'src/modules/locations/domain/ports/repository/city.repository.port';
import type { StateRepositoryPort } from 'src/modules/locations/domain/ports/repository/state.repository.port';
import { CityEntity } from 'src/modules/locations/domain/entities/city.entity';
import type { ListCitiesQuery } from '../dto/city.dto';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class ListCitiesByStateUseCase {
  constructor(
    @Inject(STATE_REPOSITORY) private readonly states: StateRepositoryPort,
    @Inject(CITY_REPOSITORY) private readonly cities: CityRepositoryPort,
  ) {}

  async execute(query: ListCitiesQuery): Promise<CityEntity[]> {
    const state = await this.states.findByUuid(query.stateUuid);
    if (!state) {
      throw new ApplicationException(
        LOCATION_API_ERROR_CODES.PARENT_STATE_INVALID,
        'State not found',
      );
    }
    return this.cities.findByStateUuid(query.stateUuid);
  }
}
