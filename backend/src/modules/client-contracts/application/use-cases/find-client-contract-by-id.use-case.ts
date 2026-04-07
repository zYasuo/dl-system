import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from 'src/common/errors/application';
import { CLIENT_CONTRACT_REPOSITORY } from '../../di.tokens';
import type { ClientContractRepositoryPort } from '../../domain/ports/repository/client-contract.repository.port';
import { ClientContractEntity } from '../../domain/entities/client-contract.entity';
import { CONTRACT_API_ERROR_CODES } from '../errors';

@Injectable()
export class FindClientContractByIdUseCase {
  constructor(
    @Inject(CLIENT_CONTRACT_REPOSITORY)
    private readonly contractRepository: ClientContractRepositoryPort,
  ) {}

  async execute(id: string): Promise<ClientContractEntity> {
    const row = await this.contractRepository.findById(id);
    if (!row) {
      throw new ApplicationException(CONTRACT_API_ERROR_CODES.NOT_FOUND, 'Contract not found');
    }
    return row;
  }
}
