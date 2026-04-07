import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { randomUUID } from 'node:crypto';
import { DomainError } from 'src/common/errors/domain.error';
import { Address } from 'src/common/vo/address.vo';
import { ValidateAddressGeoUseCase } from 'src/modules/locations/application/use-cases/validate-address-geo.use-case';
import { CLIENT_REPOSITORY } from 'src/modules/clients/di.tokens';
import type { ClientRepositoryPort } from 'src/modules/clients/domain/ports/repository/client.repository.port';
import { CLIENT_CONTRACT_REPOSITORY } from '../../di.tokens';
import type { ClientContractRepositoryPort } from '../../domain/ports/repository/client-contract.repository.port';
import {
  ClientContractEntity,
  ClientContractStatus,
} from '../../domain/entities/client-contract.entity';
import type { CreateClientContractBody } from '../dto/create-client-contract.dto';
import { CONTRACT_API_ERROR_CODES } from '../errors';

function atStartOfUtcDay(yyyyMmDd: string): Date {
  return new Date(`${yyyyMmDd}T00:00:00.000Z`);
}

@Injectable()
export class CreateClientContractUseCase {
  constructor(
    @Inject(CLIENT_CONTRACT_REPOSITORY)
    private readonly contractRepository: ClientContractRepositoryPort,
    @Inject(CLIENT_REPOSITORY) private readonly clientRepository: ClientRepositoryPort,
    private readonly validateAddressGeo: ValidateAddressGeoUseCase,
  ) {}

  async execute(input: CreateClientContractBody): Promise<ClientContractEntity> {
    const client = await this.clientRepository.findById(input.clientId);
    if (!client) {
      throw new ApplicationException(CONTRACT_API_ERROR_CODES.CLIENT_NOT_FOUND, 'Client not found');
    }

    const startDate = atStartOfUtcDay(input.startDate);
    const endDate = input.endDate ? atStartOfUtcDay(input.endDate) : undefined;

    let address: Address | undefined;
    if (!input.useClientAddress && input.address) {
      const geo = await this.validateAddressGeo.execute(
        input.address.stateUuid,
        input.address.cityUuid,
      );
      address = Address.createWithGeo(
        {
          street: input.address.street,
          number: input.address.number,
          complement: input.address.complement,
          neighborhood: input.address.neighborhood,
          zipCode: input.address.zipCode,
        },
        geo,
      );
    }

    const now = new Date();
    let entity: ClientContractEntity;
    try {
      entity = ClientContractEntity.create({
        id: randomUUID(),
        contractNumber: input.contractNumber,
        clientId: input.clientId,
        useClientAddress: input.useClientAddress,
        address,
        startDate,
        endDate,
        status: ClientContractStatus.ACTIVE,
        createdAt: now,
        updatedAt: now,
      });
    } catch (e) {
      if (e instanceof DomainError) {
        throw new ApplicationException(CONTRACT_API_ERROR_CODES.INVALID_DATA, e.message);
      }
      throw e;
    }

    try {
      return await this.contractRepository.create(entity);
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'code' in e && (e as { code: string }).code === 'P2003') {
        throw new ApplicationException(
          CONTRACT_API_ERROR_CODES.CLIENT_NOT_FOUND,
          'Client not found',
        );
      }
      throw e;
    }
  }
}
