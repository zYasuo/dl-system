import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { COUNTRY_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { CountryRepositoryPort } from 'src/modules/locations/domain/ports/repository/country.repository.port';
import { CountryEntity } from 'src/modules/locations/domain/entities/country.entity';
import type { UpdateCountryBody } from '../dto/country.dto';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class UpdateCountryUseCase {
  constructor(@Inject(COUNTRY_REPOSITORY) private readonly countries: CountryRepositoryPort) {}

  async execute(uuid: string, body: UpdateCountryBody): Promise<CountryEntity> {
    const existing = await this.countries.findByUuid(uuid);
    if (!existing) {
      throw new ApplicationException(
        LOCATION_API_ERROR_CODES.COUNTRY_NOT_FOUND,
        'Country not found',
      );
    }
    const now = new Date();
    return this.countries.update(
      CountryEntity.create({
        id: existing.id,
        name: body.name.trim(),
        createdAt: existing.createdAt,
        updatedAt: now,
      }),
    );
  }
}
