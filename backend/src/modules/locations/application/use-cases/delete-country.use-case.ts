import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { COUNTRY_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { CountryRepositoryPort } from 'src/modules/locations/domain/ports/repository/country.repository.port';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class DeleteCountryUseCase {
  constructor(@Inject(COUNTRY_REPOSITORY) private readonly countries: CountryRepositoryPort) {}

  async execute(uuid: string): Promise<void> {
    const existing = await this.countries.findByUuid(uuid);
    if (!existing) {
      throw new ApplicationException(
        LOCATION_API_ERROR_CODES.COUNTRY_NOT_FOUND,
        'Country not found',
      );
    }
    try {
      await this.countries.deleteByUuid(uuid);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2003') {
        throw new ApplicationException(
          LOCATION_API_ERROR_CODES.COUNTRY_REFERENCED,
          'Country is referenced by states or other records',
        );
      }
      throw e;
    }
  }
}
