import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { randomUUID } from 'node:crypto';
import { COUNTRY_REPOSITORY, STATE_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { CountryRepositoryPort } from 'src/modules/locations/domain/ports/repository/country.repository.port';
import type { StateRepositoryPort } from 'src/modules/locations/domain/ports/repository/state.repository.port';
import { StateEntity } from 'src/modules/locations/domain/entities/state.entity';
import type { CreateStateBody } from '../dto/state.dto';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class CreateStateUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY) private readonly countries: CountryRepositoryPort,
    @Inject(STATE_REPOSITORY) private readonly states: StateRepositoryPort,
  ) {}

  async execute(body: CreateStateBody): Promise<StateEntity> {
    const country = await this.countries.findByUuid(body.countryUuid);
    if (!country) {
      throw new ApplicationException(
        LOCATION_API_ERROR_CODES.PARENT_COUNTRY_INVALID,
        'Country not found',
      );
    }
    const now = new Date();
    const code = body.code?.trim() ? body.code.trim().toUpperCase() : null;
    return this.states.create(
      StateEntity.create({
        id: randomUUID(),
        name: body.name.trim(),
        code,
        countryId: body.countryUuid,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }
}
