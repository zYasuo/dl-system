import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { randomUUID } from 'node:crypto';
import { DomainError } from 'src/common/errors/domain.error';
import { Address } from 'src/common/vo/address.vo';
import { ValidateAddressGeoUseCase } from 'src/modules/locations/application/use-cases/validate-address-geo.use-case';
import { ClientCacheKeyBuilder } from '../cache/client-cache-key-builder';
import { CLIENT_REPOSITORY } from '../../di.tokens';
import type { ClientRepositoryPort } from '../../domain/ports/repository/client.repository.port';
import { ClientEntity } from '../../domain/entities/client.entity';
import { Cnpj } from '../../domain/vo/cnpj.vo';
import { Cpf } from '../../domain/vo/cpf.vo';
import type { CreateClientBody } from '../dto/create-client.dto';
import { CLIENT_API_ERROR_CODES } from '../errors';

@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepositoryPort,
    private readonly clientCacheKeyBuilder: ClientCacheKeyBuilder,
    private readonly validateAddressGeo: ValidateAddressGeoUseCase,
  ) {}

  async execute(input: CreateClientBody): Promise<ClientEntity> {
    const { isForeignNational: _fn, ...payload } = input;
    void _fn;
    const cpf = payload.cpf?.trim() ? Cpf.create(payload.cpf) : undefined;
    const cnpj = payload.cnpj?.trim() ? Cnpj.create(payload.cnpj) : undefined;

    if (cpf) {
      const existing = await this.clientRepository.findByCpf(cpf.value);
      if (existing) {
        throw new ApplicationException(
          CLIENT_API_ERROR_CODES.CPF_ALREADY_REGISTERED,
          'CPF already registered',
        );
      }
    }
    if (cnpj) {
      const existing = await this.clientRepository.findByCnpj(cnpj.value);
      if (existing) {
        throw new ApplicationException(
          CLIENT_API_ERROR_CODES.CNPJ_ALREADY_REGISTERED,
          'CNPJ already registered',
        );
      }
    }

    const now = new Date();
    let entity: ClientEntity;
    try {
      const geo = await this.validateAddressGeo.execute(
        payload.address.stateUuid,
        payload.address.cityUuid,
      );
      const address = Address.createWithGeo(
        {
          street: payload.address.street,
          number: payload.address.number,
          complement: payload.address.complement,
          neighborhood: payload.address.neighborhood,
          zipCode: payload.address.zipCode,
        },
        geo,
      );
      entity = ClientEntity.create({
        id: randomUUID(),
        name: payload.name,
        cpf,
        cnpj,
        address,
        createdAt: now,
        updatedAt: now,
      });
    } catch (e) {
      if (e instanceof DomainError) {
        throw new ApplicationException(CLIENT_API_ERROR_CODES.INVALID_DATA, e.message);
      }
      throw e;
    }

    try {
      const created = await this.clientRepository.create(entity);
      await this.clientCacheKeyBuilder.bumpDetailVersion(created.id);
      await this.clientCacheKeyBuilder.bumpListVersion();
      return created;
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2002') {
        throw new ApplicationException(
          CLIENT_API_ERROR_CODES.DUPLICATE_DOCUMENT,
          'Duplicate document',
        );
      }
      throw e;
    }
  }
}
