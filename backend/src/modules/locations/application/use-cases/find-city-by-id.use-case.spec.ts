import { LOCATION_API_ERROR_CODES } from '../errors';
import { randomUUID } from 'node:crypto';
import type { CityRepositoryPort } from 'src/modules/locations/domain/ports/repository/city.repository.port';
import { CityEntity } from 'src/modules/locations/domain/entities/city.entity';
import { FindCityByIdUseCase } from './find-city-by-id.use-case';

describe('FindCityByIdUseCase', () => {
  const row = CityEntity.create({
    id: randomUUID(),
    name: 'C',
    stateId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('throws when not found', async () => {
    const cities = { findByUuid: jest.fn().mockResolvedValue(null) };
    const useCase = new FindCityByIdUseCase(cities as unknown as CityRepositoryPort);

    await expect(useCase.execute('x')).rejects.toMatchObject({
      code: LOCATION_API_ERROR_CODES.CITY_NOT_FOUND,
    });
  });

  it('returns when found', async () => {
    const cities = { findByUuid: jest.fn().mockResolvedValue(row) };
    const useCase = new FindCityByIdUseCase(cities as unknown as CityRepositoryPort);

    await expect(useCase.execute(row.id)).resolves.toBe(row);
  });
});
