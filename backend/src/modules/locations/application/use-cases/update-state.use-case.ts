import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { STATE_REPOSITORY } from 'src/modules/locations/di.tokens';
import type { StateRepositoryPort } from 'src/modules/locations/domain/ports/repository/state.repository.port';
import { StateEntity } from 'src/modules/locations/domain/entities/state.entity';
import type { UpdateStateBody } from '../dto/state.dto';
import { LOCATION_API_ERROR_CODES } from '../errors';

@Injectable()
export class UpdateStateUseCase {
  constructor(@Inject(STATE_REPOSITORY) private readonly states: StateRepositoryPort) {}

  async execute(uuid: string, body: UpdateStateBody): Promise<StateEntity> {
    const existing = await this.states.findByUuid(uuid);
    if (!existing) {
      throw new ApplicationException(LOCATION_API_ERROR_CODES.STATE_NOT_FOUND, 'State not found');
    }
    const now = new Date();
    let code = existing.code;
    if (body.code !== undefined) {
      code = body.code === null ? null : body.code.trim().toUpperCase();
    }
    return this.states.update(
      StateEntity.create({
        id: existing.id,
        name: body.name.trim(),
        code,
        countryId: existing.countryId,
        createdAt: existing.createdAt,
        updatedAt: now,
      }),
    );
  }
}
