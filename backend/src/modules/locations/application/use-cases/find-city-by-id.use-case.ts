import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { CITY_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { CityRepositoryPort } from 'src/modules/locations/domain/ports/repository/city.repository.port';
import { CityEntity } from 'src/modules/locations/domain/entities/city.entity';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class FindCityByIdUseCase {
  constructor(@Inject(CITY_REPOSITORY) private readonly cities: CityRepositoryPort) {}

  async execute(uuid: string): Promise<CityEntity> {
    const row = await this.cities.findByUuid(uuid);
    if (!row) {
      throw new ApplicationException(LOCATION_API_ERROR_CODES.CITY_NOT_FOUND, 'City not found');
    }
    return row;
  }
}
