import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { CITY_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { CityRepositoryPort } from 'src/modules/locations/domain/ports/repository/city.repository.port';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class DeleteCityUseCase {
  constructor(@Inject(CITY_REPOSITORY) private readonly cities: CityRepositoryPort) {}

  async execute(uuid: string): Promise<void> {
    const existing = await this.cities.findByUuid(uuid);
    if (!existing) {
      throw new ApplicationException(LOCATION_API_ERROR_CODES.CITY_NOT_FOUND, 'City not found');
    }
    try {
      await this.cities.deleteByUuid(uuid);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2003') {
        throw new ApplicationException(
          LOCATION_API_ERROR_CODES.CITY_REFERENCED,
          'City is referenced by clients or contracts',
        );
      }
      throw e;
    }
  }
}
