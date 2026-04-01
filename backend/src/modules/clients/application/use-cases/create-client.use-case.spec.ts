import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'node:crypto';
import { CLIENT_REPOSITORY } from '../../di.tokens';
import type { ClientRepositoryPort } from '../../domain/ports/repository/client.repository.port';
import { ClientEntity } from '../../domain/entities/client.entity';
import { Cpf } from '../../domain/vo/cpf.vo';
import { Address } from 'src/common/vo/address.vo';
import { ClientCacheKeyBuilder } from '../cache/client-cache-key-builder';
import { CreateClientUseCase } from './create-client.use-case';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let repo: jest.Mocked<ClientRepositoryPort>;
  let cacheKeys: jest.Mocked<Pick<ClientCacheKeyBuilder, 'bumpDetailVersion' | 'bumpListVersion'>>;

  const address = {
    street: 'Rua A',
    number: '1',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310100',
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByInternalId: jest.fn(),
      findByCpf: jest.fn(),
      findByCnpj: jest.fn(),
      searchByAddress: jest.fn(),
    };

    cacheKeys = {
      bumpDetailVersion: jest.fn().mockResolvedValue(undefined),
      bumpListVersion: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateClientUseCase,
        { provide: CLIENT_REPOSITORY, useValue: repo },
        { provide: ClientCacheKeyBuilder, useValue: cacheKeys },
      ],
    }).compile();

    useCase = module.get(CreateClientUseCase);
  });

  it('throws ConflictException when CPF exists', async () => {
    const id = randomUUID();
    repo.findByCpf.mockResolvedValue(
      ClientEntity.create({
        id,
        name: 'Other',
        cpf: Cpf.create('52998224725'),
        address: Address.create(address),
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({ name: 'New', cpf: '52998224725', address }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('persists new client', async () => {
    repo.findByCpf.mockResolvedValue(null);
    repo.findByCnpj.mockResolvedValue(null);
    repo.create.mockImplementation(async (c) => c);

    const created = await useCase.execute({ name: 'ACME', cnpj: '11.222.333/0001-81', address });

    expect(created.name).toBe('ACME');
    expect(repo.create).toHaveBeenCalled();
    expect(cacheKeys.bumpDetailVersion).toHaveBeenCalledWith(created.id);
    expect(cacheKeys.bumpListVersion).toHaveBeenCalled();
  });
});
